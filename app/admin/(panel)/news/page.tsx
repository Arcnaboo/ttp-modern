import { newsAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { getNews } from "@/lib/content";
import { dateInputValue } from "@/lib/format";

export default async function NewsAdminPage({ searchParams }: { searchParams: Promise<{ edit?: string; ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const items = await getNews();
  const editing = items.find((item) => String(item.id) === search.edit);
  return (
    <>
      <h2>Haberler</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <div className="ttpa-card">
        <table className="ttpa-table">
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.published_at}</td>
                <td>
                  <a className="btn small secondary" href={`/admin/news?edit=${item.id}`}>Düzenle</a>
                  <form action={newsAction} style={{ display: "inline" }}>
                    <input type="hidden" name="delete_id" value={item.id} />
                    <button className="btn small danger" type="submit">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="ttpa-card ttpa-form" action={newsAction}>
        <input type="hidden" name="id" value={editing?.id ?? 0} />
        <label>Başlık<input name="title" defaultValue={editing?.title ?? ""} required /></label>
        <label>Adres (slug)<input name="slug" defaultValue={editing?.slug ?? ""} /></label>
        <label>Tarih<input name="published_at" type="date" defaultValue={editing ? dateInputValue(editing.published_at) : new Date().toISOString().slice(0, 10)} required /></label>
        <label>Kapak<input name="cover_image" type="file" accept="image/*" /></label>
        <label>Metin<textarea name="body_html" defaultValue={editing?.body_html ?? ""} /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kaydet</button></div>
      </form>
    </>
  );
}
