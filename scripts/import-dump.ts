import { readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "../lib/db";
import { repairMojibake } from "../lib/repair";

type Row = Array<string | number | null>;

function parseTuples(input: string, start: number): { rows: Row[]; index: number } {
  const rows: Row[] = [];
  let i = start;

  const skip = () => {
    while (i < input.length && /\s/.test(input[i])) i += 1;
  };

  while (i < input.length) {
    skip();
    if (input[i] === ",") {
      i += 1;
      continue;
    }
    if (input[i] !== "(") break;
    i += 1;
    const row: Row = [];
    while (i < input.length) {
      skip();
      if (input[i] === ")") {
        i += 1;
        break;
      }
      if (input[i] === ",") {
        i += 1;
        continue;
      }
      if (input.startsWith("NULL", i) && !/[A-Za-z0-9_]/.test(input[i + 4] ?? "")) {
        row.push(null);
        i += 4;
        continue;
      }
      if (input[i] === "'") {
        i += 1;
        let value = "";
        while (i < input.length) {
          if (input[i] === "\\") {
            const next = input[i + 1] ?? "";
            const map: Record<string, string> = {
              n: "\n",
              r: "\r",
              t: "\t",
              "0": "\0",
              Z: "\u001a",
              "'": "'",
              '"': '"',
              "\\": "\\",
            };
            value += map[next] ?? next;
            i += 2;
            continue;
          }
          if (input[i] === "'") {
            if (input[i + 1] === "'") {
              value += "'";
              i += 2;
              continue;
            }
            i += 1;
            break;
          }
          value += input[i];
          i += 1;
        }
        row.push(repairMojibake(value));
        continue;
      }
      let j = i;
      while (j < input.length && input[j] !== "," && input[j] !== ")") j += 1;
      const raw = input.slice(i, j).trim();
      row.push(/^-?\d+$/.test(raw) ? Number(raw) : raw);
      i = j;
    }
    rows.push(row);
  }

  return { rows, index: i };
}

function parseInserts(dump: string) {
  const tables = new Map<string, Row[]>();
  let i = 0;
  const marker = "INSERT INTO `";
  while (i < dump.length) {
    const start = dump.indexOf(marker, i);
    if (start < 0) break;
    const nameStart = start + marker.length;
    const nameEnd = dump.indexOf("`", nameStart);
    const table = dump.slice(nameStart, nameEnd);
    const valuesAt = dump.indexOf("VALUES", nameEnd);
    const parsed = parseTuples(dump, valuesAt + "VALUES".length);
    const existing = tables.get(table) ?? [];
    existing.push(...parsed.rows);
    tables.set(table, existing);
    i = parsed.index;
  }
  return tables;
}

function text(value: string | number | null) {
  return value == null ? "" : String(value);
}

function nullableText(value: string | number | null) {
  return value == null || value === "" ? null : String(value);
}

function num(value: string | number | null) {
  return value == null || value === "" ? null : Number(value);
}

async function resetSequence(table: string, sequence: string) {
  await sql.unsafe(
    `SELECT setval('${sequence}', COALESCE((SELECT MAX(id) FROM ${table}), 1), (SELECT MAX(id) IS NOT NULL FROM ${table}))`,
  );
}

async function main() {
  const schema = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const statements = schema
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  const dump = await readFile(
    path.join(process.cwd(), "Terorsuz_Turkiye_Platformu", "veritabani.sql"),
    "utf8",
  );
  const tables = parseInserts(dump);

  await sql.begin(async (tx) => {
    await tx.unsafe(
      `TRUNCATE TABLE
        representative_members,
        representatives,
        board_members,
        region_coordinators,
        news,
        documents,
        instagram_posts,
        site_settings,
        login_attempts,
        admin_users
      RESTART IDENTITY CASCADE`,
    );

    const admins = tables.get("admin_users") ?? [];
    if (admins.length) {
      await tx`INSERT INTO admin_users ${tx(
        admins.map((row) => ({
          id: num(row[0]),
          username: text(row[1]),
          password_hash: text(row[2]),
          created_at: text(row[3]),
        })),
      )}`;
    }

    const board = tables.get("board_members") ?? [];
    if (board.length) {
      await tx`INSERT INTO board_members ${tx(
        board.map((row) => ({
          id: num(row[0]),
          name: text(row[1]),
          title: text(row[2]),
          org: text(row[3]),
          photo: text(row[4]),
          sort_order: num(row[5]) ?? 0,
        })),
      )}`;
    }

    const documents = tables.get("documents") ?? [];
    if (documents.length) {
      await tx`INSERT INTO documents ${tx(
        documents.map((row) => ({
          id: num(row[0]),
          title: text(row[1]),
          file: text(row[2]),
          sort_order: num(row[3]) ?? 0,
        })),
      )}`;
    }

    const posts = tables.get("instagram_posts") ?? [];
    if (posts.length) {
      await tx`INSERT INTO instagram_posts ${tx(
        posts.map((row) => ({
          id: num(row[0]),
          ig_id: nullableText(row[1]),
          permalink: text(row[2]),
          image: text(row[3]),
          caption: text(row[4]),
          media_type: text(row[5]) || "image",
          posted_at: nullableText(row[6]),
          sort_order: num(row[7]) ?? 0,
        })),
      )}`;
    }

    const attempts = tables.get("login_attempts") ?? [];
    if (attempts.length) {
      await tx`INSERT INTO login_attempts ${tx(
        attempts.map((row) => ({
          id: num(row[0]),
          ip: text(row[1]),
          username: text(row[2]),
          attempted_at: text(row[3]),
        })),
      )}`;
    }

    const news = tables.get("news") ?? [];
    if (news.length) {
      await tx`INSERT INTO news ${tx(
        news.map((row) => ({
          id: num(row[0]),
          slug: text(row[1]),
          title: text(row[2]),
          body_html: text(row[3]),
          cover_image: text(row[4]),
          published_at: text(row[5]),
        })),
      )}`;
    }

    const coords = tables.get("region_coordinators") ?? [];
    if (coords.length) {
      await tx`INSERT INTO region_coordinators ${tx(
        coords.map((row) => ({
          id: num(row[0]),
          title: text(row[1]),
          name: text(row[2]),
          photo: text(row[3]),
          certificate: text(row[4]),
          sort_order: num(row[5]) ?? 0,
        })),
      )}`;
    }

    const reps = tables.get("representatives") ?? [];
    if (reps.length) {
      await tx`INSERT INTO representatives ${tx(
        reps.map((row) => ({
          plate: text(row[0]).padStart(2, "0"),
          name: text(row[1]),
          title: text(row[2]),
          photo: text(row[3]),
          certificate: text(row[4]),
          sort_order: num(row[5]) ?? 0,
        })),
      )}`;
    }

    const members = tables.get("representative_members") ?? [];
    if (members.length) {
      await tx`INSERT INTO representative_members ${tx(
        members.map((row) => ({
          id: num(row[0]),
          plate: text(row[1]).padStart(2, "0"),
          parent_id: num(row[2]),
          name: text(row[3]),
          title: text(row[4]),
          photo: text(row[5]),
          certificate: text(row[6]),
          sort_order: num(row[7]) ?? 0,
        })),
      )}`;
    }

    const settings = tables.get("site_settings") ?? [];
    if (settings.length) {
      await tx`INSERT INTO site_settings ${tx(
        settings.map((row) => ({
          setting_key: text(row[0]),
          setting_value: text(row[1]),
        })),
      )}`;
    }

    const mission = await tx<{ setting_value: string }[]>`
      SELECT setting_value FROM site_settings WHERE setting_key = 'misyon'
    `;
    const chair = await tx<{ title: string; name: string }[]>`
      SELECT title, name FROM board_members WHERE id = 1
    `;
    const missionText = mission[0]?.setting_value ?? "";
    const chairTitle = chair[0]?.title ?? "";
    if (!missionText.includes("Terörsüz") || !chairTitle.includes("Başkan") || chair[0]?.name !== "Turgut LENK") {
      throw new Error(
        `Karakter onarımı doğrulanamadı. Misyon: ${missionText.slice(0, 80)} | Unvan: ${chairTitle}`,
      );
    }
  });

  for (const [table, sequence] of [
    ["admin_users", "admin_users_id_seq"],
    ["board_members", "board_members_id_seq"],
    ["documents", "documents_id_seq"],
    ["instagram_posts", "instagram_posts_id_seq"],
    ["login_attempts", "login_attempts_id_seq"],
    ["news", "news_id_seq"],
    ["region_coordinators", "region_coordinators_id_seq"],
    ["representative_members", "representative_members_id_seq"],
  ] as const) {
    await resetSequence(table, sequence);
  }

  const counts = await sql<{ table_name: string; n: number }[]>`
    SELECT 'news' AS table_name, COUNT(*)::int AS n FROM news
    UNION ALL SELECT 'representatives', COUNT(*)::int FROM representatives
    UNION ALL SELECT 'instagram_posts', COUNT(*)::int FROM instagram_posts
    UNION ALL SELECT 'site_settings', COUNT(*)::int FROM site_settings
  `;
  console.log(counts);
  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 });
  process.exit(1);
});
