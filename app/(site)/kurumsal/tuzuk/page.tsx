import type { Metadata } from "next";
import { RichHtml } from "@/components/rich-html";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Tüzüğümüz" };

export default async function CharterPage() {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader pageTitle="Tüzüğümüz" />
      <main>
        <div className="haber-wrap">
          {settings.tuzuk ? <RichHtml html={settings.tuzuk} /> : <p className="haber-empty">İçerik yakında eklenecektir.</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
