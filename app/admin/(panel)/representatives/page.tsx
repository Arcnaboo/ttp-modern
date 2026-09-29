import Link from "next/link";
import { sql } from "@/lib/db";
import { PROVINCES } from "@/lib/provinces";

export default async function RepresentativesPage() {
  const reps = await sql<{ plate: string; name: string }[]>`SELECT plate, name FROM representatives`;
  const byPlate = new Map(reps.map((row) => [row.plate, row.name]));
  return (
    <>
      <h2>İl Başkanlıkları</h2>
      <div className="ttpa-card">
        <table className="ttpa-table">
          <thead><tr><th>Plaka</th><th>İl</th><th>Başkan</th><th></th></tr></thead>
          <tbody>
            {Object.entries(PROVINCES).map(([plate, info]) => (
              <tr key={plate}>
                <td>{plate}</td>
                <td>{info.name}</td>
                <td>{byPlate.get(plate) ?? "—"}</td>
                <td><Link className="btn small secondary" href={`/admin/representatives/${plate}`}>Düzenle</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
