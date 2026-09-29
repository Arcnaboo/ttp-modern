import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.php/:path*", destination: "/", permanent: true },
      { source: "/etkinlikler.php", destination: "/etkinlikler", permanent: true },
      { source: "/projeler.php", destination: "/projeler", permanent: true },
      { source: "/iletisim.php", destination: "/iletisim", permanent: true },
      { source: "/ulke-temsilcilikleri.php", destination: "/ulke-temsilcilikleri", permanent: true },
      { source: "/kurumsal/hakkimizda.php", destination: "/kurumsal/hakkimizda", permanent: true },
      { source: "/kurumsal/tuzuk.php", destination: "/kurumsal/tuzuk", permanent: true },
      { source: "/kurumsal/belgeler.php", destination: "/kurumsal/belgeler", permanent: true },
      { source: "/il-ve-ilce-baskanliklari.php", destination: "/il-ve-ilce-baskanliklari", permanent: true },
      { source: "/haberler/index.php", destination: "/haberler", permanent: true },
      {
        source: "/index.php/2026/03/28/ankarada-terorsuz-turkiyeye-evet",
        destination: "/haberler/ankarada-terorsuz-turkiyeye-evet",
        permanent: true,
      },
      {
        source:
          "/index.php/2026/03/28/terorsuz-turkiye-platformu-genel-baskani-turgut-lenkten-81-ilde-birlik-ve-dayanisma-hamlesi",
        destination:
          "/haberler/terorsuz-turkiye-platformu-genel-baskani-turgut-lenkten-81-ilde-birlik-ve-dayanisma-hamlesi",
        permanent: true,
      },
      { source: "/admin/login.php", destination: "/admin/login", permanent: true },
      { source: "/admin/index.php", destination: "/admin", permanent: true },
      { source: "/admin/board.php", destination: "/admin/board", permanent: true },
      { source: "/admin/representatives.php", destination: "/admin/representatives", permanent: true },
      { source: "/admin/region-coordinators.php", destination: "/admin/region-coordinators", permanent: true },
      { source: "/admin/news.php", destination: "/admin/news", permanent: true },
      { source: "/admin/site-settings.php", destination: "/admin/site-settings", permanent: true },
      { source: "/admin/instagram.php", destination: "/admin/instagram", permanent: true },
      { source: "/admin/contact.php", destination: "/admin/contact", permanent: true },
      { source: "/admin/social.php", destination: "/admin/social", permanent: true },
      { source: "/admin/password.php", destination: "/admin/password", permanent: true },
      { source: "/admin/logout.php", destination: "/admin/logout", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=(), payment=(), usb=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
