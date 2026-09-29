"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attemptLogin, changePassword, clearSession, lockSecondsLeft, requireAdmin, clientIp } from "@/lib/auth";
import { sql } from "@/lib/db";
import { sanitizeRichText } from "@/lib/html";
import { syncInstagram } from "@/lib/instagram";
import { redirectWithNotice } from "@/lib/notice";
import { slugify } from "@/lib/paths";
import { saveUpload } from "@/lib/upload";

function refreshPublic() {
  revalidatePath("/");
  revalidatePath("/haberler");
  revalidatePath("/kurumsal/hakkimizda");
  revalidatePath("/kurumsal/tuzuk");
  revalidatePath("/kurumsal/belgeler");
  revalidatePath("/il-ve-ilce-baskanliklari");
  revalidatePath("/iletisim");
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) redirectWithNotice("/admin/login", "err", "Kullanıcı adı ve şifre zorunludur.");
  const locked = await lockSecondsLeft(await clientIp());
  if (locked > 0) {
    redirectWithNotice("/admin/login", "err", `Çok fazla deneme. ${locked} saniye sonra tekrar deneyin.`);
  }
  const result = await attemptLogin(username, password);
  if (!result.ok) {
    if (result.locked > 0) {
      redirectWithNotice("/admin/login", "err", `Çok fazla deneme. ${result.locked} saniye sonra tekrar deneyin.`);
    }
    redirectWithNotice("/admin/login", "err", "Kullanıcı adı veya şifre hatalı.");
  }
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function passwordAction(formData: FormData) {
  const session = await requireAdmin();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const again = String(formData.get("again") ?? "");
  if (next.length < 8) redirectWithNotice("/admin/password", "err", "Yeni şifre en az 8 karakter olmalı.");
  if (next !== again) redirectWithNotice("/admin/password", "err", "Yeni şifreler eşleşmiyor.");
  const changed = await changePassword(session.id, current, next);
  if (!changed) redirectWithNotice("/admin/password", "err", "Mevcut şifre hatalı.");
  redirectWithNotice("/admin/password", "ok", "Şifre güncellendi.");
}

export async function boardAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") ?? 0);
  if (formData.get("delete_id")) {
    await sql`DELETE FROM board_members WHERE id = ${Number(formData.get("delete_id"))}`;
    refreshPublic();
    redirectWithNotice("/admin/board", "ok", "Üye silindi.");
  }
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const org = String(formData.get("org") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!name || !title) redirectWithNotice(`/admin/board${id ? `?edit=${id}` : ""}`, "err", "Ad soyad ve unvan zorunludur.");
  const upload = await saveUpload(formData.get("photo"), ["jpg", "png", "webp", "gif"]);
  if (upload.error) redirectWithNotice(`/admin/board${id ? `?edit=${id}` : ""}`, "err", upload.error);
  if (id) {
    if (upload.path) {
      await sql`UPDATE board_members SET name = ${name}, title = ${title}, org = ${org}, photo = ${upload.path}, sort_order = ${sortOrder} WHERE id = ${id}`;
    } else {
      await sql`UPDATE board_members SET name = ${name}, title = ${title}, org = ${org}, sort_order = ${sortOrder} WHERE id = ${id}`;
    }
    refreshPublic();
    redirectWithNotice("/admin/board", "ok", "Üye güncellendi.");
  }
  await sql`
    INSERT INTO board_members (name, title, org, photo, sort_order)
    VALUES (${name}, ${title}, ${org}, ${upload.path ?? ""}, ${sortOrder})
  `;
  refreshPublic();
  redirectWithNotice("/admin/board", "ok", "Üye eklendi.");
}

