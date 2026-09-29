import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { sql } from "@/lib/db";
import { assetUrl } from "@/lib/paths";

const UPLOAD_DIR = "wp-content/uploads/instagram";

async function download(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TTP-Site/1.0)" },
  });
  if (!response.ok) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1024) return null;
  const kind =
    buffer[0] === 0xff && buffer[1] === 0xd8
      ? "jpg"
      : buffer[0] === 0x89 && buffer[1] === 0x50
        ? "png"
        : buffer.subarray(0, 4).toString("utf8") === "RIFF" && buffer.subarray(8, 12).toString("utf8") === "WEBP"
          ? "webp"
          : null;
  if (!kind) return null;
  return { buffer, kind };
}

async function storeImage(url: string, key: string) {
  const file = await download(url);
  if (!file) return null;
  const safeKey = key.replace(/[^A-Za-z0-9_-]/g, "") || "post";
  const filename = `ig-${safeKey}.${file.kind}`;
  const directory = path.join(process.cwd(), "public", UPLOAD_DIR);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), file.buffer);
  return `${UPLOAD_DIR}/${filename}`;
}

async function setting(key: string) {
  const rows = await sql<{ setting_value: string | null }[]>`
    SELECT setting_value FROM site_settings WHERE setting_key = ${key}
  `;
  return rows[0]?.setting_value ?? "";
}

async function setSetting(key: string, value: string) {
  await sql`
    INSERT INTO site_settings (setting_key, setting_value)
    VALUES (${key}, ${value})
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value
  `;
}

type IncomingPost = {
  ig_id: string;
  permalink: string;
  image_url: string;
  caption: string;
  media_type: string;
  posted_at: string | null;
};

async function upsert(post: IncomingPost, order: number) {
  const existing = post.ig_id
    ? (
        await sql<{ id: number; image: string }[]>`
          SELECT id, image FROM instagram_posts WHERE ig_id = ${post.ig_id} LIMIT 1
        `
      )[0]
    : undefined;
  let image = existing?.image ?? "";
  if (!image || !assetUrl(image)) {
    image = (await storeImage(post.image_url, post.ig_id || post.permalink)) ?? "";
  }
  if (!image) return null;
  if (existing) {
    await sql`
      UPDATE instagram_posts
      SET permalink = ${post.permalink},
          image = ${image},
          caption = ${post.caption},
          media_type = ${post.media_type},
          posted_at = ${post.posted_at},
          sort_order = ${order}
      WHERE id = ${existing.id}
    `;
    return post.ig_id;
  }
  await sql`
    INSERT INTO instagram_posts (ig_id, permalink, image, caption, media_type, posted_at, sort_order)
    VALUES (${post.ig_id || null}, ${post.permalink}, ${image}, ${post.caption}, ${post.media_type}, ${post.posted_at}, ${order})
  `;
  return post.ig_id || post.permalink;
}

async function replaceAll(posts: IncomingPost[], source: string) {
  const saved: string[] = [];
  let order = 0;
  for (const post of posts) {
    const id = await upsert(post, order);
    if (id) {
      saved.push(id);
      order += 1;
    }
  }
  if (!saved.length) return { ok: false as const, message: "Hiçbir gönderi görseli indirilemedi, mevcut kayıtlar korundu." };

  const stale = await sql<{ id: number; image: string }[]>`
    SELECT id, image FROM instagram_posts
    WHERE ig_id IS NULL OR NOT (ig_id = ANY(${saved}))
  `;
  for (const row of stale) {
    const relative = row.image.replace(/^\/+/, "");
    if (relative.startsWith("wp-content/uploads/instagram/") && !relative.includes("..")) {
      await unlink(path.join(process.cwd(), "public", relative)).catch(() => undefined);
    }
    await sql`DELETE FROM instagram_posts WHERE id = ${row.id}`;
  }
  await setSetting("instagram_last_sync", new Date().toISOString().slice(0, 19).replace("T", " "));
  return { ok: true as const, message: `${saved.length} gönderi güncellendi (kaynak: ${source}).` };
}

async function syncFromApi() {
  const token = (await setting("instagram_access_token")).trim();
  if (!token) return { ok: false as const, message: "Instagram erişim anahtarı girilmemiş." };
  const endpoint = new URL("https://graph.instagram.com/me/media");
  endpoint.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  endpoint.searchParams.set("limit", "20");
  endpoint.searchParams.set("access_token", token);
  const response = await fetch(endpoint);
  if (!response.ok) return { ok: false as const, message: "Instagram API'sine ulaşılamadı." };
  const json = (await response.json()) as {
    error?: { message?: string };
    data?: Array<{
      id?: string;
      caption?: string;
      media_type?: string;
      media_url?: string;
      thumbnail_url?: string;
      permalink?: string;
      timestamp?: string;
    }>;
  };
  if (json.error) return { ok: false as const, message: `Instagram API hatası: ${json.error.message ?? "bilinmeyen hata"}` };
  if (!json.data?.length) return { ok: false as const, message: "Instagram API boş yanıt döndürdü." };
  const posts: IncomingPost[] = [];
  for (const item of json.data) {
    const image = item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url;
    if (!image) continue;
    posts.push({
      ig_id: String(item.id ?? ""),
      permalink: item.permalink ?? "",
      image_url: image,
      caption: item.caption ?? "",
      media_type: (item.media_type ?? "IMAGE").toLowerCase().replace("carousel_album", "carousel"),
      posted_at: item.timestamp ? item.timestamp.replace("T", " ").replace("Z", "").slice(0, 19) : null,
    });
  }
  return replaceAll(posts, "Instagram API");
}

async function syncFromLegacy() {
  const pageUrl = "https://www.terorsuzturkiyeplatformu.org/";
  const response = await fetch(pageUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TTP-Site/1.0)" },
  });
  if (!response.ok) return { ok: false as const, message: `Eski siteye ulaşılamadı: ${pageUrl}` };
  const html = await response.text();
  const pattern =
    /<div class="sbi_item sbi_type_(\w+)[^"]*"[^>]*id="sbi_([0-9_]+)"[^>]*data-date="(\d+)"[\s\S]{0,4000}?<a class="sbi_photo" href="([^"]+)"[^>]*data-full-res="([^"]+)"/g;
  const posts: IncomingPost[] = [];
  for (const match of html.matchAll(pattern)) {
    if (posts.length >= 20) break;
    posts.push({
      ig_id: match[2],
      permalink: match[4],
      image_url: match[5],
      caption: "",
      media_type: match[1],
      posted_at: new Date(Number(match[3]) * 1000).toISOString().slice(0, 19).replace("T", " "),
    });
  }
  if (!posts.length) return { ok: false as const, message: "Eski sitede Instagram gönderisi bulunamadı." };
  return replaceAll(posts, "eski site");
}

export async function syncInstagram() {
  if ((await setting("instagram_access_token")).trim()) return syncFromApi();
  return syncFromLegacy();
}
