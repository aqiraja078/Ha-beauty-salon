import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { hairToMenu } from "@/components/services/service-menu-mappers";
import { hairServiceSections } from "@/lib/hair-services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hair services",
  description: `Cuts, color, treatments, styling, and bridal hair by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const heroImages = [
  "https://i.pinimg.com/736x/2c/a0/25/2ca0258ddeef532121c97c579a897541.jpg?w=800&q=70",
  "https://i.pinimg.com/736x/36/34/65/363465309f06503bea07436a701ea8d8.jpg?w=800&q=70",
];

export default function HairServicesPage() {
  return (
    <ServiceCategoryPage
      theme="hair"
      heroImages={heroImages}
      heroAlt="Hair styling and treatments at Huma Salon & Studio"
      kicker="Hair menu"
      title="Hair services"
      description="Precision cuts, colour, treatments, styling, and bridal hair — each card shows price and a short description. Book in one tap."
      quickLinks={[
        { href: "/services/facial", label: "Facial menu" },
        { href: "/services/body-spa", label: "Body & spa" },
        { href: "/services/nails", label: "Nails" },
        { href: "/services/makeup", label: "Makeup" },
      ]}
      sections={hairToMenu(hairServiceSections)}
      footerNote="Not sure which service fits? Book a consultation and we will map a plan for your hair goals."
    />
  );
}
