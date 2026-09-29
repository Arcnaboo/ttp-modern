import type { Metadata } from "next";
import { RichHtml } from "@/components/rich-html";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <SiteHeader pageTitle="Hakkımızda" />
      <main>
        <div className="haber-wrap">
          {settings.hakkimizda ? <RichHtml html={settings.hakkimizda} /> : <p className="haber-empty">İçerik yakında eklenecektir.</p>}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
