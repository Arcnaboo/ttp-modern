import { instagramAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { getInstagramPosts, getSettings } from "@/lib/content";
import { assetUrl } from "@/lib/paths";

export default async function InstagramAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const [posts, settings] = await Promise.all([getInstagramPosts(), getSettings()]);
  return (
    <>
      <h2>Instagram akışı</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <p>Son eşitleme: {settings.instagram_last_sync || "yok"}</p>
      <form action={instagramAction}><button className="btn" name="sync" value="1" type="submit">Eşitle</button></form>
      <div className="ttpa-card">
        <table className="ttpa-table">
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.image ? <img src={assetUrl(post.image)} alt="" /> : null}</td>
                <td>{post.media_type}</td>
                <td>
                  <form action={instagramAction}>
                    <input type="hidden" name="delete_id" value={post.id} />
                    <button className="btn small danger" type="submit">Sil</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="ttpa-card ttpa-form" action={instagramAction}>
        <h3>Gönderi ekle</h3>
        <label>Bağlantı<input name="permalink" required /></label>
        <label>Tür
          <select name="media_type" defaultValue="image">
            <option value="image">image</option>
            <option value="video">video</option>
            <option value="carousel">carousel</option>
          </select>
        </label>
        <label>Açıklama<textarea name="caption" /></label>
        <label>Görsel<input name="image" type="file" accept="image/*" required /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Ekle</button></div>
      </form>
    </>
  );
}