export async function coordinatorAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") ?? 0);
  if (formData.get("delete_id")) {
    await sql`DELETE FROM region_coordinators WHERE id = ${Number(formData.get("delete_id"))}`;
    refreshPublic();
    redirectWithNotice("/admin/region-coordinators", "ok", "Kayıt silindi.");
  }
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!name || !title) {
    redirectWithNotice(`/admin/region-coordinators${id ? `?edit=${id}` : ""}`, "err", "Ad soyad ve unvan zorunludur.");
  }
  const photo = await saveUpload(formData.get("photo"), ["jpg", "png", "webp", "gif"]);
  const certificate = await saveUpload(formData.get("certificate"), ["jpg", "png", "webp", "gif"]);
  if (photo.error || certificate.error) {
    redirectWithNotice(`/admin/region-coordinators${id ? `?edit=${id}` : ""}`, "err", photo.error || certificate.error || "Dosya hatası.");
  }
  if (id) {
    await sql`
      UPDATE region_coordinators
      SET name = ${name},
          title = ${title},
          sort_order = ${sortOrder},
          photo = COALESCE(${photo.path}, photo),
          certificate = COALESCE(${certificate.path}, certificate)
      WHERE id = ${id}
    `;
    refreshPublic();
    redirectWithNotice("/admin/region-coordinators", "ok", "Kayıt güncellendi.");
  }
  await sql`
    INSERT INTO region_coordinators (title, name, photo, certificate, sort_order)
    VALUES (${title}, ${name}, ${photo.path ?? ""}, ${certificate.path ?? ""}, ${sortOrder})
  `;
  refreshPublic();
  redirectWithNotice("/admin/region-coordinators", "ok", "Kayıt eklendi.");
}

export async function representativeAction(formData: FormData) {
  await requireAdmin();
  const plate = String(formData.get("plate") ?? "").padStart(2, "0");
  const back = `/admin/representatives/${plate}`;
  if (formData.get("delete_rep")) {
    await sql`DELETE FROM representatives WHERE plate = ${plate}`;
    refreshPublic();
    redirectWithNotice("/admin/representatives", "ok", "İl başkanlığı silindi.");
  }
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || "İl Başkanı";
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!name) redirectWithNotice(back, "err", "Ad soyad zorunludur.");
  const photo = await saveUpload(formData.get("photo"), ["jpg", "png", "webp", "gif"]);
  const certificate = await saveUpload(formData.get("certificate"), ["jpg", "png", "webp", "gif"]);
  if (photo.error || certificate.error) redirectWithNotice(back, "err", photo.error || certificate.error || "Dosya hatası.");
  await sql`
    INSERT INTO representatives (plate, name, title, photo, certificate, sort_order)
    VALUES (${plate}, ${name}, ${title}, ${photo.path ?? ""}, ${certificate.path ?? ""}, ${sortOrder})
    ON CONFLICT (plate) DO UPDATE SET
      name = EXCLUDED.name,
      title = EXCLUDED.title,
      sort_order = EXCLUDED.sort_order,
      photo = COALESCE(NULLIF(${photo.path}, ''), representatives.photo),
      certificate = COALESCE(NULLIF(${certificate.path}, ''), representatives.certificate)
  `;
  refreshPublic();
  redirectWithNotice(back, "ok", "İl başkanlığı kaydedildi.");
}

