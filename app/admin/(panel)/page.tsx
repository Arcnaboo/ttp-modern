import Link from "next/link";
import { sql } from "@/lib/db";

export default async function AdminHome() {
  const [board, reps, coords, news, posts] = await Promise.all([
    sql<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM board_members`,
    sql<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM representatives`,
    sql<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM region_coordinators`,
    sql<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM news`,
    sql<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM instagram_posts`,
  ]);
  const cards = [
    ["Yönetim Kurulu", board[0].n, "üye", "/admin/board"],
    ["İl Başkanlıkları", reps[0].n, "il", "/admin/representatives"],
    ["Bölge Sorumluları", coords[0].n, "kişi", "/admin/region-coordinators"],
    ["Haberler", news[0].n, "haber", "/admin/news"],
    ["Instagram", posts[0].n, "gönderi", "/admin/instagram"],
  ] as const;

  return (
    <>
      <h2>Panel</h2>
      <div className="ttpa-grid">
        {cards.map(([label, count, unit, href]) => (
          <Link className="ttpa-card" key={href} href={href}>
            <strong>{label}</strong>
            <p>{count} {unit}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
