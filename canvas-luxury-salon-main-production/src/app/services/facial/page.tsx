import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { facialToMenu } from "@/components/services/service-menu-mappers";
import { facialServiceSections } from "@/lib/facial-services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Facial services",
  description: `Basic, brightening, advanced, and bridal facials by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const heroImages = [
  "https://i.pinimg.com/736x/90/c2/ca/90c2ca7d26c07a57933640fac0b9173b.jpg?w=800&q=70",
  "https://i.pinimg.com/736x/f3/ac/5c/f3ac5c2b0083d236ccaa18957bd41791.jpg?w=800&q=70",
];

export default function FacialServicesPage() {
  return (
    <ServiceCategoryPage
      theme="facial"
      heroImages={heroImages}
      heroAlt="Facial treatments and skincare at Huma Salon & Studio"
      kicker="Facial menu"
      title="Facial services"
      description="Quick refreshes, bridal glow, and advanced skin treatments — price, duration, and description on every card."
      quickLinks={[
        { href: "/services/hair", label: "Hair menu" },
        { href: "/services/body-spa", label: "Body & spa" },
        { href: "/services/nails", label: "Nails" },
        { href: "/services/makeup", label: "Makeup" },
      ]}
      sections={facialToMenu(facialServiceSections)}
      footerNote="Sensitive skin or first-time facial? Book a consultation and we will recommend the right protocol."
    />
  );
}