export async function memberAction(formData: FormData) {
  await requireAdmin();
  const plate = String(formData.get("plate") ?? "").padStart(2, "0");
  const back = `/admin/representatives/${plate}`;
  if (formData.get("delete_id")) {
    await sql`DELETE FROM representative_members WHERE id = ${Number(formData.get("delete_id"))}`;
    refreshPublic();
    redirectWithNotice(back, "ok", "Üye silindi.");
  }
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const parentRaw = String(formData.get("parent_id") ?? "");
  const parentId = parentRaw ? Number(parentRaw) : null;
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!name) redirectWithNotice(back, "err", "Ad soyad zorunludur.");
  const photo = await saveUpload(formData.get("photo"), ["jpg", "png", "webp", "gif"]);
  const certificate = await saveUpload(formData.get("certificate"), ["jpg", "png", "webp", "gif"]);
  if (photo.error || certificate.error) redirectWithNotice(back, "err", photo.error || certificate.error || "Dosya hatası.");
  if (id) {
    await sql`
      UPDATE representative_members
      SET name = ${name},
          title = ${title},
          parent_id = ${parentId},
          sort_order = ${sortOrder},
          photo = COALESCE(${photo.path}, photo),
          certificate = COALESCE(${certificate.path}, certificate)
      WHERE id = ${id} AND plate = ${plate}
    `;
    refreshPublic();
    redirectWithNotice(back, "ok", "Üye güncellendi.");
  }
  await sql`
    INSERT INTO representative_members (plate, parent_id, name, title, photo, certificate, sort_order)
    VALUES (${plate}, ${parentId}, ${name}, ${title}, ${photo.path ?? ""}, ${certificate.path ?? ""}, ${sortOrder})
  `;
  refreshPublic();
  redirectWithNotice(back, "ok", "Üye eklendi.");
}

