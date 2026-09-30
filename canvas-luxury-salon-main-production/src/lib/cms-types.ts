export type ServiceCategorySlug =
  | "hair"
  | "makeup"
  | "facial"
  | "body-spa";

export const SERVICE_CATEGORY_SLUGS: ServiceCategorySlug[] = [
  "hair",
  "makeup",
  "facial",
  "body-spa",
];

export type CmsMenuItem = {
  name: string;
  blurb: string;
  price: string;
  duration?: string;
  /** Optional card photo URL. Blank = automatic themed photo. */
  image?: string;
  /** Optional offer: "percent" (e.g. 20 → 20% off) or "amount" (Rs. off). Blank = no discount. */
  discountType?: "percent" | "amount";
  discountValue?: number;
  lengthPrices?: {
    short: string;
    medium: string;
    long: string;
  };
};

export type CmsMenuSection = {
  id: string;
  emoji: string;
  title: string;
  items: CmsMenuItem[];
};

export type CmsServiceCategory = {
  heroImages: string[];
  heroAlt: string;
  /** Small label above the hero headline. */
  kicker: string;
  /** Page title (SEO / browser tab). */
  title: string;
  /** Hero headline, line 1 (gold). Blank = default. */
  headline?: string;
  /** Hero headline, line 2 (italic cream). Blank = default. */
  headlineAccent?: string;
  /** Script tagline over the hero photo. Blank = default. */
  script?: string;
  description: string;
  footerNote: string;
  sections: CmsMenuSection[];
};

export type ServiceMenus = Record<ServiceCategorySlug, CmsServiceCategory>;

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  email: string;
  phone: string;
  phoneDigits: string;
  address: string;
  social: {
    instagram: string;
    tiktok: string;
    linkedin: string;
  };
};

export type HomeHighlight = { value: string; label: string };

export type HomeMakeupCard = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export type HomeServiceCategory = {
  slug: ServiceCategorySlug;
  title: string;
  short: string;
  href: string;
  image: string;
  price: string;
};

export type HomeContent = {
  hero: {
    image: string;
    imageAlt: string;
    headlineBefore: string;
    headlineAccent: string;
    subcopy: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    highlights: HomeHighlight[];
  };
  makeupSection: {
    eyebrow: string;
    title: string;
    lead: string;
    cards: HomeMakeupCard[];
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    lead: string;
    categories: HomeServiceCategory[];
  };
  about: {
    image: string;
    badgeValue: string;
    badgeLabel: string;
    eyebrow: string;
    title: string;
    body: string;
    bullets: string[];
    ctaLabel: string;
    ctaHref: string;
  };
  why: {
    eyebrow: string;
    title: string;
    reasons: { title: string; desc: string }[];
  };
  steps: {
    eyebrow: string;
    title: string;
    lead: string;
    items: { n: string; title: string; desc: string }[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    images: string[];
  };
  offers: {
    eyebrow: string;
    title: string;
    lead: string;
    items: {
      id: string;
      badge: string;
      title: string;
      titleAccent: string;
      body: string;
      includes: string[];
      price: string;
      ctaLabel: string;
      ctaHref: string;
    }[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: { quote: string; name: string; role: string }[];
  };
  galleryPage: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  blog: {
    /** Small label above the blog hero title. */
    eyebrow: string;
    description: string;
    /** Hero photo shown on the right of the blog hero. */
    image: string;
    collectionEyebrow: string;
    collectionTitle: string;
    collectionLead: string;
  };
  cta: {
    trustPoints: string[];
    proof: { name: string; event: string; line: string }[];
    title: string;
    subcopy: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
};
