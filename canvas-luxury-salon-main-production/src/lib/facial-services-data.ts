export type FacialServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type FacialServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: FacialServiceItem[];
};

export const facialServiceSections: FacialServiceSection[] = [
  {
    id: "basic-facial",
    emoji: "🌿",
    title: "Basic facial services",
    services: [
      {
        name: "Clean Up Facial",
        description: "Quick cleanse, steam, and gentle extraction for clearer pores.",
        price: "Rs. 2,200",
        duration: "35 min",
      },
      {
        name: "Basic Facial",
        description: "Classic cleanse, exfoliation, mask, and moisture for everyday glow.",
        price: "Rs. 3,000",
        duration: "45 min",
      },
      {
        name: "Express Facial",
        description: "Fast refresh when you are short on time — bright, fresh skin.",
        price: "Rs. 2,500",
        duration: "30 min",
      },
      {
        name: "Mini Facial",
        description: "Targeted mini ritual focused on cleanse + hydration boost.",
        price: "Rs. 2,800",
        duration: "35 min",
      },
    ],
  },
  {
    id: "whitening-brightening",
    emoji: "✨",
    title: "Whitening / brightening facials",
    services: [
      {
        name: "Whitening Facial",
        description: "Even tone and visible brightness with gentle active care.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Brightening Facial",
        description: "Radiance boost for dull, tired-looking skin.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
      {
        name: "Glow Facial",
        description: "Lit-from-within finish — perfect before events.",
        price: "Rs. 4,500",
        duration: "55 min",
      },
      {
        name: "Gold Facial",
        description: "Luxury gold-infused treatment for firmness and luminosity.",
        price: "Rs. 5,500",
        duration: "60 min",
      },
      {
        name: "Pearl Facial",
        description: "Pearl extracts for soft, refined texture and glow.",
        price: "Rs. 5,200",
        duration: "60 min",
      },
      {
        name: "Diamond Facial",
        description: "Premium ritual for polished, high-shine skin.",
        price: "Rs. 6,500",
        duration: "65 min",
      },
    ],
  },
  {
    id: "advanced-facial",
    emoji: "💎",
    title: "Advanced facials",
    services: [
      {
        name: "Hydra Facial",
        description: "Deep hydration + glowing skin with cleanse, extract, and infuse.",
        price: "Rs. 4,500",
        duration: "60 min",
      },
      {
        name: "Oxygen Facial",
        description: "Oxygen-rich infusion for plump, refreshed skin.",
        price: "Rs. 5,000",
        duration: "55 min",
      },
      {
        name: "Anti-Aging Facial",
        description: "Firming massage and actives to soften fine lines.",
        price: "Rs. 5,800",
        duration: "70 min",
      },
      {
        name: "Collagen Facial",
        description: "Support elasticity and bounce with collagen-focused care.",
        price: "Rs. 5,500",
        duration: "65 min",
      },
      {
        name: "Vitamin C Facial",
        description: "Antioxidant-rich brightening for sun-stressed skin.",
        price: "Rs. 4,800",
        duration: "55 min",
      },
      {
        name: "Skin Polish Facial",
        description: "Smoothing polish for silky texture and even reflection.",
        price: "Rs. 4,200",
        duration: "50 min",
      },
    ],
  },
  {
    id: "skin-problem",
    emoji: "🌸",
    title: "Skin problem facials",
    services: [
      {
        name: "Acne Treatment Facial",
        description: "Clarifying steps to calm breakout-prone skin.",
        price: "Rs. 4,500",
        duration: "60 min",
      },
      {
        name: "Anti-Pimple Facial",
        description: "Targets congestion and excess oil with gentle control.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Dark Spots Removal Facial",
        description: "Gradual clarity for uneven patches — series recommended.",
        price: "Rs. 5,000",
        duration: "60 min",
      },
      {
        name: "Pigmentation Facial",
        description: "Focused care for uneven tone and sun marks.",
        price: "Rs. 5,200",
        duration: "65 min",
      },
      {
        name: "Sensitive Skin Facial",
        description: "Soothing, fragrance-aware ritual for reactive skin.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
    ],
  },
  {
    id: "herbal-organic",
    emoji: "🧴",
    title: "Herbal / organic facials",
    services: [
      {
        name: "Herbal Facial",
        description: "Plant-based extracts for calm, balanced skin.",
        price: "Rs. 3,800",
        duration: "50 min",
      },
      {
        name: "Organic Facial",
        description: "Certified-organic oils and masks, minimal additives.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Fruit Facial",
        description: "Enzyme-rich fruit actives for natural exfoliation and glow.",
        price: "Rs. 3,600",
        duration: "45 min",
      },
      {
        name: "Aloe Vera Facial",
        description: "Cooling aloe for hydration and redness comfort.",
        price: "Rs. 3,500",
        duration: "45 min",
      },
      {
        name: "Chocolate Facial",
        description: "Antioxidant cocoa treat — indulgent and skin-softening.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
    ],
  },
  {
    id: "bridal-facial",
    emoji: "👰",
    title: "Bridal facials",
    services: [
      {
        name: "Bridal Glow Facial",
        description: "Multi-step glow path designed before your big day.",
        price: "Rs. 7,500",
        duration: "75 min",
      },
      {
        name: "Pre-Bridal Facial Packages",
        description: "Custom series plan — consult for timeline and pricing.",
        price: "From Rs. 18,000",
        duration: "Series",
      },
      {
        name: "Luxury Facial",
        description: "Top-tier masks and massage for red-carpet skin.",
        price: "Rs. 8,500",
        duration: "80 min",
      },
      {
        name: "Instant Glow Facial",
        description: "Same-day luminosity boost before events or photos.",
        price: "Rs. 5,500",
        duration: "55 min",
      },
    ],
  },
  {
    id: "premium-special",
    emoji: "🧪",
    title: "Premium / salon special facials",
    services: [
      {
        name: "Dermaplaning Facial",
        description: "Manual exfoliation for ultra-smooth makeup application.",
        price: "Rs. 6,000",
        duration: "50 min",
      },
      {
        name: "Chemical Peel Facial",
        description: "Controlled peel strength — consult required for skin type.",
        price: "From Rs. 5,500",
        duration: "45–60 min",
      },
      {
        name: "Microdermabrasion Facial",
        description: "Mechanical exfoliation for texture and clarity.",
        price: "Rs. 6,500",
        duration: "55 min",
      },
      {
        name: "LED Light Therapy Facial",
        description: "Light wavelengths to support calm or clarity — add-on or full ritual.",
        price: "Rs. 5,000",
        duration: "40 min",
      },
    ],
  },
];

export function allFacialServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of facialServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
