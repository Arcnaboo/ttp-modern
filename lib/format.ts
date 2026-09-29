const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export function formatTrDate(value: string | Date) {
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) {
      const day = Number(match[3]);
      const month = MONTHS[Number(match[2]) - 1] ?? "";
      return `${day} ${month} ${match[1]}`;
    }
  }
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function excerpt(html: string, limit = 220) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

export function dateInputValue(value: string | Date) {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}
