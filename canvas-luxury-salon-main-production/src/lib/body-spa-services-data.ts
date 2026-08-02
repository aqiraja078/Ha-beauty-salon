export type BodySpaServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type BodySpaServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: BodySpaServiceItem[];
};

/** Wax & Body menu — waxing first, with supporting body care. */
export const bodySpaServiceSections: BodySpaServiceSection[] = [
  {
    id: "face-wax",
    emoji: "✨",
    title: "Face & brows wax",
    services: [
      {
        name: "Eyebrow Wax",
        description: "Shapes arches so brows frame eyes under bridal and Eid makeup.",
        price: "Rs. 500",
        duration: "15 min",
      },
      {
        name: "Upper Lip Wax",
        description: "Quick, careful wax — clean upper lip for close wedding photos.",
        price: "Rs. 400",
        duration: "10 min",
      },
      {
        name: "Chin Wax",
        description: "Neat chin finish, often booked with full-face bridal prep.",
        price: "Rs. 450",
        duration: "10 min",
      },
      {
        name: "Side Burns / Jawline Wax",
        description: "Tidies jawline hair so makeup sits clean for walima.",
        price: "Rs. 600",
        duration: "15 min",
      },
      {
        name: "Full Face Wax",
        description: "Brows, lip, chin, and sides — one home visit before functions.",
        price: "Rs. 1,800",
        duration: "35 min",
      },
      {
        name: "Forehead Wax",
        description: "Clears fine forehead hair for a smooth bridal base.",
        price: "Rs. 500",
        duration: "10 min",
      },
    ],
  },
  {
    id: "arms-underarms",
    emoji: "💪",
    title: "Arms & underarms",
    services: [
      {
        name: "Underarm Wax",
        description: "Smooth underarms for sleeveless mehndi and barat outfits.",
        price: "Rs. 800",
        duration: "15 min",
      },
      {
        name: "Half Arms Wax",
        description: "Wrist to elbow — neat for bangles and three-quarter sleeves.",
        price: "Rs. 1,200",
        duration: "25 min",
      },
      {
        name: "Full Arms Wax",
        description: "Wrist to shoulder for open sleeves and bridal jewellery shots.",
        price: "Rs. 1,800",
        duration: "35 min",
      },
      {
        name: "Hands & Fingers Wax",
        description: "Clean hands and fingers before mehndi or ring photos.",
        price: "Rs. 700",
        duration: "15 min",
      },
    ],
  },
  {
    id: "legs-wax",
    emoji: "🦵",
    title: "Legs wax",
    services: [
      {
        name: "Half Legs Wax",
        description: "Ankle to knee — ready for ghararas, shararas, and guest wear.",
        price: "Rs. 1,500",
        duration: "30 min",
      },
      {
        name: "Full Legs Wax",
        description: "Ankle to thigh for bridal week and open lehenga looks.",
        price: "Rs. 2,800",
        duration: "50 min",
      },
      {
        name: "Feet & Toes Wax",
        description: "Neat feet and toes before bridal pedicure or anklets.",
        price: "Rs. 800",
        duration: "15 min",
      },
    ],
  },
  {
    id: "body-wax",
    emoji: "🌿",
    title: "Body wax",
    services: [
      {
        name: "Stomach Wax",
        description: "Smooth midriff for crop tops, blouses, and bridal fittings.",
        price: "Rs. 1,200",
        duration: "20 min",
      },
      {
        name: "Back Wax",
        description: "Full or partial back — comfortable under deep-back lehengas.",
        price: "Rs. 2,500",
        duration: "40 min",
      },
      {
        name: "Bikini Line Wax",
        description: "Neat bikini line with careful technique at home.",
        price: "Rs. 1,500",
        duration: "25 min",
      },
      {
        name: "Full Bikini Wax",
        description: "Complete bikini wax — preference discussed privately at booking.",
        price: "Rs. 2,500",
        duration: "35 min",
      },
      {
        name: "Full Body Wax (Women)",
        description: "Arms, legs, underarms, and body in one bridal-prep booking.",
        price: "From Rs. 8,000",
        duration: "120+ min",
      },
    ],
  },
  {
    id: "wax-packages",
    emoji: "💎",
    title: "Wax packages",
    services: [
      {
        name: "Arms + Underarms Package",
        description: "Full arms with underarms — favourite for mehndi week.",
        price: "Rs. 2,400",
        duration: "45 min",
      },
      {
        name: "Full Legs + Underarms Package",
        description: "Smooth legs and underarms in one home visit.",
        price: "Rs. 3,400",
        duration: "60 min",
      },
      {
        name: "Face + Arms Package",
        description: "Full face plus arms — solid prep before guest makeup.",
        price: "Rs. 3,200",
        duration: "60 min",
      },
      {
        name: "Bridal Wax Package",
        description: "Custom areas timed to your barat week — plan on consult.",
        price: "From Rs. 10,000",
        duration: "Custom",
      },
    ],
  },
  {
    id: "body-care",
    emoji: "🧴",
    title: "Body care (with wax)",
    services: [
      {
        name: "Body Polishing",
        description: "Exfoliate and moisturise before wax or bridal fittings.",
        price: "Rs. 5,500",
        duration: "55 min",
      },
      {
        name: "Body Scrub",
        description: "Scrubs dry elbows and heels after Punjab summer dust.",
        price: "Rs. 4,200",
        duration: "45 min",
      },
      {
        name: "Tan Removal Treatment",
        description: "Fades uneven tan on arms, neck, and legs from outdoor events.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
      {
        name: "Body Bleach",
        description: "Gentle brightening for arms or legs before sleeveless outfits.",
        price: "Rs. 3,500",
        duration: "40 min",
      },
    ],
  },
];

export function allBodySpaServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of bodySpaServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
