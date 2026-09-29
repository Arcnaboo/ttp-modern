const IDLE_SECONDS = 60 * 60 * 2;
const ABSOLUTE_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

export type AdminSession = {
  id: number;
  username: string;
  loginTime: number;
  lastActivity: number;
  fingerprint: string;
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET tanımlı değil.");
  return value;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function base64UrlToString(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return diff === 0;
}

export async function fingerprint(userAgent: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(userAgent));
  return bytesToBase64Url(new Uint8Array(digest));
}

export async function sealSession(session: AdminSession) {
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(session)));
  return `${payload}.${await sign(payload)}`;
}

export async function openSession(token: string | undefined, userAgent: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, await sign(payload))) return null;
  let session: AdminSession;
  try {
    session = JSON.parse(base64UrlToString(payload)) as AdminSession;
  } catch {
    return null;
  }
  if (!session?.id || !session.username) return null;
  const now = Math.floor(Date.now() / 1000);
  if (now - session.lastActivity > IDLE_SECONDS || now - session.loginTime > ABSOLUTE_SECONDS) return null;
  if (session.fingerprint !== (await fingerprint(userAgent))) return null;
  return session;
}

export function touchSession(session: AdminSession) {
  return { ...session, lastActivity: Math.floor(Date.now() / 1000) };
}

export const SESSION_COOKIE = "TTPADMINSESS";
export const SESSION_MAX_AGE = ABSOLUTE_SECONDS;
