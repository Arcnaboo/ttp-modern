import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight, IconGrid, IconPlay } from "@/components/icons";
import { RichHtml } from "@/components/rich-html";
import { TeamScroller } from "@/components/team-scroller";
import { TurkeyMap } from "@/components/turkey-map";
import { getBoard, getCoordinators, getInstagramPosts, getNews, getProvinceMap, getSettings } from "@/lib/content";
import { formatTrDate } from "@/lib/format";
import { assetUrl, safeUrl } from "@/lib/paths";

const PATHWAYS = [
  {
    href: "/etkinlikler",
    title: "Etkinlikler",
    text: "Ülkemizin yedi bölgesinde milli birlik, beraberlik ve kardeşlik buluşmaları",
    image: "/wp-content/uploads/2026/03/haber-iftar-birlik.jpg",
  },
  {
    href: "/projeler",
    title: "Projeler",
    text: "Geleceğe güvenle bakan güçlü Türkiye için sürdürülebilir toplumsal projeler",
    image: "/wp-content/uploads/2026/03/haber-bg-turkiye-birlik.jpg",
  },
  {
    href: "/haberler",
    title: "Basında",
    text: "Platformumuzun faaliyetleri ve basında yer alan haberler",
    image: "/wp-content/uploads/2026/03/haber-ankara-program.jpg",
  },
  {
    href: "/#teskilat-haritasi",
    title: "Temsilcilikler",
    text: "81 il ve yurt dışı temsilcilik ağımızla sahadayız",
    image: "/wp-content/uploads/2026/03/haber-bg-ankara.jpg",
  },
  {
    href: "/iletisim",
    title: "Gönüllü Ol",
    text: "Huzurlu bir Türkiye için el ele omuz omuza",
    image: "/wp-content/uploads/2026/03/turkish-flag-silk-bg.jpg",
  },
] as const;

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
  const heroDesktop = assetUrl(settings.hero_image_desktop) || "/wp-content/uploads/2026/03/slide-tek.jpg";
  const founderPhoto = "/wp-content/uploads/2026/03/baskan.png";

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-media">
          <Image src={heroDesktop} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
        </div>
        <div className="home-hero-scrim" />
        <div className="home-hero-content">
          <span className="home-hero-kicker">Ben değil, biz değil, hepimiz Türkiyeyiz</span>
          <h1 className="home-hero-title">Terörsüz Türkiye Platformu</h1>
          <p className="home-hero-lead">
            Milli birlik, kardeşlik ve dayanışma iradesiyle terörsüz bir gelecek için 81 ilde el ele.
          </p>
          <div className="home-hero-actions">
            <Link href="/haberler" className="site-btn site-btn-primary">
              Haberler
            </Link>
            <Link href="/iletisim" className="site-btn site-btn-on-dark">
              İletişim
            </Link>
          </div>
        </div>
      </section>

      <section id="baskan-mesaji-section" className="home-section">
        <div className="founder-grid">
          <div className="founder-copy">
            <span className="section-kicker">Kurucu Mesajı</span>
            <h2 className="section-title">Kurucu Genel Başkan Mesajı</h2>
            <p className="founder-lead">Proje Sahibi Kurucu Genel Başkan Turgut Lenk ve yönetimi olarak;</p>
            <RichHtml className="prose-body" html={settings.founder_message ?? ""} />
          </div>
          <div className="founder-media">
            <Image src={founderPhoto} alt="Kurucu Genel Başkan" fill sizes="(max-width: 900px) 100vw, 40vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <section className="home-section home-section-card" style={{ paddingTop: "3rem" }}>
        <div className="section-head">
          <span className="section-kicker">Alanlar</span>
          <h2 className="section-title">Birlikte yürüdüğümüz yollar</h2>
        </div>
        <div className="pathway-grid">
          {PATHWAYS.map((item) => (
            <Link key={item.title} href={item.href} className="pathway-card">
              <div className="pathway-card-bg" style={{ backgroundImage: `url('${item.image}')` }} />
              <div className="pathway-card-overlay" />
              <span className="pathway-arrow" aria-hidden="true">
                <IconArrowUpRight />
              </span>
              <div className="pathway-card-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="misyon-vizyon-section" className="home-section">
        <div className="section-head">
          <span className="section-kicker">Yönümüz</span>
          <h2 className="section-title">Misyon ve Vizyonumuz</h2>
        </div>
        <div className="mv-grid">
          <article className="mv-card">
            <h3>Misyon</h3>
            <RichHtml className="prose-body" html={settings.misyon ?? ""} />
          </article>
          <article className="mv-card">
            <h3>Vizyon</h3>
            <RichHtml className="prose-body" html={settings.vizyon ?? ""} />
          </article>
        </div>
      </section>

      {values.length ? (
        <section id="temel-degerler-section" className="home-section home-section-card">
          <div className="section-head">
            <span className="section-kicker">Neye İnanıyoruz</span>
            <h2 className="section-title">Temel Değerlerimiz</h2>
          </div>
          <ol className="values-grid">
            {values.map((value, index) => (
              <li className="values-item" key={value}>
                <span className="values-num">{String(index + 1).padStart(2, "0")}</span>
                <p className="values-text">{value}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="video-band">
        <div className="video-band-bg" aria-hidden="true" />
        <div className="video-band-scrim" aria-hidden="true" />
        <div className="video-band-inner">
          <p>Birlikte güçlüyüz, birlikte kardeşiz; terörsüz Türkiye için el ele.</p>
          <a
            className="site-btn site-btn-primary"
            href="https://www.youtube.com/watch?v=BJq4d1-lHq8"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconPlay />
            Videoyu oynat
          </a>
        </div>
      </section>

      <TeamScroller>
        {board.map((member) => (
          <article className="team-card" key={member.id}>
            <div className="team-photo">
              <img src={assetUrl(member.photo) || "/assets/images/placeholder-avatar.svg"} alt={member.name} width={184} height={245} />
            </div>
            <div className="team-info">
              <h4>{member.name}</h4>
              <span className="team-role">{member.title}</span>
              {member.org ? <span className="team-org">{member.org}</span> : null}
            </div>
          </article>
        ))}
      </TeamScroller>

      <section className="home-section home-section-card">
        <div className="section-head">
          <span className="section-kicker">Sosyal</span>
          <h2 className="section-title">Instagram&apos;dan</h2>
        </div>
        {posts.length ? (
          <>
            <div className="ig-head">
              {settings.instagram_profile_image ? (
                <a className="ig-avatar" href={instagramUrl || "#"} target="_blank" rel="noopener noreferrer">
                  <img src={assetUrl(settings.instagram_profile_image)} alt="" width={56} height={56} />
                </a>
              ) : null}
              <div>
                {settings.instagram_username ? (
                  <a className="ig-user" href={instagramUrl || "#"} target="_blank" rel="noopener noreferrer">
                    {settings.instagram_username}
                  </a>
                ) : null}
                {settings.instagram_bio ? <p className="ig-bio">{settings.instagram_bio}</p> : null}
              </div>
            </div>
            <div className="ig-grid">
              {posts.map((post) => (
                <a className="ig-item" key={post.id} href={safeUrl(post.permalink)} target="_blank" rel="noopener noreferrer" aria-label="Instagram gönderisini aç">
                  <img src={assetUrl(post.image)} alt="" width={400} height={400} />
                  {post.media_type === "video" || post.media_type === "carousel" ? (
                    <span className="ig-badge" aria-hidden="true">
                      {post.media_type === "video" ? <IconPlay /> : <IconGrid />}
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          </>
        ) : (
          <p className="section-lead site-container">Paylaşımlarımızı takip etmek için bizi Instagram&apos;da takip edin.</p>
        )}
        {instagramUrl ? (
          <div className="ig-actions">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="site-btn site-btn-primary">
              Instagram&apos;da Takip Et
            </a>
          </div>
        ) : null}
      </section>

      <TurkeyMap provinces={provinces} coordinators={coordinators} />

      <section className="home-section">
        <div className="section-head">
          <span className="section-kicker">Gündem</span>
          <h2 className="section-title">Haberler</h2>
        </div>
        <div className="news-grid">
          {news.slice(0, 3).map((item) => (
            <Link key={item.id} href={`/haberler/${item.slug}`} className="news-card">
              <div className="news-card-media">
                {item.cover_image ? (
                  <img src={assetUrl(item.cover_image)} alt="" width={640} height={400} />
                ) : null}
              </div>
              <div className="news-card-body">
                <span className="news-meta">Basın · {formatTrDate(item.published_at)}</span>
                <h3 className="news-card-title">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-more">
          <Link href="/haberler" className="site-btn site-btn-secondary">
            Tüm haberler
          </Link>
        </div>
      </section>
    </>
  );
}
