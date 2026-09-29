import { socialAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import { getSettings } from "@/lib/content";

export default async function SocialAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const settings = await getSettings();
  return (
    <>
      <h2>Sosyal medya</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <form className="ttpa-card ttpa-form" action={socialAction}>
        <label>Instagram<input name="social_instagram" defaultValue={settings.social_instagram ?? ""} /></label>
        <label>Facebook<input name="social_facebook" defaultValue={settings.social_facebook ?? ""} /></label>
        <label>X<input name="social_twitter" defaultValue={settings.social_twitter ?? ""} /></label>
        <label>LinkedIn<input name="social_linkedin" defaultValue={settings.social_linkedin ?? ""} /></label>
        <label>Instagram kullanıcı adı<input name="instagram_username" defaultValue={settings.instagram_username ?? ""} /></label>
        <label>Instagram açıklama<textarea name="instagram_bio" defaultValue={settings.instagram_bio ?? ""} /></label>
        <label>Instagram erişim anahtarı<input name="instagram_access_token" defaultValue={settings.instagram_access_token ?? ""} /></label>
        <label>Profil görseli<input name="instagram_profile_image" type="file" accept="image/*" /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Kaydet</button></div>
      </form>
    </>
  );
}
