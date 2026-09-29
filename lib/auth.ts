import { compare, hash } from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import {
  fingerprint,
  openSession,
  sealSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  touchSession,
  type AdminSession,
} from "@/lib/session";

const LOCK_SECONDS = 900;
const MAX_ATTEMPTS = 5;
const DUMMY_HASH = "$2a$10$usesomesillystringforsalt0000000000000000000000000000000000";

export async function clientIp() {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim().slice(0, 45);
  return (headerStore.get("x-real-ip") ?? "0.0.0.0").slice(0, 45);
}

async function userAgent() {
  const headerStore = await headers();
  return headerStore.get("user-agent") ?? "";
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function readSession() {
  const jar = await cookies();
  return openSession(jar.get(SESSION_COOKIE)?.value, await userAgent());
}

export async function requireAdmin() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function writeSession(session: AdminSession) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await sealSession(session), cookieOptions());
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete({ name: SESSION_COOKIE, path: "/admin" });
}

export async function lockSecondsLeft(ip: string) {
  const rows = await sql<{ count: number; age: number | null }[]>`
    SELECT COUNT(*)::int AS count,
           EXTRACT(EPOCH FROM (NOW() - MAX(attempted_at)))::int AS age
    FROM login_attempts
    WHERE ip = ${ip}
      AND attempted_at > NOW() - (${LOCK_SECONDS} * INTERVAL '1 second')
  `;
  const row = rows[0];
  if (!row || row.count < MAX_ATTEMPTS || row.age == null) return 0;
  return Math.max(0, LOCK_SECONDS - row.age);
}

async function recordFailure(ip: string, username: string) {
  await sql`
    INSERT INTO login_attempts (ip, username, attempted_at)
    VALUES (${ip}, ${username.slice(0, 100)}, NOW())
  `;
  await sql`DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'`;
}

export async function attemptLogin(username: string, password: string) {
  const ip = await clientIp();
  const locked = await lockSecondsLeft(ip);
  if (locked > 0) return { ok: false as const, locked };

  const users = await sql<{ id: number; password_hash: string }[]>`
    SELECT id, password_hash FROM admin_users WHERE username = ${username} LIMIT 1
  `;
  const user = users[0];
  const stored = (user?.password_hash ?? DUMMY_HASH).replace(/^\$2y\$/, "$2a$");
  let matches = false;
  try {
    matches = await compare(password, stored);
  } catch {
    matches = false;
  }
  if (!user || !matches) {
    await recordFailure(ip, username);
    return { ok: false as const, locked: 0 };
  }

  await sql`DELETE FROM login_attempts WHERE ip = ${ip}`;
  const now = Math.floor(Date.now() / 1000);
  await writeSession({
    id: user.id,
    username,
    loginTime: now,
    lastActivity: now,
    fingerprint: await fingerprint(await userAgent()),
  });
  return { ok: true as const };
}

export async function refreshSession(session: AdminSession) {
  const now = Math.floor(Date.now() / 1000);
  if (now - session.lastActivity < 60) return;
  await writeSession(touchSession(session));
}

export async function changePassword(userId: number, current: string, next: string) {
  const users = await sql<{ password_hash: string }[]>`
    SELECT password_hash FROM admin_users WHERE id = ${userId} LIMIT 1
  `;
  const stored = (users[0]?.password_hash ?? "").replace(/^\$2y\$/, "$2a$");
  if (!stored || !(await compare(current, stored))) return false;
  const nextHash = await hash(next, 10);
  await sql`UPDATE admin_users SET password_hash = ${nextHash} WHERE id = ${userId}`;
  return true;
}
