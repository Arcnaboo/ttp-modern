import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Projeler" };

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader pageTitle="Projeler" />
      <main><div className="haber-wrap"><p className="haber-empty">İçerik yakında eklenecektir.</p></div></main>
      <SiteFooter />
    </>
  );
}
