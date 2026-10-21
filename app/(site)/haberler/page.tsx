import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getNews } from "@/lib/content";
import { excerpt, formatTrDate } from "@/lib/format";
import { assetUrl } from "@/lib/paths";

export const metadata: Metadata = { title: "Haberler" };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s = "" } = await searchParams;
  const items = await getNews(s);

  return (
    <>
      <PageIntro title="Haberler" lead="Platformumuzun faaliyetleri, basın yansımaları ve güncel duyurular." />
      <div className="haber-toolbar">
        <form className="haber-search-form" action="/haberler" method="get">
          <div className="field">
            <label htmlFor="haber-search">Haberlerde ara</label>
            <input id="haber-search" className="site-field" type="search" name="s" placeholder="Anahtar kelime yazın…" defaultValue={s} />
          </div>
          <button type="submit" className="site-btn site-btn-primary">
            Ara
          </button>
        </form>
      </div>
      {items.length === 0 ? (
        <EmptyState
          title={s ? "Sonuç bulunamadı" : "Henüz haber yok"}
          body={s ? "Aramanızla eşleşen haber bulunamadı. Farklı bir anahtar kelime deneyebilirsiniz." : "Henüz haber eklenmedi."}
        />
      ) : (
        <div className="haber-list">
          {items.map((item) => (
            <Link className="news-card" href={`/haberler/${item.slug}`} key={item.id}>
              {item.cover_image ? (
                <div className="news-card-media">
                  <img src={assetUrl(item.cover_image)} alt="" width={640} height={400} />
                </div>
              ) : null}
              <div className="news-card-body">
                <span className="news-meta">Basın · {formatTrDate(item.published_at)}</span>
                <h2 className="news-card-title">{item.title}</h2>
                <p className="news-card-excerpt">{excerpt(item.body_html)}</p>
                <span className="news-card-cta">Devamını oku</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
