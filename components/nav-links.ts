export type NavChild = { href: string; label: string };
export type NavItem =
  | { href: string; label: string; children?: undefined }
  | { label: string; href?: undefined; children: NavChild[] };

export const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Anasayfa" },
  {
    label: "Kurumsal",
    children: [
      { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
      { href: "/#misyon-vizyon-section", label: "Vizyonumuz" },
      { href: "/#misyon-vizyon-section", label: "Misyonumuz" },
      { href: "/kurumsal/tuzuk", label: "Tüzüğümüz" },
      { href: "/kurumsal/belgeler", label: "Belgeler" },
    ],
  },
  { href: "/#yonetim-kurulu-section", label: "Yönetim Kurulu" },
  {
    label: "Temsilcilikler",
    children: [
      { href: "/il-ve-ilce-baskanliklari", label: "İl ve İlçe Başkanlıkları" },
      { href: "/ulke-temsilcilikleri", label: "Ülke Temsilcilikleri" },
    ],
  },
  { href: "/projeler", label: "Projeler" },
  { href: "/haberler", label: "Haberler" },
  { href: "/iletisim", label: "İletişim" },
];

export const LOGO_SRC = "/wp-content/uploads/2026/03/Terorsuz-Turkiye-2-copy.png";
