import Link from "next/link";
import { SearchDialog } from "@/components/search-dialog";
import { SiteNav } from "@/components/site-nav";
import { LOGO_SRC } from "@/components/nav-links";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          <img className="site-logo-mark" src={LOGO_SRC} alt="Terörsüz Türkiye Platformu" width={44} height={44} />
          <span className="site-logo-text">
            <span className="site-logo-title">Terörsüz Türkiye</span>
            <span className="site-logo-sub">Platformu</span>
          </span>
        </Link>
        <SiteNav />
        <div className="site-header-actions">
          <SearchDialog />
          <Link href="/il-ve-ilce-baskanliklari" className="site-btn site-btn-primary site-header-cta">
            Temsilcilikler
          </Link>
        </div>
      </div>
    </header>
  );
}
