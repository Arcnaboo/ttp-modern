import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { PageIntro } from "@/components/page-intro";
import { getSettings } from "@/lib/content";
import { digits } from "@/lib/paths";

export const metadata: Metadata = { title: "İletişim" };

export default async function ContactPage() {
  const settings = await getSettings();
  const cards = [
    ["Telefon", settings.contact_phone, settings.contact_phone ? `tel:${digits(settings.contact_phone)}` : ""],
    ["WhatsApp", settings.contact_whatsapp, settings.contact_whatsapp ? `https://wa.me/${digits(settings.contact_whatsapp)}` : ""],
    ["E-posta", settings.contact_email, settings.contact_email ? `mailto:${settings.contact_email}` : ""],
    ["Adres", settings.contact_address, ""],
  ].filter((card) => card[1]);

  return (
    <>
      <PageIntro title="İletişim" lead="Sorularınız, önerileriniz ve gönüllülük başvurularınız için bize ulaşın." />
      {cards.length === 0 ? (
        <EmptyState title="İletişim bilgileri yakında" body="İletişim bilgileri yakında eklenecektir." />
      ) : (
        <div className="contact-grid">
          {cards.map(([label, value, href]) => (
            <article className="contact-card" key={label}>
              <span className="contact-label">{label}</span>
              {href ? (
                <a className="contact-value" href={href}>
                  {value}
                </a>
              ) : (
                <span className="contact-value">{value}</span>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
