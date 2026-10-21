import { access, mkdir, open, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const MAX_BYTES = 5 * 1024 * 1024;

export const ADMIN_UPLOAD_URL_PREFIX = "wp-content/uploads/admin";

/** Durable upload root (outside `public/` so Next can serve via Route Handler). */
export function adminUploadDir() {
  return path.resolve(process.cwd(), "data", "uploads", "admin");
}

export function adminUploadAbsolute(filename: string) {
  return path.resolve(adminUploadDir(), filename);
}

function kindOf(buffer: Buffer) {
  if (buffer.subarray(0, 5).toString("utf8") === "%PDF-") return "pdf";
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "png";
  if (buffer.subarray(0, 4).toString("utf8") === "RIFF" && buffer.subarray(8, 12).toString("utf8") === "WEBP") {
    return "webp";
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return "gif";
  return null;
}

type UploadBlob = {
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

function asUploadBlob(value: FormDataEntryValue | null): UploadBlob | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<UploadBlob>;
  if (typeof candidate.size !== "number" || typeof candidate.arrayBuffer !== "function") return null;
  return candidate as UploadBlob;
}

const ADMIN_PATH = /^wp-content\/uploads\/admin\/([a-f0-9]{8,}\.(jpg|png|webp|gif|pdf))$/i;

export function parseAdminUploadPath(relative: string) {
  const match = relative.trim().replaceAll("\\", "/").match(ADMIN_PATH);
  return match?.[1] ?? null;
}

/** Resolve on-disk file for an admin upload path (data/ first, then legacy public/). */
export async function resolveAdminUploadFile(relative: string) {
  const filename = parseAdminUploadPath(relative);
  if (!filename) return null;
  const candidates = [
    adminUploadAbsolute(filename),
    path.resolve(process.cwd(), "public", ADMIN_UPLOAD_URL_PREFIX, filename),
  ];
  for (const absolute of candidates) {
    try {
      await access(absolute);
      return absolute;
    } catch {
      /* try next */
    }
  }
  return null;
}

/** Accept a path produced by /admin/upload, or a multipart file field. */
export async function resolveUpload(
  formData: FormData,
  field: string,
  allowed: string[],
): Promise<{ path: string | null; error?: string }> {
  const preset = String(formData.get(`${field}_path`) ?? "")
    .trim()
    .replaceAll("\\", "/");
  if (preset) {
    const filename = parseAdminUploadPath(preset);
    if (!filename) return { path: null, error: "Geçersiz dosya yolu." };
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    if (!allowed.includes(ext)) return { path: null, error: "Desteklenmeyen dosya türü." };
    if (!(await resolveAdminUploadFile(preset))) {
      return { path: null, error: "Yüklenen dosya bulunamadı. Fotoğrafı yeniden seçin." };
    }
    return { path: `${ADMIN_UPLOAD_URL_PREFIX}/${filename}` };
  }
  return saveUpload(formData.get(field), allowed);
}

export async function saveUpload(
  file: FormDataEntryValue | null,
  allowed: string[],
): Promise<{ path: string | null; error?: string }> {
  const blob = asUploadBlob(file);
  if (!blob || blob.size === 0) return { path: null };
  if (blob.size > MAX_BYTES) return { path: null, error: "Dosya 5MB'dan büyük olamaz." };
  const buffer = Buffer.from(await blob.arrayBuffer());
  if (buffer.length === 0) return { path: null, error: "Dosya boş." };
  const kind = kindOf(buffer);
  if (!kind || !allowed.includes(kind)) {
    return { path: null, error: "Desteklenmeyen dosya türü. JPG, PNG, WEBP, GIF veya PDF yükleyin." };
  }
  const filename = `${randomBytes(8).toString("hex")}.${kind}`;
  const relative = `${ADMIN_UPLOAD_URL_PREFIX}/${filename}`;
  const directory = adminUploadDir();
  const absolute = adminUploadAbsolute(filename);
  await mkdir(directory, { recursive: true });
  const handle = await open(absolute, "w");
  try {
    await handle.writeFile(buffer);
    await handle.sync();
  } finally {
    await handle.close();
  }
  const written = await readFile(absolute);
  if (written.length !== buffer.length) {
    return { path: null, error: "Dosya diske yazılamadı. Tekrar deneyin." };
  }
  return { path: relative };
}
