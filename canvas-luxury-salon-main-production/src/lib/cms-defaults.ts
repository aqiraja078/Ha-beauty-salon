import { bodySpaServiceSections } from "@/lib/body-spa-services-data";
import type {
  CmsMenuSection,
  HomeContent,
  ServiceMenus,
  SiteContent,
} from "@/lib/cms-types";
import { facialServiceSections } from "@/lib/facial-services-data";
import { hairServiceSections } from "@/lib/hair-services-data";
import {
  deriveLengthPrices,
  HAIR_LENGTH_SECTION_IDS,
} from "@/lib/hair-length-pricing";
import { homeMakeupCards } from "@/lib/makeup-home-cards";
import { makeupServiceSections } from "@/lib/makeup-services-data";
import { serviceCategories, site } from "@/lib/site";

function fromHintSections(
  sections: {
    id: string;
    emoji: string;
    title: string;
    services: { name: string; hint: string; price: string }[];
  }[]
): CmsMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    items: s.services.map((i) => ({
      name: i.name,
      blurb: i.hint,
      price: i.price,
      ...(HAIR_LENGTH_SECTION_IDS.has(s.id)
        ? { lengthPrices: deriveLengthPrices(i.price) }
        : {}),
    })),
  }));
}

function fromDescSections(
  sections: {
    id: string;
    emoji: string;
    title: string;
    services: {
      name: string;
      description: string;
      price: string;
      duration: string;
    }[];
  }[]
): CmsMenuSection[] {
  return sections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
    items: s.services.map((i) => ({
      name: i.name,
      blurb: i.description,
      price: i.price,
      duration: i.duration,
    })),
  }));
}

export const defaultSiteContent: SiteContent = {
  name: site.name,
  tagline: site.tagline,
  description: site.description,
  logo: site.logo,
  email: site.email,
  phone: site.phone,
  phoneDigits: site.phoneDigits,
  address: site.address,
  social: { ...site.social },
};

