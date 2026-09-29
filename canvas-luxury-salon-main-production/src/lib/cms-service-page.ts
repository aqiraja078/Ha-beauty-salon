import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";
import type { ServiceCategorySlug } from "@/lib/cms-types";

export const slugToTheme: Record<ServiceCategorySlug, ServiceThemeId> = {
  hair: "hair",
  makeup: "makeup",
  facial: "facial",
  "body-spa": "bodySpa",
};

import type { ServiceHeroContent } from "@/components/services/ServicePageHero";
import type { CmsServiceCategory } from "@/lib/cms-types";

/** Map admin "Page chrome" fields to the service hero. */
export function serviceHero(cat: CmsServiceCategory): ServiceHeroContent {
  return {
    label: cat.kicker,
    headline: cat.headline,
    headlineAccent: cat.headlineAccent,
    script: cat.script,
    image: cat.heroImages?.[0],
    imageAlt: cat.heroAlt,
  };
}
