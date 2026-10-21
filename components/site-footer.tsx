import Link from "next/link";
import { IconFacebook, IconInstagram, IconLinkedIn, IconX } from "@/components/icons";
import { LOGO_SRC } from "@/components/nav-links";
import { getSettings } from "@/lib/content";
import { digits, safeUrl } from "@/lib/paths";

export async function SiteFooter() {
  let settings: Record<string, string> = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }
  const whatsapp = digits(settings.contact_whatsapp || "");
  const email = settings.contact_email || "";
  const socials = [
    { label: "Instagram", href: safeUrl(settings.social_instagram), Icon: IconInstagram },
    { label: "Facebook", href: safeUrl(settings.social_facebook), Icon: IconFacebook },
    { label: "X", href: safeUrl(settings.social_twitter), Icon: IconX },
    { label: "LinkedIn", href: safeUrl(settings.social_linkedin), Icon: IconLinkedIn },
  ].filter((item) => item.href);

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link href="/" className="site-footer-logo">
            <img src={LOGO_SRC} alt="" width={48} height={48} />
            <span className="site-footer-title">
              Terörsüz Türkiye
              <br />
              Platformu
            </span>
          </Link>
          <p className="site-footer-tagline">
            Milli birlik, kardeşlik ve dayanışma iradesiyle terörsüz bir gelecek için 81 ilde el ele.
          </p>
        </div>
        <div>
          <h2 className="site-footer-heading">Hızlı Bağlantılar</h2>
          <div className="site-footer-nav">
            <div>
              <Link href="/">Anasayfa</Link>
              <Link href="/kurumsal/hakkimizda">Hakkımızda</Link>
              <Link href="/kurumsal/tuzuk">Tüzüğümüz</Link>
              <Link href="/kurumsal/belgeler">Belgeler</Link>
              <Link href="/#yonetim-kurulu-section">Yönetim Kurulu</Link>
            </div>
            <div>
              <Link href="/il-ve-ilce-baskanliklari">İl Başkanlıkları</Link>
              <Link href="/ulke-temsilcilikleri">Ülke Temsilcilikleri</Link>
              <Link href="/projeler">Projeler</Link>
              <Link href="/haberler">Haberler</Link>
              <Link href="/iletisim">İletişim</Link>
            </div>
          </div>
        </div>
        <div className="site-footer-contact">
          <h2 className="site-footer-heading">İletişim</h2>
          {whatsapp ? (
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp İletişim Hattı
            </a>
          ) : null}
          {email ? <a href={`mailto:${email}`}>{email}</a> : null}
          {!whatsapp && !email ? <p className="site-footer-tagline">İletişim bilgileri yakında eklenecektir.</p> : null}
          {socials.length ? (
            <div className="site-footer-social">
              {socials.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="site-footer-legal">
        <p>© {new Date().getFullYear()} Terörsüz Türkiye Platformu</p>
      </div>
    </footer>
  );
}
