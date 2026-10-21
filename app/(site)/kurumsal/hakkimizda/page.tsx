import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { RichHtml } from "@/components/rich-html";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageIntro title="Hakkımızda" lead="Platformumuzun kuruluş amacı, yaklaşımı ve toplumsal sorumluluğu." />
      {settings.hakkimizda ? (
        <div className="prose-shell">
          <RichHtml className="prose-body" html={settings.hakkimizda} />
        </div>
      ) : (
        <EmptyState title="İçerik yakında" />
      )}
    </>
  );
}
