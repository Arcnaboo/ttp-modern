import Link from "next/link";

export function EmptyState({
  title,
  body = "Bu sayfanın içeriği yakında eklenecektir. Sorularınız için bizimle iletişime geçebilirsiniz.",
}: {
  title: string;
  body?: string;
}) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{body}</p>
      <Link href="/iletisim" className="site-btn site-btn-primary">
        İletişime Geç
      </Link>
    </div>
  );
}
