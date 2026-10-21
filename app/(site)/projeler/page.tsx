import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = { title: "Projeler" };

export default function ProjectsPage() {
  return (
    <>
      <PageIntro title="Projeler" lead="Toplumsal dayanışma ve birlik hedefli çalışmalarımız." />
      <EmptyState title="Projeler yakında" />
    </>
  );
}
