import Link from "next/link";
import { getSettings } from "@/lib/content";
import { digits, safeUrl } from "@/lib/paths";

export async function SiteFooter() {
  const settings = await getSettings();
  const whatsapp = digits(settings.contact_whatsapp || "90212695163");
  const email = settings.contact_email || "info@terorsuzturkiyeplatformu.org";
  const instagram = safeUrl(settings.social_instagram) || "https://instagram.com/tcterorsuzturkiyeplatformu";
  const facebook = safeUrl(settings.social_facebook) || "https://facebook.com";
  const twitter = safeUrl(settings.social_twitter) || "https://twitter.com";

  return (
    <footer id="colophon" className="ttp-site-footer">
      <div className="ttp-footer-container">
        <div className="ttp-footer-main">
          <div className="ttp-footer-brand">
            <Link href="/" className="ttp-footer-logo-link">
              <img className="ttp-footer-logo" src="/wp-content/uploads/2026/03/Terorsuz-Turkiye-2-copy-300x300.png" alt="Terörsüz Türkiye Platformu Logosu" width={50} height={50} />
              <div className="ttp-footer-brand-title">
                <span className="ttp-footer-title">TERÖRSÜZ TÜRKİYE</span>
                <span className="ttp-footer-subtitle">PLATFORMU</span>
              </div>
            </Link>
            <p className="ttp-footer-tagline">Milli birlik, kardeşlik ve dayanışma iradesiyle terörsüz bir gelecek için 81 ilde el ele.</p>
          </div>
          <div className="ttp-footer-nav-wrap">
            <h4 className="ttp-footer-heading">Hızlı Bağlantılar</h4>
            <div className="ttp-footer-nav-columns">
              <div className="ttp-footer-nav-col">
                <Link href="/" className="ttp-footer-nav-main-link">Anasayfa</Link>
                <div className="ttp-footer-nav-group">
                  <span className="ttp-footer-nav-title">Kurumsal</span>
                  <ul className="ttp-footer-nav-sublist">
                    <li><Link href="/kurumsal/hakkimizda">Hakkımızda</Link></li>
                    <li><Link href="/#misyon-vizyon-section">Vizyonumuz</Link></li>
                    <li><Link href="/#misyon-vizyon-section">Misyonumuz</Link></li>
                    <li><Link href="/kurumsal/tuzuk">Tüzüğümüz</Link></li>
                    <li><Link href="/kurumsal/belgeler">Belgeler</Link></li>
                  </ul>
                </div>
                <Link href="/#yonetim-kurulu-section" className="ttp-footer-nav-main-link">Yönetim Kurulu</Link>
              </div>
              <div className="ttp-footer-nav-col">
                <div className="ttp-footer-nav-group">
                  <span className="ttp-footer-nav-title">Temsilcilikler</span>
                  <ul className="ttp-footer-nav-sublist">
                    <li><Link href="/il-ve-ilce-baskanliklari">İl ve İlçe Başkanlıkları</Link></li>
                    <li><Link href="/ulke-temsilcilikleri">Ülke Temsilcilikleri</Link></li>
                  </ul>
                </div>
                <Link href="/projeler" className="ttp-footer-nav-main-link">Projeler</Link>
                <Link href="/haberler" className="ttp-footer-nav-main-link">Haberler</Link>
                <Link href="/iletisim" className="ttp-footer-nav-main-link">İletişim</Link>
              </div>
            </div>
          </div>
          <div className="ttp-footer-contact">
            <h4 className="ttp-footer-heading">İletişim</h4>
            <a className="ttp-footer-contact-item" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp İletişim Hattı</a>
            <a className="ttp-footer-contact-item" href={`mailto:${email}`}>{email}</a>
            <div className="ttp-footer-social-row">
              <a className="ttp-footer-soc" href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
              <a className="ttp-footer-soc" href={twitter} target="_blank" rel="noopener noreferrer" aria-label="X">X</a>
              <a className="ttp-footer-soc" href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YouTube</a>
              <a className="ttp-footer-soc" href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
