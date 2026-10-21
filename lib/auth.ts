import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminCredentials, credentialsMatch, ensureEnvAdminUser } from "@/lib/admin-credentials";
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

  if (!adminCredentials().configured || !credentialsMatch(username, password)) {
    await recordFailure(ip, username);
    return { ok: false as const, locked: 0 };
  }

  const user = await ensureEnvAdminUser();
  await sql`DELETE FROM login_attempts WHERE ip = ${ip}`;
  const now = Math.floor(Date.now() / 1000);
  await writeSession({
    id: user.id,
    username: user.username,
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
