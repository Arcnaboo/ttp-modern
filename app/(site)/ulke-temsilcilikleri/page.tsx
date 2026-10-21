import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Ülke Temsilcilikleri" };

export default function CountryOfficesPage() {
  return (
    <>
      <PageIntro title="Ülke Temsilcilikleri" lead="Yurt dışındaki temsilcilik ağımız." />
      <EmptyState title="Ülke temsilcilikleri yakında" />
    </>
  );
}
