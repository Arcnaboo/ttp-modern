import { sanitizeRichText } from "@/lib/html";

export function RichHtml({ html, className = "haber-article-body" }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
