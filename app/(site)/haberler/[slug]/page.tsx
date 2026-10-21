import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconChevronLeft } from "@/components/icons";
import { RichHtml } from "@/components/rich-html";
import { getNewsBySlug } from "@/lib/content";
import { formatTrDate } from "@/lib/format";
import { assetUrl } from "@/lib/paths";

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
      <header className="article-band">
        <div className="article-band-inner">
          <Link className="article-back" href="/haberler">
            <IconChevronLeft />
            Haberler
          </Link>
          <h1 className="article-title">{item.title}</h1>
          <span className="article-date">{formatTrDate(item.published_at)}</span>
        </div>
      </header>
      {item.cover_image ? (
        <div className="site-container" style={{ marginTop: "2rem" }}>
          <img
            src={assetUrl(item.cover_image)}
            alt=""
            width={1200}
            height={675}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "2px" }}
          />
        </div>
      ) : null}
      <div className="article-body">
        <RichHtml className="haber-article-body" html={item.body_html} />
      </div>
    </>
  );
}
