import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Etkinlikler" };

export default function EventsPage() {
  return (
    <>
      <PageIntro title="Etkinlikler" lead="Milli birlik ve kardeşlik buluşmalarımız." />
      <EmptyState title="Etkinlikler yakında" />
    </>
  );
}
