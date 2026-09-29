import { loginAction } from "@/lib/actions";
import { Notice } from "@/components/notice";
import "../admin.css";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string; expired?: string }> }) {
  const search = await searchParams;
  return (
    <div className="ttpa-login">
      <form className="ttpa-card ttpa-form" action={loginAction}>
        <h2>Yönetim girişi</h2>
        <Notice ok={search.ok} hata={search.expired ? "Oturum süresi doldu. Tekrar giriş yapın." : search.hata} />
        <label htmlFor="username">Kullanıcı adı</label>
        <input id="username" name="username" autoComplete="username" required />
        <label htmlFor="password">Şifre</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        <div className="ttpa-actions"><button className="btn" type="submit">Giriş yap</button></div>
      </form>
    </div>
  );
}
