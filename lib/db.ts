import postgres from "postgres";

function databaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL tanımlı değil.");
  }
  const url = new URL(raw);
  url.searchParams.delete("channel_binding");
  return url.toString();
}

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export const sql =
  globalForDb.sql ??
  postgres(databaseUrl(), {
    ssl: "require",
    max: 5,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}