export const defaultHomeContent: HomeContent = {
  hero: {
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85",
    imageAlt: "Huma Beauty Salon artist preparing a client at home",
    headlineBefore: "Your look,",
    headlineAccent: "at home",
    subcopy:
      "Bridal makeup, hair, facials, and waxing — booked for Jhelum, Dina, and Gujrat, with prices you can see before you confirm.",
    primaryCta: { label: "Book your slot", href: "/book" },
    secondaryCta: { label: "WhatsApp", href: "https://wa.me/923355462214" },
    highlights: [
      { value: "10+", label: "Years with brides" },
      { value: "3", label: "Cities we visit" },
      { value: "48h", label: "Booking reply" },
    ],
  },
  makeupSection: {
    eyebrow: "Most booked",
    title: "Makeup for every shaadi function",
    lead: "Barat, walima, mehndi night, and party looks — priced from the menu, finished for long hours and photos.",
    cards: homeMakeupCards.map((c) => ({ ...c })),
  },
  servicesSection: {
    eyebrow: "Full menu",
    title: "Everything we bring to your door",
    lead: "Four clear menus — hair, skin, wax, and makeup — so you can plan the whole week of functions in one place.",
    categories: serviceCategories.map((c) => ({
      slug: c.slug as HomeContent["servicesSection"]["categories"][number]["slug"],
      title: c.title,
      short: c.short,
      href: c.href,
      image: c.image,
      price: c.price,
    })),
  },
  about: {
    image:
      "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=900&q=80",
    badgeValue: "Home",
    badgeLabel: "Service first",
    eyebrow: "About Huma",
    title: "Beauty that travels to you",
    body: "Huma Beauty Salon is a home-service studio for families across Jhelum, Dina, and Gujrat. We prepare brides and guests for nikkah, mehndi, barat, and walima — with sanitised kits, honest timing, and makeup that survives tears, heat, and the dance floor.",
    bullets: [
      "Artists experienced with Pakistani bridal wear",
      "Sealed, sanitised tools every visit",
      "Home service in Jhelum, Dina & Gujrat",
      "Menu prices before you book",
    ],
    ctaLabel: "Message us",
    ctaHref: "/contact",
  },
  why: {
    eyebrow: "Why Huma",
    title: "What clients notice",
    reasons: [
      {
        title: "Function-ready timing",
        desc: "We plan arrival around your photographer, dholki, and exit — not a vague salon queue.",
      },
      {
        title: "Products that last",
        desc: "Long-wear bases and setting chosen for humid halls, outdoor barats, and late walimas.",
      },
      {
        title: "Straight talk on price",
        desc: "What you see on the menu is the starting point — length or add-ons are confirmed before we start.",
      },
    ],
  },
  steps: {
    eyebrow: "How booking works",
    title: "Four steps, no guesswork",
    lead: "From WhatsApp to final touch-up — we keep the plan simple.",
    items: [
      {
        n: "01",
        title: "Send your date",
        desc: "Pick a service and preferred day on the booking form or WhatsApp.",
      },
      {
        n: "02",
        title: "Trial if needed",
        desc: "Bridal and first-time colour clients can lock a trial before the event.",
      },
      {
        n: "03",
        title: "We confirm in 48h",
        desc: "You get a clear slot, travel plan, and any length or package notes.",
      },
      {
        n: "04",
        title: "We come to you",
        desc: "Setup at home — you stay with family while we finish the look.",
      },
    ],
  },
  gallery: {
    eyebrow: "From recent visits",
    title: "Looks we finished at home",
    images: [
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80",
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80",
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
    ],
  },
  offers: {
    eyebrow: "Sales",
    title: "Deals worth booking now",
    lead: "Clear packages with what’s included and the price — book for Jhelum, Dina, or Gujrat home visits.",
    items: [
      {
        id: "bridal-week",
        badge: "This season",
        title: "Bridal",
        titleAccent: "week",
        body: "Barat + walima makeup in one booking — we lock your trial first so both looks stay consistent.",
        includes: [
          "Bridal makeup for Barat (home visit)",
          "Bridal makeup for Walima",
          "One bridal trial session",
          "Priority date confirmation within 48h",
        ],
        price: "From Rs. 30,000",
        ctaLabel: "Book this package",
        ctaHref: "/book?service=Bridal%20Makeup%20Barat",
      },
      {
        id: "colour-length",
        badge: "Hair",
        title: "Colour +",
        titleAccent: "treatment",
        body: "Full colour with deep care in the same home visit — softer hair, even tone, less travel for you.",
        includes: [
          "Full hair colour (medium length base)",
          "Hair spa or protein treatment",
          "Blow-dry finish",
          "Aftercare tips for the next wash",
        ],
        price: "From Rs. 7,500",
        ctaLabel: "Book this package",
        ctaHref: "/book?service=Full%20Hair%20Color",
      },
      {
        id: "wax-glow",
        badge: "Prep",
        title: "Wax +",
        titleAccent: "glow",
        body: "Event-week body prep — smooth wax plus a cleanup facial timed before mehndi or barat photos.",
        includes: [
          "Full arms + full legs wax",
          "Underarm wax",
          "Cleanup facial",
          "Aftercare lotion guidance",
        ],
        price: "From Rs. 6,500",
        ctaLabel: "Book this package",
        ctaHref: "/book?service=Full%20Legs%20Wax",
      },
      {
        id: "guest-party",
        badge: "Party",
        title: "Guest",
        titleAccent: "glam",
        body: "Two party makeup looks at the same address on the same day — faster for your guests, one travel fee.",
        includes: [
          "Party makeup for 2 guests",
          "Same-day home visit",
          "Shared kit & tidy cleanup",
          "Extra guests at menu rate",
        ],
        price: "From Rs. 12,000",
        ctaLabel: "Book this package",
        ctaHref: "/book?service=Party%20Makeup",
      },
    ],
  },
  testimonials: {
    eyebrow: "Client notes",
    title: "From homes we visited",
    items: [
      {
        quote:
          "Barat makeup stayed through the heat and the photographs. They arrived on time and packed up without rushing us.",
        name: "Sana R.",
        role: "Bridal · Jhelum",
      },
      {
        quote:
          "Keratin and colour at home saved a full travel day. Hair felt soft, not crispy — exactly what I asked for.",
        name: "Maham T.",
        role: "Hair · Dina",
      },
      {
        quote:
          "Facial before my sister’s walima — skin looked calm on camera, not shiny. Clear price, no upsell pressure.",
        name: "Iqra N.",
        role: "Facial · Gujrat",
      },
      {
        quote:
          "Mehndi party makeup matched my outfit and survived the dholki. Already booked them for Eid.",
        name: "Fatima Z.",
        role: "Party makeup · Jhelum",
      },
    ],
  },
  cta: {
    trustPoints: [
      "Home visits",
      "Hygiene kit",
      "Menu pricing",
      "On-time arrival",
    ],
    proof: [
      {
        name: "Areeba K.",
        event: "Barat",
        line: "Makeup held past midnight without heavy touch-ups.",
      },
      {
        name: "Hina M.",
        event: "Party",
        line: "Artist finished before guests arrived — calm and tidy.",
      },
    ],
    title: "Ready to lock your date?",
    subcopy:
      "Share your function day — we reply within 48 hours with confirmation.",
    primaryCta: { label: "Book appointment", href: "/book" },
    secondaryCta: { label: "WhatsApp / contact", href: "/contact" },
  },
};

