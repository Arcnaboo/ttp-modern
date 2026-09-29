export function Notice({ ok, hata }: { ok?: string; hata?: string }) {
  if (ok) return <div className="ttpa-flash ok">{ok}</div>;
  if (hata) return <div className="ttpa-flash err">{hata}</div>;
  return null;
}