export async function newsAction(formData: FormData) {
  await requireAdmin();
  if (formData.get("delete_id")) {
    await sql`DELETE FROM news WHERE id = ${Number(formData.get("delete_id"))}`;
    refreshPublic();
    redirectWithNotice("/admin/news", "ok", "Haber silindi.");
  }
  const id = Number(formData.get("id") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const body = sanitizeRichText(String(formData.get("body_html") ?? ""));
  const publishedAt = String(formData.get("published_at") ?? "").slice(0, 10);
  let slug = slugify(String(formData.get("slug") ?? "")) || slugify(title);
  if (!title || !slug || !publishedAt) {
    redirectWithNotice(`/admin/news${id ? `?edit=${id}` : ""}`, "err", "Başlık ve tarih zorunludur.");
  }
  const taken = await sql<{ id: number }[]>`
    SELECT id FROM news WHERE slug = ${slug} AND id <> ${id} LIMIT 1
  `;
  if (taken.length) slug = `${slug}-${Date.now().toString(36).slice(-5)}`;
  const cover = await saveUpload(formData.get("cover_image"), ["jpg", "png", "webp", "gif"]);
  if (cover.error) redirectWithNotice(`/admin/news${id ? `?edit=${id}` : ""}`, "err", cover.error);
  if (id) {
    if (cover.path) {
      await sql`
        UPDATE news SET slug = ${slug}, title = ${title}, body_html = ${body}, cover_image = ${cover.path}, published_at = ${publishedAt}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE news SET slug = ${slug}, title = ${title}, body_html = ${body}, published_at = ${publishedAt}
        WHERE id = ${id}
      `;
    }
    refreshPublic();
    redirectWithNotice("/admin/news", "ok", "Haber güncellendi.");
  }
  await sql`
    INSERT INTO news (slug, title, body_html, cover_image, published_at)
    VALUES (${slug}, ${title}, ${body}, ${cover.path ?? ""}, ${publishedAt})
  `;
  refreshPublic();
  redirectWithNotice("/admin/news", "ok", "Haber eklendi.");
}

async function saveSetting(key: string, value: string) {
  await sql`
    INSERT INTO site_settings (setting_key, setting_value)
    VALUES (${key}, ${value})
    ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value
  `;
}

export async function textsAction(formData: FormData) {
  await requireAdmin();
  const rich = ["founder_message", "hakkimizda", "vizyon", "misyon", "tuzuk"];
  const plain = ["temel_degerler"];
  for (const key of rich) await saveSetting(key, sanitizeRichText(String(formData.get(key) ?? "")));
  for (const key of plain) await saveSetting(key, String(formData.get(key) ?? ""));
  refreshPublic();
  redirectWithNotice("/admin/site-settings", "ok", "Sayfa metinleri güncellendi.");
}

export async function heroAction(formData: FormData) {
  await requireAdmin();
  for (const key of ["hero_image_desktop", "hero_image_mobile"]) {
    if (formData.get(`clear_${key}`)) {
      await saveSetting(key, "");
      continue;
    }
    const upload = await saveUpload(formData.get(key), ["jpg", "png", "webp", "gif"]);
    if (upload.error) redirectWithNotice("/admin/site-settings", "err", upload.error);
    if (upload.path) await saveSetting(key, upload.path);
  }
  refreshPublic();
  redirectWithNotice("/admin/site-settings", "ok", "Kapak görselleri güncellendi.");
}

export async function documentAction(formData: FormData) {
  await requireAdmin();
  if (formData.get("delete_id")) {
    await sql`DELETE FROM documents WHERE id = ${Number(formData.get("delete_id"))}`;
    refreshPublic();
    redirectWithNotice("/admin/site-settings", "ok", "Belge silindi.");
  }
  const title = String(formData.get("doc_title") ?? "").trim();
  const file = await saveUpload(formData.get("doc_file"), ["pdf", "jpg", "png", "webp"]);
  if (!title || !file.path) redirectWithNotice("/admin/site-settings", "err", file.error || "Belge başlığı ve dosyası zorunludur.");
  await sql`INSERT INTO documents (title, file, sort_order) VALUES (${title}, ${file.path}, 0)`;
  refreshPublic();
  redirectWithNotice("/admin/site-settings", "ok", "Belge eklendi.");
}

export async function contactAction(formData: FormData) {
  await requireAdmin();
  for (const key of ["contact_phone", "contact_whatsapp", "contact_email", "contact_address"]) {
    await saveSetting(key, String(formData.get(key) ?? "").trim());
  }
  refreshPublic();
  redirectWithNotice("/admin/contact", "ok", "İletişim bilgileri güncellendi.");
}

export async function socialAction(formData: FormData) {
  await requireAdmin();
  for (const key of ["social_instagram", "social_facebook", "social_twitter", "social_linkedin", "instagram_username", "instagram_bio", "instagram_access_token"]) {
    await saveSetting(key, String(formData.get(key) ?? "").trim());
  }
  const avatar = await saveUpload(formData.get("instagram_profile_image"), ["jpg", "png", "webp", "gif"]);
  if (avatar.error) redirectWithNotice("/admin/social", "err", avatar.error);
  if (avatar.path) await saveSetting("instagram_profile_image", avatar.path);
  refreshPublic();
  redirectWithNotice("/admin/social", "ok", "Sosyal medya bilgileri güncellendi.");
}

export async function instagramAction(formData: FormData) {
  await requireAdmin();
  if (formData.get("sync")) {
    const result = await syncInstagram();
    refreshPublic();
    redirectWithNotice("/admin/instagram", result.ok ? "ok" : "err", result.message);
  }
  if (formData.get("delete_id")) {
    await sql`DELETE FROM instagram_posts WHERE id = ${Number(formData.get("delete_id"))}`;
    refreshPublic();
    redirectWithNotice("/admin/instagram", "ok", "Gönderi silindi.");
  }
  const permalink = String(formData.get("permalink") ?? "").trim();
  const caption = String(formData.get("caption") ?? "");
  const mediaType = String(formData.get("media_type") ?? "image");
  const image = await saveUpload(formData.get("image"), ["jpg", "png", "webp", "gif"]);
  if (!permalink || !image.path) redirectWithNotice("/admin/instagram", "err", image.error || "Bağlantı ve görsel zorunludur.");
  await sql`
    INSERT INTO instagram_posts (ig_id, permalink, image, caption, media_type, posted_at, sort_order)
    VALUES (NULL, ${permalink}, ${image.path}, ${caption}, ${mediaType}, NOW(), -1)
  `;
  refreshPublic();
  redirectWithNotice("/admin/instagram", "ok", "Gönderi eklendi.");
}
