import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
      <SiteHeader pageTitle="İletişim" />
      <main>
        <div className="haber-wrap">
          {cards.length === 0 ? <p className="haber-empty">İletişim bilgileri yakında eklenecektir.</p> : null}
          <div className="contact-info-grid">
            {cards.map(([label, value, href]) => (
              <article className="contact-info-card" key={label}>
                <span className="ci-label">{label}</span>
                {href ? <a className="ci-value" href={href}>{value}</a> : <span className="ci-value">{value}</span>}
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
