import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RichHtml } from "@/components/rich-html";
import { TeamScroller } from "@/components/team-scroller";
import { TurkeyMap } from "@/components/turkey-map";
import { getBoard, getCoordinators, getInstagramPosts, getNews, getProvinceMap, getSettings } from "@/lib/content";
import { formatTrDate } from "@/lib/format";
import { assetUrl, safeUrl } from "@/lib/paths";

function Arrow() {
  return (
    <span className="ttp-bento-arrow">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

export default async function HomePage() {
  const [settings, board, posts, news, provinces, coordinators] = await Promise.all([
    getSettings(),
    getBoard(),
    getInstagramPosts(),
    getNews(),
    getProvinceMap(),
    getCoordinators(),
  ]);
  const values = (settings.temel_degerler ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const instagramUrl = safeUrl(settings.social_instagram);

  return (
    <>
      <SiteHeader variant="hero" />
      <main className="elementor elementor-34">
        <section className="elementor-element elementor-element-2bdac4de">
          <div className="elementor-container">
            <div className="elementor-element elementor-element-27fde11e">
            <div className="ekit-heading elementskit-section-title-wraper text_left">
              <h3 className="elementskit-section-subtitle">Ben değil, biz değil, hepimiz Türkiyeyiz, Hepimiz Kardeşiz</h3>
              <h2 className="ekit-heading--title elementskit-section-title">Terörsüz Türkiye Platformu</h2>
              <a href="#baskan-mesaji-section" className="mntn-scroll-cue">
                <span>Aşağı Kaydır</span>
              </a>
            </div>
            </div>
          </div>
        </section>

        <section id="baskan-mesaji-section" className="ttp-baskan-split-section">
          <div className="ttp-baskan-split-container">
            <div className="ttp-baskan-text-col">
              <h2 className="ttp-baskan-title">Kurucu Genel Başkan Mesajı</h2>
              <h4 className="ttp-baskan-lead">Proje Sahibi Kurucu Genel Başkan Turgut Lenk ve yönetimi olarak;</h4>
              <RichHtml className="ttp-baskan-paragraphs" html={settings.founder_message ?? ""} />
            </div>
            <div className="ttp-baskan-media-col">
              <div className="ttp-baskan-logo-wrap">
                <img className="ttp-baskan-logo-img" src="/wp-content/uploads/2026/03/Terorsuz-Turkiye-2-copy.png" alt="Terörsüz Türkiye Platformu" />
              </div>
            </div>
          </div>
        </section>

        <section className="ttp-bento-cards-section">
          <div className="ttp-bento-grid-wrapper">
            {[
              ["large", "/etkinlikler", "Etkinlikler", "Ülkemizin yedi bölgesinde milli birlik, beraberlik ve kardeşlik buluşmaları", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"],
              ["medium", "/projeler", "Projeler", "Geleceğe güvenle bakan güçlü Türkiye için sürdürülebilir toplumsal projeler", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"],
              ["small", "/haberler", "Basında", "Platformumuzun faaliyetleri ve basında yer alan haberler", "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80"],
              ["small", "/#teskilat-haritasi", "Temsilcilikler", "81 il ve yurt dışı temsilcilik ağımızla sahadayız", "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80"],
              ["small", "/iletisim", "Gönüllü Ol", "Huzurlu bir Türkiye için el ele omuz omuza", "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"],
            ].map(([size, href, title, text, image]) => (
              <Link key={title} href={href} className={`ttp-bento-card ttp-bento-card-${size}`}>
                <div className="ttp-bento-card-bg" style={{ backgroundImage: `url('${image}')` }} />
                <div className="ttp-bento-card-overlay" />
                <div className="ttp-bento-card-content">
                  <div className="ttp-bento-card-header"><Arrow /></div>
                  <div className="ttp-bento-card-body">
                    <h3 className="ttp-bento-title">{title}</h3>
                    <p className="ttp-bento-desc">{text}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="misyon-vizyon-section" className="ttp-mv-section">
          <div className="ttp-mv-container">
            <div className="ttp-mv-header"><h2 className="ttp-mv-title">Misyon ve Vizyonumuz</h2></div>
            <div className="ttp-mv-cards-wrap">
              <div className="ttp-mv-card ttp-mv-card-left">
                <div className="ttp-mv-card-header"><h3 className="ttp-mv-card-title">Misyon</h3></div>
                <RichHtml className="ttp-mv-card-body" html={settings.misyon ?? ""} />
              </div>
              <div className="ttp-mv-card ttp-mv-card-right">
                <div className="ttp-mv-card-header"><h3 className="ttp-mv-card-title">Vizyon</h3></div>
                <RichHtml className="ttp-mv-card-body" html={settings.vizyon ?? ""} />
              </div>
            </div>
          </div>
        </section>

        {values.length ? (
          <section id="temel-degerler-section" className="ttp-values-section">
            <div className="ttp-values-container">
              <div className="ttp-values-header">
                <span className="ttp-values-eyebrow">Neye İnanıyoruz</span>
                <h2 className="ttp-values-title">Temel Değerlerimiz</h2>
              </div>
              <ol className="ttp-values-grid">
                {values.map((value, index) => (
                  <li className="ttp-values-item" key={value}>
                    <span className="ttp-values-num">{String(index + 1).padStart(2, "0")}</span>
                    <p className="ttp-values-text">{value}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        <section className="elementor-element elementor-element-145868fe">
          <div className="elementor-background-overlay" />
          <div className="elementor-element elementor-element-4d3e5275">
            <div className="video-content">
              <a className="ekit_icon_button ekit-video-popup-btn" href="https://www.youtube.com/watch?v=BJq4d1-lHq8" target="_blank" rel="noopener noreferrer" aria-label="Videoyu oynat">
                ▶
              </a>
            </div>
          </div>
          <h3 className="elementskit-section-title">Birlikte güçlüyüz, birlikte kardeşiz; terörsüz Türkiye için el ele.</h3>
        </section>

        <TeamScroller>
          {board.map((member) => (
            <div className="ttp-team-capsule" key={member.id}>
              <div className="ttp-capsule-photo-wrap">
                <img className="ttp-capsule-img" src={assetUrl(member.photo) || "/assets/images/placeholder-avatar.svg"} alt={member.name} />
              </div>
              <div className="ttp-capsule-info">
                <h4 className="ttp-capsule-name">{member.name}</h4>
                <span className="ttp-capsule-role">{member.title}</span>
                <span className="ttp-capsule-org">{member.org}</span>
              </div>
            </div>
          ))}
        </TeamScroller>

        <section className="ttp-instagram-cta-section">
          <div className="ttp-instagram-cta-inner">
            {posts.length ? (
              <>
                <div className="ttp-ig-head">
                  {settings.instagram_profile_image ? (
                    <a className="ttp-ig-avatar" href={instagramUrl || "#"} target="_blank" rel="noopener noreferrer">
                      <img src={assetUrl(settings.instagram_profile_image)} alt={settings.instagram_username} />
                    </a>
                  ) : null}
                  <div className="ttp-ig-head-text">
                    <a className="ttp-ig-user" href={instagramUrl || "#"} target="_blank" rel="noopener noreferrer">{settings.instagram_username}</a>
                    {settings.instagram_bio ? <p className="ttp-ig-bio">{settings.instagram_bio}</p> : null}
                  </div>
                </div>
                <div className="ttp-ig-grid">
                  {posts.map((post) => (
                    <a className="ttp-ig-item" key={post.id} href={safeUrl(post.permalink)} target="_blank" rel="noopener noreferrer" aria-label="Instagram gönderisini aç">
                      <img src={assetUrl(post.image)} alt="" />
                      {post.media_type === "video" || post.media_type === "carousel" ? <span className="ttp-ig-badge">{post.media_type === "video" ? "▶" : "▣"}</span> : null}
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <p className="ttp-instagram-cta-text">Paylaşımlarımızı takip etmek için bizi Instagram&apos;da takip edin</p>
            )}
            {instagramUrl ? (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="ttp-instagram-cta-btn">Instagram&apos;da Takip Et</a>
            ) : null}
          </div>
        </section>

        <TurkeyMap provinces={provinces} coordinators={coordinators} />

        <section id="xs_political_blog">
          <h2 className="ekit-heading--title elementskit-section-title" style={{ textAlign: "center" }}>Haberler</h2>
          <div className="ttp-news-grid">
            {news.slice(0, 2).map((item) => (
              <Link key={item.id} href={`/haberler/${item.slug}`} className="ttp-news-card" title={item.title}>
                <div className="ttp-news-bg" style={{ backgroundImage: `url('${assetUrl(item.cover_image)}')` }} />
                <div className="ttp-news-overlay" />
                <div className="ttp-news-content">
                  <div className="ttp-news-meta">
                    <span className="ttp-news-cat">Basın</span>
                    <span className="ttp-news-dot">•</span>
                    <span className="ttp-news-date">{formatTrDate(item.published_at)}</span>
                  </div>
                  <h3 className="ttp-news-title">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
