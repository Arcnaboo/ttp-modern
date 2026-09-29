import { contactAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { getSettings } from "@/lib/content";

export default async function ContactAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const settings = await getSettings();
  return (
    <>
      <h2>İletişim bilgileri</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <form className="ttpa-card ttpa-form" action={contactAction}>
        <label>Telefon<input name="contact_phone" defaultValue={settings.contact_phone ?? ""} /></label>
        <label>WhatsApp<input name="contact_whatsapp" defaultValue={settings.contact_whatsapp ?? ""} /></label>
        <label>E-posta<input name="contact_email" type="email" defaultValue={settings.contact_email ?? ""} /></label>
        <label>Adres<textarea name="contact_address" defaultValue={settings.contact_address ?? ""} /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kaydet</button></div>
      </form>
    </>
  );
}
