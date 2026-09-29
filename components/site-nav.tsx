"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
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

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  return (
    <div className="elementor-element-1d98a9af">
      <button
        className="elementskit-menu-hamburger elementskit-menu-toggler"
        type="button"
        aria-label="Menüyü aç"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="elementskit-menu-hamburger-icon" />
        <span className="elementskit-menu-hamburger-icon" />
        <span className="elementskit-menu-hamburger-icon" />
      </button>
      <button
        className={`elementskit-menu-overlay${open ? " is-open" : ""}`}
        type="button"
        aria-label="Menüyü kapat"
        onClick={() => setOpen(false)}
      />
      <div id="ekit-megamenu-ana" className={`elementskit-menu-container elementskit-menu-offcanvas-elements${open ? " is-open" : ""}`}>
        <div className="elementskit-nav-identity-panel">
          <Link href="/" onClick={() => setOpen(false)}>
            <img src="/wp-content/uploads/2026/03/Terorsuz-Turkiye-2-copy.png" alt="Terörsüz Türkiye Platformu" width={46} height={46} />
          </Link>
          <button className="elementskit-menu-close" type="button" aria-label="Menüyü kapat" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <ul className="elementskit-navbar-nav">
          {links.map((item) =>
            item.children ? (
              <li key={item.label} className={`ttp-nav-drop${section === item.label ? " is-open" : ""}`}>
                <a
                  className="ekit-menu-nav-link"
                  role="button"
                  href={`#${item.label}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setSection((current) => (current === item.label ? null : item.label));
                  }}
                >
                  {item.label}
                  <span className="elementskit-submenu-indicator">▾</span>
                </a>
                <ul className="elementskit-dropdown elementskit-submenu-panel">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link href={child.href} onClick={() => setOpen(false)}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.href}>
                <Link className="ekit-menu-nav-link" href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
