import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";
import type { ServiceCategorySlug } from "@/lib/cms-types";

export const slugToTheme: Record<ServiceCategorySlug, ServiceThemeId> = {
  hair: "hair",
  makeup: "makeup",
  facial: "facial",
  "body-spa": "bodySpa",
  nails: "nails",
  mehndi: "mehndi",
};
