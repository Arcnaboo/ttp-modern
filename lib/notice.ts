import { redirect } from "next/navigation";

export function redirectWithNotice(path: string, type: "ok" | "err", message: string): never {
  const params = new URLSearchParams();
  params.set(type === "ok" ? "ok" : "hata", message);
  redirect(`${path}?${params.toString()}`);
}

export function noticeFrom(search: { ok?: string; hata?: string }) {
  if (search.ok) return { type: "ok" as const, message: search.ok };
  if (search.hata) return { type: "err" as const, message: search.hata };
  return null;
}
