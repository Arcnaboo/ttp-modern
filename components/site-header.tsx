import Link from "next/link";
import { SearchDialog } from "@/components/search-dialog";
import { SiteNav } from "@/components/site-nav";
import { getSettings } from "@/lib/content";
import { assetUrl, digits, safeUrl } from "@/lib/paths";

export async function SiteHeader({
  variant = "solid",
  pageTitle,
}: {
  variant?: "hero" | "solid";
  pageTitle?: string;
}) {
  const settings = await getSettings();
  const whatsapp = settings.contact_whatsapp ?? "";
  const email = settings.contact_email ?? "";
  const address = settings.contact_address ?? "";
  const desktop = assetUrl(settings.hero_image_desktop);
  const mobile = assetUrl(settings.hero_image_mobile);
  const wide = desktop || mobile;
  const portrait = mobile || desktop;
  const socials = [
    ["Instagram", settings.social_instagram],
    ["Facebook", settings.social_facebook],
    ["X", settings.social_twitter],
    ["LinkedIn", settings.social_linkedin],
  ].filter((item): item is [string, string] => Boolean(safeUrl(item[1])));

  return (
    <header id="masthead" className={variant === "hero" ? "ttp-header-hero" : "ttp-header-solid"}>
      {variant === "hero" && wide ? (
        <style>{`:root { --ttp-hero-image: url("${wide}"); } @media (orientation: portrait) { :root { --ttp-hero-image: url("${portrait}"); } }`}</style>
      ) : null}
      <div className="ttp-header-unified-wrapper">
        <div className="ttp-header-logo-container">
          <Link href="/" className="ttp-main-logo-link">
            <img className="ttp-main-logo-img" src="/wp-content/uploads/2026/03/Terorsuz-Turkiye-2-copy.png" alt="Terörsüz Türkiye Platformu" />
          </Link>
        </div>
        <div className="ttp-header-nav-column">
          <div className="ttp-top-bar-row">
            <ul className="elementor-icon-list-items">
              <li className="elementor-icon-list-item">
                <a href={whatsapp ? `https://wa.me/${digits(whatsapp)}` : "#"} target="_blank" rel="noopener noreferrer">
                  <span className="elementor-icon-list-text">{whatsapp || "Whatsapp İletişim"}</span>
                </a>
              </li>
              <li className="elementor-icon-list-item">
                <a href={email ? `mailto:${email}` : "#"}>
                  <span className="elementor-icon-list-text">{email || "E-posta"}</span>
                </a>
              </li>
              <li className="elementor-icon-list-item">
                <span className="elementor-icon-list-text">{address || "Adres"}</span>
              </li>
            </ul>
            <div className="ttp-topbar-right-group">
              <ul className="ttp-social-row">
                {socials.map(([label, href]) => (
                  <li key={label}>
                    <a href={safeUrl(href)} target="_blank" rel="noopener noreferrer" aria-label={label}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ttp-bottom-nav-row">
            <SiteNav />
            <div className="ttp-header-actions-group">
              <SearchDialog />
              <Link href="/il-ve-ilce-baskanliklari" className="elementskit-btn">
                Belge Doğrulama
              </Link>
            </div>
          </div>
          {pageTitle ? (
            <div className="ttp-page-header">
              <div className="ttp-page-header-inner">
                <h1 className="ttp-page-title">{pageTitle}</h1>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
