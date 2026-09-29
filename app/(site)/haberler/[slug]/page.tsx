import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichHtml } from "@/components/rich-html";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNewsBySlug } from "@/lib/content";
import { formatTrDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  return { title: item?.title ?? "Haber bulunamadı" };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <div className="ttp-article-band">
          <div className="ttp-article-band-inner">
            <Link className="ttp-article-back" href="/haberler">← Haberler</Link>
            <h1 className="ttp-article-title">{item.title}</h1>
            <span className="ttp-article-date">{formatTrDate(item.published_at)}</span>
          </div>
        </div>
        <div className="haber-wrap">
          <RichHtml html={item.body_html} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
