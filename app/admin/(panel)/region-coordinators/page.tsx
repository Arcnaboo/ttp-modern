import { coordinatorAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { getCoordinators } from "@/lib/content";

export default async function CoordinatorsPage({ searchParams }: { searchParams: Promise<{ edit?: string; ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const items = await getCoordinators();
  const editing = items.find((item) => String(item.id) === search.edit);
  return (
    <>
      <h2>Bölge Sorumluları</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <div className="ttpa-card">
        <table className="ttpa-table">
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.title}</td>
                <td>
                  <a className="btn small secondary" href={`/admin/region-coordinators?edit=${item.id}`}>Düzenle</a>
                  <form action={coordinatorAction} style={{ display: "inline" }}>
                    <input type="hidden" name="delete_id" value={item.id} />
                    <button className="btn small danger" type="submit">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="ttpa-card ttpa-form" action={coordinatorAction}>
        <input type="hidden" name="id" value={editing?.id ?? 0} />
        <label>Ad Soyad<input name="name" defaultValue={editing?.name ?? ""} required /></label>
        <label>Unvan<input name="title" defaultValue={editing?.title ?? ""} required /></label>
        <label>Sıra<input name="sort_order" type="number" defaultValue={0} /></label>
        <label>Fotoğraf<input name="photo" type="file" accept="image/*" /></label>
        <label>Yetki belgesi<input name="certificate" type="file" accept="image/*" /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kaydet</button></div>
      </form>
    </>
  );
}
