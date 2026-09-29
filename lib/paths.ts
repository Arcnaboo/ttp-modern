export function assetUrl(value: string | null | undefined) {
  const path = (value ?? "").trim().replaceAll("\\", "/");
  if (!path || path.startsWith("//") || path.includes("..")) return "";
  if (/^[a-z][a-z0-9+.\-]*:/i.test(path)) return "";
  return `/${path.replace(/^\/+/, "")}`;
}

export function safeUrl(value: string | null | undefined) {
  const url = (value ?? "").trim();
  if (!url) return "";
  if (/^[a-z][a-z0-9+.\-]*:/i.test(url)) {
    return /^(https?|mailto|tel):/i.test(url) ? url : "";
  }
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return url;
  return `https://${url}`;
}

export function slugify(value: string) {
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    I: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  const folded = value.replace(/[çÇğĞıIİöÖşŞüÜ]/g, (char) => map[char] ?? char);
  return folded
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function digits(value: string) {
  return value.replace(/\D/g, "");
}
