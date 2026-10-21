import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getDocuments } from "@/lib/content";
import { assetUrl } from "@/lib/paths";

export const metadata: Metadata = { title: "Belgeler" };

export default async function DocumentsPage() {
  const documents = await getDocuments();
  return (
    <>
      <PageIntro title="Belgeler" lead="Kurumsal belgeler ve kamuya açık dosyalar." />
      {documents.length === 0 ? (
        <EmptyState title="Belge bulunamadı" />
      ) : (
        <div className="doc-grid">
          {documents.map((document) => (
            <article className="doc-card" key={document.id}>
              <h2 className="doc-card-title">{document.title}</h2>
              <a href={assetUrl(document.file)} target="_blank" rel="noopener noreferrer">
                Görüntüle
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
