import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNews } from "@/lib/content";
import { excerpt, formatTrDate } from "@/lib/format";
import { assetUrl } from "@/lib/paths";

export const metadata: Metadata = { title: "Haberler" };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s = "" } = await searchParams;
  const items = await getNews(s);

  return (
    <>
      <SiteHeader pageTitle="Haberler" />
      <main>
        <div className="haber-wrap">
          <form className="haber-search-form" action="/haberler" method="get">
            <input type="search" name="s" placeholder="Haberlerde ara…" defaultValue={s} />
            <button type="submit">Ara</button>
          </form>
          {items.length === 0 ? <p className="haber-empty">{s ? "Aramanızla eşleşen haber bulunamadı." : "Henüz haber eklenmedi."}</p> : null}
          {items.map((item) => (
            <Link className="haber-card" href={`/haberler/${item.slug}`} key={item.id}>
              {item.cover_image ? <img src={assetUrl(item.cover_image)} alt="" /> : null}
              <div className="haber-card-body">
                <span className="haber-card-tag">Basın · {formatTrDate(item.published_at)}</span>
                <h2 className="haber-card-title">{item.title}</h2>
                <p className="haber-card-excerpt">{excerpt(item.body_html)}</p>
                <span className="haber-card-cta">Devamını Oku →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
