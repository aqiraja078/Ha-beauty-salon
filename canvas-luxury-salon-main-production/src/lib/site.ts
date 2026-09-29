import { allBodySpaServiceNames } from "@/lib/body-spa-services-data";
import { allFacialServiceNames } from "@/lib/facial-services-data";
import { allHairServiceNames } from "@/lib/hair-services-data";
import { allMakeupServiceNames } from "@/lib/makeup-services-data";

export const site = {
  name: "Adaa Beauty Salon & Training Center",
  tagline: "Beauty salon & training center — Jhelum · Dina · Gujrat",
  description:
    "Adaa Beauty Salon & Training Center — luxury makeup, hair, skincare, bridal services, and professional beauty training with premium products and expert techniques.",
  logo: "/logo-adaa.png",
  email: "humabeautysalon07@gmail.com",
  phone: "+92 335 5462214",
  phoneDigits: "923355462214",
  address: "Old G T Rd, Machine Mohalla No.2 Machine Mohalla 3, Jhelum, 49600",
  social: {
    instagram: "https://www.instagram.com/huma_beauty.saloon/",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export function whatsappBookUrl(
  service?: string,
  identity?: { name: string; phoneDigits: string }
) {
  const name = identity?.name ?? site.name;
  const digits = identity?.phoneDigits ?? site.phoneDigits;
  const text = service
    ? `Assalam o Alaikum ${name}, I would like to book: ${service}.`
    : `Assalam o Alaikum ${name}, I would like to book an appointment.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const serviceCategories = [
  {
    slug: "hair",
    title: "Hair",
    short: "Cuts, colour, keratin & bridal styling at home.",
    href: "/services/hair",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=85",
    price: "From PKR 800",
  },
  {
    slug: "facial",
    title: "Facial",
    short: "Cleanup to bridal glow — skin that photographs well.",
    href: "/services/facial",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=900&q=85",
    price: "From PKR 1,800",
  },
  {
    slug: "body-spa",
    title: "Wax & Body",
    short: "Face-to-toe waxing, polish & bridal body prep.",
    href: "/services/body-spa",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85",
    price: "From PKR 200",
  },
  {
    slug: "makeup",
    title: "Makeup",
    short: "Barat, walima, mehndi & party looks that last.",
    href: "/services/makeup",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
    price: "From PKR 3,500",
  },
] as const;

const bookingServicesBase = [
  "Bridal Makeup",
  "Party / Event Makeup",
  "Hair Color & Styling",
  "Facial Treatment",
  "Body Waxing",
  "Laser Hair Removal",
  "Consultation / Trial",
] as const;

/** Salon-wide bookable labels including all service menus. */
export const bookingServices: string[] = Array.from(
  new Set<string>([
    ...allHairServiceNames(),
    ...allFacialServiceNames(),
    ...allBodySpaServiceNames(),
    ...allMakeupServiceNames(),
    ...bookingServicesBase,
  ])
).sort((a, b) => a.localeCompare(b));
