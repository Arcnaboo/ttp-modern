import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const MAX_BYTES = 5 * 1024 * 1024;

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

export async function saveUpload(file: FormDataEntryValue | null, allowed: string[]): Promise<{ path: string | null; error?: string }> {
  if (!(file instanceof File) || file.size === 0) return { path: null };
  if (file.size > MAX_BYTES) return { path: null, error: "Dosya 5MB'dan büyük olamaz." };
  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = kindOf(buffer);
  if (!kind || !allowed.includes(kind)) return { path: null, error: "Desteklenmeyen dosya türü." };
  const filename = `${randomBytes(8).toString("hex")}.${kind}`;
  const directory = path.join(process.cwd(), "public", "wp-content", "uploads", "admin");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer);
  return { path: `wp-content/uploads/admin/${filename}` };
}