export const defaultServiceMenus: ServiceMenus = {
  hair: {
    heroImages: [
      "https://i.pinimg.com/736x/2c/a0/25/2ca0258ddeef532121c97c579a897541.jpg?w=800&q=70",
      "https://i.pinimg.com/736x/36/34/65/363465309f06503bea07436a701ea8d8.jpg?w=800&q=70",
    ],
    heroAlt: "Hair colour and styling by Huma Beauty Salon at home",
    kicker: "Hair at home",
    title: "Hair services",
    description:
      "Cuts, colour, keratin, and bridal styling brought to your house in Jhelum, Dina, or Gujrat — length-based prices on colour and treatments.",
    footerNote:
      "First time colour or bridal hair? Book a short consult so we match tone, length, and timing to your function day.",
    sections: fromHintSections(hairServiceSections),
  },
  makeup: {
    heroImages: [
      "https://i.pinimg.com/736x/86/87/9c/86879c401e8248877e6a6f3065c08118.jpg?w=800&q=70",
      "https://i.pinimg.com/736x/be/f3/d9/bef3d934e5cfaeeec54f5a1c7ee6dcb2.jpg?w=800&q=70",
    ],
    heroAlt: "Bridal and party makeup by Huma Beauty Salon",
    kicker: "Makeup at home",
    title: "Makeup services",
    description:
      "Barat, walima, mehndi, and party makeup finished for long hours, photos, and humid halls — artists come to you.",
    footerNote:
      "Share dupatta colour and jewellery photos when you book — we plan the look around your outfit, not a generic template.",
    sections: fromHintSections(makeupServiceSections),
  },
  facial: {
    heroImages: [
      "https://i.pinimg.com/736x/90/c2/ca/90c2ca7d26c07a57933640fac0b9173b.jpg?w=800&q=70",
      "https://i.pinimg.com/736x/f3/ac/5c/f3ac5c2b0083d236ccaa18957bd41791.jpg?w=800&q=70",
    ],
    heroAlt: "Facial and skin care with Huma Beauty Salon",
    kicker: "Facial at home",
    title: "Facial services",
    description:
      "Cleanup to bridal glow facials timed around your event week — calm skin for camera, not a heavy mask look.",
    footerNote:
      "Sensitive or acne-prone skin? Tell us in the booking notes and we will choose a gentler protocol.",
    sections: fromDescSections(facialServiceSections),
  },
  "body-spa": {
    heroImages: [
      "https://i.pinimg.com/736x/81/6d/df/816ddf871f37612426c401d39c55d22f.jpg?w=800&q=70",
      "https://i.pinimg.com/1200x/95/55/e0/9555e062724cc2ca83f0cb3e6b38c586.jpg?w=800&q=70",
    ],
    heroAlt: "Waxing and body care by Huma Beauty Salon",
    kicker: "Wax & body at home",
    title: "Wax & Body",
    description:
      "Face, arms, legs, and bridal wax packages plus polish and tan care — scheduled before your mehndi or barat.",
    footerNote:
      "Full bridal wax plan? Message both event dates so we leave enough days for skin to settle.",
    sections: fromDescSections(bodySpaServiceSections),
  },
};
