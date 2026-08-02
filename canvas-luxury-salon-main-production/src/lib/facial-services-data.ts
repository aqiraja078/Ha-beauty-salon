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
    title: "Basic facials at home",
    services: [
      {
        name: "Clean Up Facial",
        description: "Steam and gentle extract — clears pores before Eid or a guest night.",
        price: "Rs. 2,200",
        duration: "35 min",
      },
      {
        name: "Basic Facial",
        description: "Cleanse, scrub, mask, and moisture for everyday Pakistani skin.",
        price: "Rs. 3,000",
        duration: "45 min",
      },
      {
        name: "Express Facial",
        description: "Quick home refresh when you have a last-minute function.",
        price: "Rs. 2,500",
        duration: "30 min",
      },
      {
        name: "Mini Facial",
        description: "Short cleanse and hydration before light makeup or visits.",
        price: "Rs. 2,800",
        duration: "35 min",
      },
    ],
  },
  {
    id: "whitening-brightening",
    emoji: "✨",
    title: "Brightening facials",
    services: [
      {
        name: "Whitening Facial",
        description: "Helps even dull tone before bridal trials or walima week.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Brightening Facial",
        description: "Lifts tired, dusty skin after summer heat in Jhelum & Gujrat.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
      {
        name: "Glow Facial",
        description: "Fresh face for mehndi night without heavy product buildup.",
        price: "Rs. 4,500",
        duration: "55 min",
      },
      {
        name: "Gold Facial",
        description: "Gold-infused facial popular for bridal prep and stage looks.",
        price: "Rs. 5,500",
        duration: "60 min",
      },
      {
        name: "Pearl Facial",
        description: "Pearl-based care for softer texture under bridal foundation.",
        price: "Rs. 5,200",
        duration: "60 min",
      },
      {
        name: "Diamond Facial",
        description: "Deep polish for barat week when makeup needs a smooth base.",
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
        description: "Deep cleanse and hydrate — calming before heavy bridal makeup.",
        price: "Rs. 4,500",
        duration: "60 min",
      },
      {
        name: "Oxygen Facial",
        description: "Oxygen boost for tired skin after travel or late wedding nights.",
        price: "Rs. 5,000",
        duration: "55 min",
      },
      {
        name: "Anti-Aging Facial",
        description: "Firming massage and care for fine lines before family photos.",
        price: "Rs. 5,800",
        duration: "70 min",
      },
      {
        name: "Collagen Facial",
        description: "Supports bounce so skin feels plump under HD bridal makeup.",
        price: "Rs. 5,500",
        duration: "65 min",
      },
      {
        name: "Vitamin C Facial",
        description: "Brightens sun-stressed skin after outdoor baraat or summer days.",
        price: "Rs. 4,800",
        duration: "55 min",
      },
      {
        name: "Skin Polish Facial",
        description: "Smooths texture so foundation sits evenly for walima.",
        price: "Rs. 4,200",
        duration: "50 min",
      },
    ],
  },
  {
    id: "skin-problem",
    emoji: "🌸",
    title: "Problem-skin facials",
    services: [
      {
        name: "Acne Treatment Facial",
        description: "Calms breakouts gently — plan a few sessions before wedding week.",
        price: "Rs. 4,500",
        duration: "60 min",
      },
      {
        name: "Anti-Pimple Facial",
        description: "Targets oil and congestion without stripping for humid weather.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Dark Spots Removal Facial",
        description: "Works on uneven patches; a short series gives clearer results.",
        price: "Rs. 5,000",
        duration: "60 min",
      },
      {
        name: "Pigmentation Facial",
        description: "Focused care for sun marks and melasma-prone areas.",
        price: "Rs. 5,200",
        duration: "65 min",
      },
      {
        name: "Sensitive Skin Facial",
        description: "Mild, soothing steps for reactive skin before makeup days.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
    ],
  },
  {
    id: "herbal-organic",
    emoji: "🧴",
    title: "Herbal & organic facials",
    services: [
      {
        name: "Herbal Facial",
        description: "Plant-based calm for skin that reacts to heavy salon chemicals.",
        price: "Rs. 3,800",
        duration: "50 min",
      },
      {
        name: "Organic Facial",
        description: "Organic oils and masks — gentle enough for weekly home care.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Fruit Facial",
        description: "Fruit enzymes for light peel and freshness before Eid.",
        price: "Rs. 3,600",
        duration: "45 min",
      },
      {
        name: "Aloe Vera Facial",
        description: "Cooling aloe for heat rash and summer redness.",
        price: "Rs. 3,500",
        duration: "45 min",
      },
      {
        name: "Chocolate Facial",
        description: "Cocoa mask treat — soft skin for mehndi or girls’ night.",
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
        description: "Multi-step prep so skin looks clear under barat makeup.",
        price: "Rs. 7,500",
        duration: "75 min",
      },
      {
        name: "Pre-Bridal Facial Packages",
        description: "Home-service series timed to your nikkah–barat–walima calendar.",
        price: "From Rs. 18,000",
        duration: "Series",
      },
      {
        name: "Luxury Facial",
        description: "Longer massage and richer masks for the week of the wedding.",
        price: "Rs. 8,500",
        duration: "80 min",
      },
      {
        name: "Instant Glow Facial",
        description: "Same-day lift before engagement photos or mehndi.",
        price: "Rs. 5,500",
        duration: "55 min",
      },
    ],
  },
  {
    id: "premium-special",
    emoji: "🧪",
    title: "Salon-special facials",
    services: [
      {
        name: "Dermaplaning Facial",
        description: "Removes peach fuzz so bridal makeup blends without catching.",
        price: "Rs. 6,000",
        duration: "50 min",
      },
      {
        name: "Chemical Peel Facial",
        description: "Strength matched to your skin — consult before wedding week.",
        price: "From Rs. 5,500",
        duration: "45–60 min",
      },
      {
        name: "Microdermabrasion Facial",
        description: "Polishes texture for clearer close-ups on barat day.",
        price: "Rs. 6,500",
        duration: "55 min",
      },
      {
        name: "LED Light Therapy Facial",
        description: "Light therapy to calm redness or support clearer skin.",
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
