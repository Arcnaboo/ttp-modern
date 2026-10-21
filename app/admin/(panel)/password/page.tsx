import { Notice } from "@/components/notice";
import { adminCredentials } from "@/lib/admin-credentials";

export default async function PasswordPage({ searchParams }: { searchParams: Promise<{ ok?: string; hata?: string }> }) {
  const search = await searchParams;
  const { username, configured } = adminCredentials();

  return (
    <>
      <h2>Şifre</h2>
      <Notice ok={search.ok} hata={search.hata} />
      <div className="ttpa-card">
        <p style={{ marginTop: 0, lineHeight: 1.55 }}>
          Yönetici girişi ortam değişkenlerinden okunur. Şifreyi değiştirmek için <code>.env.local</code> dosyasındaki{" "}
          <code>ADMIN_PASSWORD</code> değerini güncelleyin ve <code>npm run dev</code> / sunucuyu yeniden başlatın.
        </p>
        <p style={{ marginBottom: 0, color: "var(--muted)" }}>
          Kullanıcı adı ({configured ? <code>{username}</code> : "tanımsız"}): <code>ADMIN_USERNAME</code>
          <br />
          Şifre: <code>ADMIN_PASSWORD</code>
        </p>
      </div>
    </>
  );
}
