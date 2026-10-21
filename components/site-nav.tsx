"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { IconChevronDown, IconClose, IconMenu } from "@/components/icons";
import { LOGO_SRC, NAV_LINKS } from "@/components/nav-links";

export function SiteNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    setDrawerOpen(false);
    setOpenSection(null);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = drawerRef.current;
    const focusables = root?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusables?.length) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
      previous?.focus?.();
      toggleRef.current?.focus();
    };
  }, [drawerOpen]);

  return (
    <>
      <nav className="site-nav-desktop" aria-label="Ana menü">
        <ul className="site-nav-list">
          {NAV_LINKS.map((item) =>
            item.children ? (
              <li
                key={item.label}
                className={`site-nav-item${desktopOpen === item.label ? " is-open" : ""}`}
                onMouseEnter={() => setDesktopOpen(item.label)}
                onMouseLeave={() => setDesktopOpen(null)}
              >
                <button
                  type="button"
                  className="site-nav-trigger"
                  aria-expanded={desktopOpen === item.label}
                  aria-haspopup="true"
                  onClick={() => setDesktopOpen((current) => (current === item.label ? null : item.label))}
                >
                  {item.label}
                  <IconChevronDown />
                </button>
                <ul className="site-nav-drop">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link href={child.href}>{child.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="site-nav-link"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className="site-icon-btn site-menu-toggle"
        aria-label="Menüyü aç"
        aria-expanded={drawerOpen}
        aria-controls="site-mobile-drawer"
        onClick={() => setDrawerOpen(true)}
      >
        <IconMenu />
      </button>

      {drawerOpen ? (
        <>
          <button type="button" className="site-drawer-backdrop" aria-label="Menüyü kapat" onClick={() => setDrawerOpen(false)} />
          <div
            ref={drawerRef}
            id="site-mobile-drawer"
            className="site-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="site-drawer-head">
              <Link href="/" onClick={() => setDrawerOpen(false)} className="site-logo">
                <img className="site-logo-mark" src={LOGO_SRC} alt="" width={44} height={44} />
                <span id={titleId} className="site-logo-text">
                  <span className="site-logo-title">Terörsüz Türkiye</span>
                  <span className="site-logo-sub">Platformu</span>
                </span>
              </Link>
              <button type="button" className="site-icon-btn" aria-label="Menüyü kapat" onClick={() => setDrawerOpen(false)}>
                <IconClose />
              </button>
            </div>
            <ul className="site-drawer-list">
              {NAV_LINKS.map((item) =>
                item.children ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={openSection === item.label}
                      onClick={() => setOpenSection((current) => (current === item.label ? null : item.label))}
                    >
                      {item.label}
                      <IconChevronDown />
                    </button>
                    {openSection === item.label ? (
                      <ul className="site-drawer-sub">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link href={child.href} onClick={() => setDrawerOpen(false)}>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} onClick={() => setDrawerOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </>
      ) : null}
    </>
  );
}
