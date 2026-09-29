import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { cmsToMenu } from "@/components/services/service-menu-mappers";
import { serviceHero, slugToTheme } from "@/lib/cms-service-page";
import { getServiceCategory, getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [cat, site] = await Promise.all([
    getServiceCategory("body-spa"),
    getSiteContent(),
  ]);
  return {
    title: cat.title,
    description: `${cat.description} — ${site.name}.`,
  };
}

export default async function BodySpaServicesPage() {
  const cat = await getServiceCategory("body-spa");
  return (
    <ServiceCategoryPage
      theme={slugToTheme["body-spa"]}
      title={cat.title}
      description={cat.description}
      sections={cmsToMenu(cat.sections)}
      hero={serviceHero(cat)}
      footerNote={cat.footerNote}
    />
  );
}
