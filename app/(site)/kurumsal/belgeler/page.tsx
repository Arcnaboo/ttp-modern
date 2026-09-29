import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDocuments } from "@/lib/content";
import { assetUrl } from "@/lib/paths";

export const metadata: Metadata = { title: "Belgeler" };

export default async function DocumentsPage() {
  const documents = await getDocuments();
  return (
    <>
      <SiteHeader pageTitle="Belgeler" />
      <main>
        <div className="haber-wrap">
          {documents.length === 0 ? <p className="haber-empty">İçerik yakında eklenecektir.</p> : null}
          <div className="doc-grid">
            {documents.map((document) => (
              <article className="doc-card" key={document.id}>
                <h2 className="doc-card-title">{document.title}</h2>
                <a href={assetUrl(document.file)} target="_blank" rel="noopener noreferrer">Görüntüle</a>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
