import { timingSafeEqual } from "crypto";
import { hash } from "bcryptjs";
import { sql } from "@/lib/db";

export function adminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  return {
    username,
    password,
    configured: Boolean(username && password),
  };
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function credentialsMatch(username: string, password: string) {
  const expected = adminCredentials();
  if (!expected.configured) return false;
  return safeEqual(username, expected.username) && safeEqual(password, expected.password);
}

/** Ensures a DB row exists for the env admin so sessions can store a user id. */
export async function ensureEnvAdminUser() {
  const { username, password, configured } = adminCredentials();
  if (!configured) {
    throw new Error("ADMIN_USERNAME ve ADMIN_PASSWORD ortam değişkenlerinde tanımlı olmalıdır.");
  }
  const passwordHash = await hash(password, 10);
  const rows = await sql<{ id: number }[]>`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash
    RETURNING id
  `;
  const id = rows[0]?.id;
  if (id == null) throw new Error("Yönetici hesabı oluşturulamadı.");
  return { id, username };
}
