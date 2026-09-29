import { boardAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { getBoard } from "@/lib/content";
import { assetUrl } from "@/lib/paths";

export default async function BoardAdminPage({ searchParams }: { searchParams: Promise<{ edit?: string; ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const members = await getBoard();
  const editing = members.find((member) => String(member.id) === search.edit);

  return (
    <>
      <h2>Yönetim Kurulu</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <div className="ttpa-card">
        <table className="ttpa-table">
          <thead><tr><th></th><th>Ad Soyad</th><th>Unvan</th><th>Birim</th><th></th></tr></thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.photo ? <img src={assetUrl(member.photo)} alt="" /> : null}</td>
                <td>{member.name}</td>
                <td>{member.title}</td>
                <td>{member.org}</td>
                <td>
                  <a className="btn small secondary" href={`/admin/board?edit=${member.id}`}>Düzenle</a>
                  <form action={boardAction} style={{ display: "inline" }}>
                    <input type="hidden" name="delete_id" value={member.id} />
                    <button className="btn small danger" type="submit">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="ttpa-card ttpa-form" action={boardAction}>
        <h3>{editing ? "Üyeyi düzenle" : "Üye ekle"}</h3>
        <input type="hidden" name="id" value={editing?.id ?? 0} />
        <label>Ad Soyad<input name="name" defaultValue={editing?.name ?? ""} required /></label>
        <label>Unvan<input name="title" defaultValue={editing?.title ?? ""} required /></label>
        <label>Birim<input name="org" defaultValue={editing?.org ?? ""} /></label>
        <label>Sıra<input name="sort_order" type="number" defaultValue={editing?.sort_order ?? members.length + 1} /></label>
        <label>Fotoğraf<input name="photo" type="file" accept="image/*" /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kaydet</button></div>
      </form>
    </>
  );
}
