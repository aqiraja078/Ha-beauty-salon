import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { makeupToMenu } from "@/components/services/service-menu-mappers";
import { makeupServiceSections } from "@/lib/makeup-services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Makeup services",
  description: `Bridal, party, and camera-ready makeup by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const heroImages = [
  "https://i.pinimg.com/736x/86/87/9c/86879c401e8248877e6a6f3065c08118.jpg?w=800&q=70",
  "https://i.pinimg.com/736x/be/f3/d9/bef3d934e5cfaeeec54f5a1c7ee6dcb2.jpg?w=800&q=70",
];

export default function MakeupServicesPage() {
  return (
    <ServiceCategoryPage
      theme="makeup"
      heroImages={heroImages}
      heroAlt="Makeup and beauty services at Huma Salon & Studio"
      kicker="Makeup menu"
      title="Makeup services"
      description="Bridal, engagement, party, and camera-ready looks — clear pricing on every card. Tap Book to reserve your artist."
      quickLinks={[
        { href: "/services/hair", label: "Hair menu" },
        { href: "/services/facial", label: "Facial menu" },
        { href: "/services/body-spa", label: "Body & spa" },
        { href: "/services/nails", label: "Nails" },
      ]}
      sections={makeupToMenu(makeupServiceSections)}
      footerNote="Not sure which makeup service fits? Book a consultation and we will design the perfect look for your occasion."
    />
  );
}
