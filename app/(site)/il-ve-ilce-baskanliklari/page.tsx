import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TurkeyMap } from "@/components/turkey-map";
import { getCoordinators, getProvinceMap } from "@/lib/content";

export const metadata: Metadata = { title: "İl ve İlçe Başkanlıkları" };

export default async function ProvincesPage() {
  const [provinces, coordinators] = await Promise.all([getProvinceMap(), getCoordinators()]);
  return (
    <>
      <SiteHeader pageTitle="İl ve İlçe Başkanlıkları" />
      <main>
        <TurkeyMap provinces={provinces} coordinators={coordinators} />
      </main>
      <SiteFooter />
    </>
  );
}
