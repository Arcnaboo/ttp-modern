import { cache } from "react";
import { sql } from "@/lib/db";
import { assetUrl } from "@/lib/paths";
import { PROVINCES } from "@/lib/provinces";

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  body_html: string;
  cover_image: string;
  published_at: string;
};

export type BoardMember = {
  id: number;
  name: string;
  title: string;
  org: string;
  photo: string;
  sort_order: number;
};

export type InstagramPost = {
  id: number;
  permalink: string;
  image: string;
  media_type: string;
  caption: string;
};

export type DocumentItem = {
  id: number;
  title: string;
  file: string;
};

export type Coordinator = {
  id: number;
  title: string;
  name: string;
  photo: string;
  certificate: string;
};

export type MemberNode = {
  id: number;
  title: string;
  name: string;
  photo: string;
  certificate: string;
  children: MemberNode[];
};

export type ProvinceData = {
  id: string;
  name: string;
  plate: string;
  region: string;
  hasRepresentative: boolean;
  hierarchy: null | {
    president: { title: string; name: string; photo: string; certificate: string };
    children: MemberNode[];
  };
};

type MemberRow = {
  id: number;
  plate: string;
  parent_id: number | null;
  name: string;
  title: string;
  photo: string;
  certificate: string;
};

export const getSettings = cache(async () => {
  const rows = await sql<{ setting_key: string; setting_value: string | null }[]>`
    SELECT setting_key, setting_value FROM site_settings
  `;
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.setting_key] = row.setting_value ?? "";
  return settings;
});

export async function getNews(search = "") {
  const term = search.trim();
  if (!term) {
    return sql<NewsItem[]>`
      SELECT id, slug, title, body_html, cover_image, published_at::text
      FROM news
      ORDER BY published_at DESC, id DESC
    `;
  }
  const like = `%${term}%`;
  return sql<NewsItem[]>`
    SELECT id, slug, title, body_html, cover_image, published_at::text
    FROM news
    WHERE title ILIKE ${like} OR body_html ILIKE ${like}
    ORDER BY published_at DESC, id DESC
  `;
}

export async function getNewsBySlug(slug: string) {
  const rows = await sql<NewsItem[]>`
    SELECT id, slug, title, body_html, cover_image, published_at::text
    FROM news
    WHERE slug = ${slug}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getBoard() {
  return sql<BoardMember[]>`
    SELECT id, name, title, org, photo, sort_order
    FROM board_members
    ORDER BY sort_order, id
  `;
}

export async function getInstagramPosts() {
  return sql<InstagramPost[]>`
    SELECT id, permalink, image, media_type, COALESCE(caption, '') AS caption
    FROM instagram_posts
    ORDER BY sort_order, posted_at DESC NULLS LAST, id DESC
    LIMIT 20
  `;
}

export async function getDocuments() {
  return sql<DocumentItem[]>`
    SELECT id, title, file FROM documents ORDER BY sort_order, id
  `;
}

export async function getCoordinators() {
  return sql<Coordinator[]>`
    SELECT id, title, name, photo, certificate
    FROM region_coordinators
    ORDER BY sort_order, id
  `;
}

function memberTree(rows: MemberRow[], parentId: number | null): MemberNode[] {
  return rows
    .filter((row) => row.parent_id === parentId)
    .map((row) => ({
      id: row.id,
      title: row.title,
      name: row.name,
      photo: assetUrl(row.photo),
      certificate: assetUrl(row.certificate),
      children: memberTree(rows, row.id),
    }));
}

export async function getProvinceMap() {
  const reps = await sql<
    { plate: string; name: string; title: string; photo: string; certificate: string }[]
  >`SELECT plate, name, title, photo, certificate FROM representatives`;
  const members = await sql<MemberRow[]>`
    SELECT id, plate, parent_id, name, title, photo, certificate
    FROM representative_members
    ORDER BY sort_order, id
  `;
  const byPlate = new Map(reps.map((row) => [row.plate, row]));
  const data: Record<string, ProvinceData> = {};
  for (const [plate, info] of Object.entries(PROVINCES)) {
    const rep = byPlate.get(plate);
    data[plate] = {
      id: info.id,
      name: info.name,
      plate,
      region: info.region,
      hasRepresentative: Boolean(rep),
      hierarchy: rep
        ? {
            president: {
              title: rep.title,
              name: rep.name,
              photo: assetUrl(rep.photo),
              certificate: assetUrl(rep.certificate),
            },
            children: memberTree(
              members.filter((row) => row.plate === plate),
              null,
            ),
          }
        : null,
    };
  }
  return data;
}
