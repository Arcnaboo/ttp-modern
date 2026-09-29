import { passwordAction } from "@/lib/actions";
import { Notice } from "@/components/notice";

export default async function PasswordPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string }> }) {
  const search = await searchParams;
  return (
    <>
      <h2>Şifre değiştir</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <form className="ttpa-card ttpa-form" action={passwordAction}>
        <label>Mevcut şifre<input name="current" type="password" required /></label>
        <label>Yeni şifre<input name="next" type="password" minLength={8} required /></label>
        <label>Yeni şifre tekrar<input name="again" type="password" minLength={8} required /></label>
        <div className="ttpa-actions"><button className="btn" type="submit">Güncelle</button></div>
      </form>
    </>
  );
}
