import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { resolveAdminUploadFile } from "@/lib/upload";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
};

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const relative = `wp-content/uploads/admin/${file}`;
  const absolute = await resolveAdminUploadFile(relative);
  if (!absolute) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const body = await readFile(absolute);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
