import type { Metadata } from "next";
import { ServiceCategoryPage } from "@/components/services/ServiceCategoryPage";
import { nailsToMenu } from "@/components/services/service-menu-mappers";
import { nailsServiceSections } from "@/lib/nails-services-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Manicure, pedicure & nails",
  description: `Mani, pedi, nail art, extensions, and bridal packages by ${site.name} in Jhelum, Dina, and Gujrat.`,
};

const heroImages = [
  "https://i.pinimg.com/736x/ef/ba/be/efbabefb56f94241eb3304cc52de4898.jpg?w=800&q=70",
  "https://i.pinimg.com/1200x/02/ea/e1/02eae1fc1f0e7c9f4bfa52ee8347a941.jpg?w=800&q=70",
];

export default function NailsServicesPage() {
  return (
    <ServiceCategoryPage
      theme="nails"
      heroImages={heroImages}
      heroAlt="Nail art and manicure at Huma Salon & Studio"
      kicker="Mani · pedi · nails"
      title="Manicure, pedicure & nails"
      description="Hands and feet care, nail art, extensions, and bridal sets — compact cards sized for quick scrolling on mobile."
      quickLinks={[
        { href: "/services/hair", label: "Hair" },
        { href: "/services/facial", label: "Facial" },
        { href: "/services/body-spa", label: "Body & spa" },
        { href: "/services/mehndi", label: "Mehndi" },
      ]}
      sections={nailsToMenu(nailsServiceSections)}
      footerNote="Bridal party bookings or gel removal questions? Book a consultation and we will schedule the right tech and time."
    />
  );
}
