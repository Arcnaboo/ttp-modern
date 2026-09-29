import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/auth";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="ttpa-shell">
      <AdminNav />
      <main className="ttpa-main">{children}</main>
    </div>
  );
}
