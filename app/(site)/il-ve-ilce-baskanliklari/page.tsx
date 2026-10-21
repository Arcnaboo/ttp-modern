import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { TurkeyMap } from "@/components/turkey-map";
import { getCoordinators, getProvinceMap } from "@/lib/content";

export const metadata: Metadata = { title: "İl ve İlçe Başkanlıkları" };

export default async function ProvincesPage() {
  const [provinces, coordinators] = await Promise.all([getProvinceMap(), getCoordinators()]);
  return (
    <div className="map-page-wrap">
      <PageIntro
        title="İl ve İlçe Başkanlıkları"
        lead="Haritadan il seçerek temsilcilik yapısını ve yetki belgelerini görüntüleyebilirsiniz."
      />
      <TurkeyMap provinces={provinces} coordinators={coordinators} />
    </div>
  );
}
