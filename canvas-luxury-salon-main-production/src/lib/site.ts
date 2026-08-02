import { allBodySpaServiceNames } from "@/lib/body-spa-services-data";
import { allFacialServiceNames } from "@/lib/facial-services-data";
import { allHairServiceNames } from "@/lib/hair-services-data";
import { allMakeupServiceNames } from "@/lib/makeup-services-data";
import { allMehndiServiceNames } from "@/lib/mehndi-services-data";
import { allNailsServiceNames } from "@/lib/nails-services-data";

export const site = {
  name: "HA Beauty Salon",
  tagline: "Home beauty, done right — Jhelum · Dina · Gujrat",
  description:
    "Where beauty meets elegance. We offer personalized makeup, hair styling, skincare, bridal services, body spa, and waxing using premium products and professional techniques for a flawless experience every time.",
  logo: "/logo.svg",
  email: "humabeautysalon07@gmail.com",
  phone: "+92 335 5462214",
  phoneDigits: "923355462214",
  address: "Home Service Areas: Jhelum, Dina, Gujrat",
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
    price: "From PKR 2,200",
  },
  {
    slug: "body-spa",
    title: "Wax & Body",
    short: "Face-to-toe waxing, polish & bridal body prep.",
    href: "/services/body-spa",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85",
    price: "From PKR 400",
  },
  {
    slug: "nails",
    title: "Mani, pedi & nails",
    short: "Gel, art, extensions & bridal hand sets.",
    href: "/services/nails",
    image:
      "https://i.pinimg.com/1200x/02/ea/e1/02eae1fc1f0e7c9f4bfa52ee8347a941.jpg",
    price: "From PKR 1,200",
  },
  {
    slug: "mehndi",
    title: "Mehndi",
    short: "Bridal, Arabic & Eid designs for hands and feet.",
    href: "/services/mehndi",
    image:
      "https://i.pinimg.com/736x/ae/84/5f/ae845fba0f519d795710e90bf6a866ec.jpg",
    price: "From PKR 1,500",
  },
  {
    slug: "makeup",
    title: "Makeup",
    short: "Barat, walima, mehndi & party looks that last.",
    href: "/services/makeup",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
    price: "From PKR 3,000",
  },
] as const;

const bookingServicesBase = [
  "Bridal Makeup",
  "Party / Event Makeup",
  "Hair Color & Styling",
  "Facial Treatment",
  "Body Waxing",
  "Manicure & Pedicure",
  "Laser Hair Removal",
  "Consultation / Trial",
] as const;

/** Salon-wide bookable labels including all service menus. */
export const bookingServices: string[] = Array.from(
  new Set<string>([
    ...allHairServiceNames(),
    ...allFacialServiceNames(),
    ...allBodySpaServiceNames(),
    ...allNailsServiceNames(),
    ...allMehndiServiceNames(),
    ...allMakeupServiceNames(),
    ...bookingServicesBase,
  ])
).sort((a, b) => a.localeCompare(b));
