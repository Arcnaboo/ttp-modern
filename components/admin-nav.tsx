"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";

const groups: Array<{ label: string; links: Array<[string, string]> }> = [
  { label: "", links: [["/admin", "Panel"]] },
  {
    label: "Teşkilat",
    links: [
      ["/admin/board", "Yönetim Kurulu"],
      ["/admin/representatives", "İl Başkanlıkları"],
      ["/admin/region-coordinators", "Bölge Sorumluları"],
    ],
  },
  {
    label: "İçerik",
    links: [
      ["/admin/news", "Haberler"],
      ["/admin/site-settings", "Sayfa Metinleri & Kapak"],
      ["/admin/instagram", "Instagram Akışı"],
    ],
  },
  {
    label: "Ayarlar",
    links: [
      ["/admin/contact", "İletişim Bilgileri"],
      ["/admin/social", "Sosyal Medya"],
      ["/admin/password", "Şifre Değiştir"],
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="ttpa-sidebar">
      <h1>TTP Admin</h1>
      {groups.map((group) => (
        <div key={group.label || "home"}>
          {group.label ? <div className="ttpa-navgroup">{group.label}</div> : null}
          {group.links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "active" : ""}>
              {label}
            </Link>
          ))}
        </div>
      ))}
      <form action={logoutAction}>
        <button type="submit">Çıkış Yap</button>
      </form>
    </nav>
  );
}
