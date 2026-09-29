import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Etkinlikler" };

export default function EventsPage() {
  return (
    <>
      <SiteHeader pageTitle="Etkinlikler" />
      <main><div className="haber-wrap"><p className="haber-empty">İçerik yakında eklenecektir.</p></div></main>
      <SiteFooter />
    </>
  );
}
