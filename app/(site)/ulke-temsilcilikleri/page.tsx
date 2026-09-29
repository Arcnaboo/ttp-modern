import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "Ülke Temsilcilikleri" };

export default function CountryOfficesPage() {
  return (
    <>
      <SiteHeader pageTitle="Ülke Temsilcilikleri" />
      <main><div className="haber-wrap"><p className="haber-empty">İçerik yakında eklenecektir.</p></div></main>
      <SiteFooter />
    </>
  );
}
