import { notFound } from "next/navigation";
import { memberAction, representativeAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { sql } from "@/lib/db";
import { PROVINCES } from "@/lib/provinces";
import { assetUrl } from "@/lib/paths";

export default async function ProvinceAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ plate: string }>;
  searchParams: Promise<{ ok?: string; hata?: string; edit?: string }>;
}) {
  const { plate } = await params;
  const search = await searchParams;
  const info = PROVINCES[plate];
  if (!info) notFound();
  const reps = await sql<{ name: string; title: string; photo: string; certificate: string; sort_order: number }[]>`
    SELECT name, title, photo, certificate, sort_order FROM representatives WHERE plate = ${plate}
  `;
  const members = await sql<{ id: number; parent_id: number | null; name: string; title: string; photo: string; sort_order: number }[]>`
    SELECT id, parent_id, name, title, photo, sort_order FROM representative_members WHERE plate = ${plate} ORDER BY sort_order, id
  `;
  const rep = reps[0];
  const editing = members.find((member) => String(member.id) === search.edit);

  return (
    <>
      <a className="btn small secondary" href="/admin/representatives">← İller</a>
      <h2>{info.name}</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <form className="ttpa-card ttpa-form" action={representativeAction}>
        <h3>İl başkanı</h3>
        <input type="hidden" name="plate" value={plate} />
        <label>Ad Soyad<input name="name" defaultValue={rep?.name ?? ""} required /></label>
        <label>Unvan<input name="title" defaultValue={rep?.title ?? "İl Başkanı"} /></label>
        <label>Sıra<input name="sort_order" type="number" defaultValue={rep?.sort_order ?? 0} /></label>
        <label>Fotoğraf<input name="photo" type="file" accept="image/*" /></label>
        {rep?.photo ? <img src={assetUrl(rep.photo)} alt="" width={60} height={60} /> : null}
        <label>Yetki belgesi<input name="certificate" type="file" accept="image/*" /></label>
        <div className="ttpa-actions">
          <button className="btn" type="submit">Kaydet</button>
          {rep ? <button className="btn danger" name="delete_rep" value="1" type="submit">Sil</button> : null}
        </div>
      </form>
      <div className="ttpa-card">
        <h3>İlçe ve kurul üyeleri</h3>
        <table className="ttpa-table">
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.title}</td>
                <td>
                  <a className="btn small secondary" href={`/admin/representatives/${plate}?edit=${member.id}`}>Düzenle</a>
                  <form action={memberAction} style={{ display: "inline" }}>
                    <input type="hidden" name="plate" value={plate} />
                    <input type="hidden" name="delete_id" value={member.id} />
                    <button className="btn small danger" type="submit">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="ttpa-card ttpa-form" action={memberAction}>
        <h3>{editing ? "Üyeyi düzenle" : "Üye ekle"}</h3>
        <input type="hidden" name="plate" value={plate} />
        <input type="hidden" name="id" value={editing?.id ?? 0} />
        <label>Ad Soyad<input name="name" defaultValue={editing?.name ?? ""} required /></label>
        <label>Unvan<input name="title" defaultValue={editing?.title ?? ""} /></label>
        <label>Bağlı olduğu kişi
          <select name="parent_id" defaultValue={editing?.parent_id ?? ""}>
            <option value="">İl başkanına bağlı</option>
            {members.filter((member) => member.id !== editing?.id).map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </label>
        <label>Sıra<input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} /></label>
        <label>Fotoğraf<input name="photo" type="file" accept="image/*" /></label>
        <label>Yetki belgesi<input name="certificate" type="file" accept="image/*" /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kaydet</button></div>
      </form>
    </>
  );
}
