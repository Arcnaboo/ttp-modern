import { documentAction, heroAction, textsAction } from "@/lib/actions";
import { AdminFileField } from "@/components/admin-file-field";
import { Notice } from "@/components/notice";
import { getDocuments, getSettings } from "@/lib/content";

export default async function SiteSettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const [settings, documents] = await Promise.all([getSettings(), getDocuments()]);
  return (
    <>
      <h2>Sayfa metinleri ve kapak</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <form className="ttpa-card ttpa-form" action={textsAction}>
        {([
          ["founder_message", "Kurucu genel başkan mesajı"],
          ["hakkimizda", "Hakkımızda"],
          ["misyon", "Misyon"],
          ["vizyon", "Vizyon"],
          ["tuzuk", "Tüzük"],
          ["temel_degerler", "Temel değerler (her satır bir madde)"],
        ] as const).map(([key, label]) => (
          <label key={key}>{label}<textarea name={key} defaultValue={settings[key] ?? ""} /></label>
        ))}
        <div className="ttpa-actions"><button className="btn" type="submit">Metinleri kaydet</button></div>
      </form>
      <form className="ttpa-card ttpa-form" action={heroAction}>
        <h3>Kapak görselleri</h3>
        <p>Masaüstü: {settings.hero_image_desktop || "varsayılan"}</p>
        <AdminFileField name="hero_image_desktop" label="Masaüstü" />
        <label><input name="clear_hero_image_desktop" type="checkbox" value="1" /> Masaüstünü temizle</label>
        <p>Mobil: {settings.hero_image_mobile || "varsayılan"}</p>
        <AdminFileField name="hero_image_mobile" label="Mobil" />
        <label><input name="clear_hero_image_mobile" type="checkbox" value="1" /> Mobil kapak görselini temizle</label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kapakları kaydet</button></div>
      </form>
      <div className="ttpa-card">
        <h3>Belgeler</h3>
        {documents.map((document) => (
          <form key={document.id} action={documentAction}>
            <span>{document.title}</span>
            <input type="hidden" name="delete_id" value={document.id} />
            <button className="btn small danger" type="submit">Sil</button>
          </form>
        ))}
        <form className="ttpa-form" action={documentAction}>
          <label>Başlık<input name="doc_title" required /></label>
          <AdminFileField name="doc_file" label="Dosya" accept="image/*,.pdf" kind="document" required />
          <div className="ttpa-actions"><button className="btn" type="submit">Belge ekle</button></div>
        </form>
      </div>
    </>
  );
}
