import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";

export const runtime = "nodejs";

const ALLOWED: Record<string, string[]> = {
  image: ["jpg", "png", "webp", "gif"],
  document: ["pdf", "jpg", "png", "webp"],
};

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "image");
  const allowed = ALLOWED[kind] ?? ALLOWED.image;
  const result = await saveUpload(file, allowed);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  if (!result.path) {
    return NextResponse.json({ error: "Dosya seçilmedi." }, { status: 400 });
  }
  return NextResponse.json({ path: result.path, url: `/${result.path}` });
}
