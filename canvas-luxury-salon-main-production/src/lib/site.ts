import { allBodySpaServiceNames } from "@/lib/body-spa-services-data";
import { allFacialServiceNames } from "@/lib/facial-services-data";
import { allHairServiceNames } from "@/lib/hair-services-data";
import { allMakeupServiceNames } from "@/lib/makeup-services-data";
import { allMehndiServiceNames } from "@/lib/mehndi-services-data";
import { allNailsServiceNames } from "@/lib/nails-services-data";

export const site = {
  name: "Huma Salon & Studio",
  tagline: "Luxury beauty experience",
  description:
    "Huma Salon & Studio — premium home beauty services in Jhelum, Dina, and Gujrat: hair, facial, body treatments, and expert makeup for every occasion.",
  email: "humaaqi96@gmail.com",
  phone: "+92 335 5462214",
  phoneDigits: "923355462214",
  address: "Home Service Areas: Jhelum, Dina, Gujrat",
  social: {
    instagram: "https://www.instagram.com/huma_beauty.saloon/",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export const serviceCategories = [
  {
    slug: "hair",
    title: "Hair",
    short: "Cuts, color, treatments, styling & bridal hair.",
    href: "/services/hair",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=85",
    price: "Starting at PKR 2,000",
  },
  {
    slug: "facial",
    title: "Facial",
    short: "Glow, brightening, advanced & bridal facials.",
    href: "/services/facial",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=900&q=85",
    price: "Starting at PKR 3,000",
  },
  {
    slug: "body-spa",
    title: "Body & spa",
    short: "Massage, hammam-style rituals & body treatments.",
    href: "/services/body-spa",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85",
    price: "Starting at PKR 4,000",
  },
  {
    slug: "nails",
    title: "Mani, pedi & nails",
    short: "Manicure, pedicure, art, extensions & polish.",
    href: "/services/nails",
    image:
      "https://i.pinimg.com/1200x/02/ea/e1/02eae1fc1f0e7c9f4bfa52ee8347a941.jpg",
    price: "Starting at PKR 1,200",
  },
  {
    slug: "mehndi",
    title: "Mehndi",
    short: "Bridal, Arabic, feet art & occasion designs.",
    href: "/services/mehndi",
    image:
      "https://i.pinimg.com/736x/ae/84/5f/ae845fba0f519d795710e90bf6a866ec.jpg",
    price: "Starting at PKR 1,500",
  },
  {
    slug: "makeup",
    title: "Makeup",
    short: "Bridal, party & camera-ready looks.",
    href: "/services/makeup",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
    price: "Starting at PKR 5,000",
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
