import iconv from "iconv-lite";

const MARKERS = /[├┤┬┴┼─│┌┐└┘═║╔╗╚╝░▒▓ƒ]/;

export function repairMojibake(value: string): string {
  if (!MARKERS.test(value)) return value;
  const bytes = iconv.encode(value, "cp437");
  const decoded = iconv.decode(bytes, "utf8");
  if (decoded.includes("\uFFFD")) return value;
  return decoded;
}
