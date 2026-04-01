import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { mehndiToMenu } from "@/components/services/service-menu-mappers";
import { mehndiServiceSections } from "@/lib/mehndi-services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mehndi",
  description: `Bridal, Arabic, Pakistani, and occasion mehndi by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const heroImages = [
  "https://i.pinimg.com/1200x/c1/d3/b9/c1d3b9e7d681b52e8d3f4e8ae49141ce.jpg?w=800&q=70",
  "https://i.pinimg.com/736x/ab/fb/dc/abfbdcf1e7ed662642efcf641228e77f.jpg?w=800&q=70",
];

export default function MehndiServicesPage() {
  return (
    <ServiceCategoryPage
      theme="mehndi"
      heroImages={heroImages}
      heroAlt="Mehndi and henna art at Huma Salon & Studio"
      kicker="Mehndi menu"
      title="Mehndi"
      description="Hands, feet, bridal art, and occasion sets — pricing and timing on each card. Ideal for Eid, weddings, and custom bridal designs."
      quickLinks={[
        { href: "/services/nails", label: "Mani & pedi" },
        { href: "/services/hair", label: "Hair" },
        { href: "/services/facial", label: "Facial" },
        { href: "/services/makeup", label: "Makeup" },
      ]}
      sections={mehndiToMenu(mehndiServiceSections)}
      footerNote="Complex bridal feet + hands or group bookings? Start with a consultation so we can quote time and reserve artists."
    />
  );
}
