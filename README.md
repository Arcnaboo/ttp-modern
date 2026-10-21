# Terörsüz Türkiye Platformu

PHP sitesinin Next.js 16 karşılığı. Herkese açık sayfalar ve `/admin` paneli aynı içeriği gösterir. Veriler Neon PostgreSQL’de durur. Eski PHP klasörü `Terorsuz_Turkiye_Platformu` yalnızca kaynak referansıdır ve depoya girmez.

## Kurallar

- Kod değişince bu dosya ve `AGENTS.md` aynı işte güncellenir. Rota, ortam değişkeni veya şema değiştiyse doküman da değişir.
- Veritabanı, dosya ve ağ çağrıları async çalışır.

## Ortam

`.env.local` (depoya girmez):

- `DATABASE_URL` — Neon bağlantı dizesi. `sslmode=require` kalır. Node sürücüsü `channel_binding` parametresini kullanmaz; uygulama bu parametreyi bağlantıdan çıkarır.
- `SESSION_SECRET` — admin oturum çerezini imzalar.
- `ADMIN_USERNAME` — yönetim paneli kullanıcı adı.
- `ADMIN_PASSWORD` — yönetim paneli şifresi.

Örnek adlar `.env.example` içindedir. Gerçek parola yazılmaz.

## Çalıştırma

```bash
npm install
npm run db:import
npm run dev
```

`db:import`, `Terorsuz_Turkiye_Platformu/veritabani.sql` dosyasını okur, bozuk Türkçe karakterleri onarır ve `db/schema.sql` tablolarına yazar. Aynı komut veriyi baştan yükler.

Üretim:

```bash
npm run build
npm start
```

## Sayfalar

- `/` anasayfa
- `/kurumsal/hakkimizda`, `/kurumsal/tuzuk`, `/kurumsal/belgeler`
- `/il-ve-ilce-baskanliklari`
- `/ulke-temsilcilikleri`, `/projeler`, `/etkinlikler`
- `/haberler`, `/haberler/[slug]` (`?s=` ile arama)
- `/iletisim`
- `/admin/login` ve panel: kurul, il başkanlıkları, bölge sorumluları, haberler, sayfa metinleri, Instagram, iletişim, sosyal medya, şifre

## Görünüm

Herkese açık sayfalar editorial bir tasarım sistemi kullanır: mürekkep lacivert (`#0B1120`), kâğıt (`#F7F4EF`), bayrak kırmızısı (`#E30A17`) ve aksiyon kırmızısı (`#9B1C24`). Tipografi `next/font` ile Newsreader (başlık) ve Source Sans 3 (gövde) olarak yüklenir. Ortak kabuk `app/(site)/layout.tsx` içindedir. Stiller `app/globals.css` ve `app/styles/site.css` dosyalarındadır; eski Elementor/WordPress stil dosyaları yüklenmez. Rotalar, CMS metinleri ve admin iş akışları aynıdır.

Eski `.php` adresleri kalıcı olarak bu yollara yönlenir. Görseller `public/wp-content/uploads` ve `public/assets` altındadır; veritabanındaki yollar aynı kalır. Yeni yüklemeler `public/wp-content/uploads/admin` altına yazılır. Sekme ikonu `public/logo.png` dosyasıdır.

Admin oturumu httpOnly çerezdir. Giriş `ADMIN_USERNAME` ve `ADMIN_PASSWORD` ile yapılır; başarılı girişte `admin_users` satırı ortam değerleriyle senkronize edilir. `db:import` aynı senkronu çalıştırır. Şifre panelden değil, `.env.local` üzerinden değiştirilir (sunucuyu yeniden başlatın). Beş hatalı giriş aynı IP’yi 15 dakika kilitler. Boşta 2 saat, en fazla 12 saat geçerlidir.
