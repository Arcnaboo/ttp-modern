<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Terörsüz Türkiye Platformu

Bu depo, PHP sitesinin Next.js 16 karşılığıdır. Veri Neon PostgreSQL’dedir. Ayrıntılı çalıştırma adımları kök `README.md` dosyasındadır.

## Kurallar

- Her kod değişikliği aynı işin içinde belgelenir. Davranış, ortam değişkeni, rota veya veritabanı şeması değiştiyse `README.md` ve bu dosyadaki ilgili bölüm aynı değişiklikte güncellenir. Doküman, kodun anlattığı davranışın gerisinde kalmaz.
- Veritabanı, dosya sistemi, ağ çağrıları ve Server Action’lar async çalışır. `readFileSync`, `writeFileSync` ve senkron veritabanı sürücüleri kullanılmaz.
- `DATABASE_URL` ve `SESSION_SECRET` yalnızca ortam değişkenlerindedir. Parola veya bağlantı dizesi depoya yazılmaz.
- Kod yazmadan önce `node_modules/next/dist/docs/` içindeki Next.js 16 rehberi okunur.
