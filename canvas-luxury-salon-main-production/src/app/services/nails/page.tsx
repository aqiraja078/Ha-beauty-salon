import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { cmsToMenu } from "@/components/services/service-menu-mappers";
import { slugToTheme } from "@/lib/cms-service-page";
import { getServiceCategory, getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [cat, site] = await Promise.all([
    getServiceCategory("nails"),
    getSiteContent(),
  ]);
  return {
    title: cat.title,
    description: `${cat.description} — ${site.name}.`,
  };
}

export default async function NailsServicesPage() {
  const cat = await getServiceCategory("nails");
  return (
    <ServiceCategoryPage
      theme={slugToTheme.nails}
      title={cat.title}
      description={cat.description}
      sections={cmsToMenu(cat.sections)}
    />
  );
}
