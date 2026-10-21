import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { RichHtml } from "@/components/rich-html";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Tüzüğümüz" };

export default async function CharterPage() {
  const settings = await getSettings();
  return (
    <>
      <PageIntro title="Tüzüğümüz" lead="Platformun çalışma esasları ve kurumsal çerçevesi." />
      {settings.tuzuk ? (
        <div className="prose-shell">
          <RichHtml className="prose-body" html={settings.tuzuk} />
        </div>
      ) : (
        <EmptyState title="İçerik yakında" />
      )}
    </>
  );
}
