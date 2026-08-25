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
    title: "Face Waxing",
    services: [
      {
        name: "Eyebrow Shaping",
        description: "Clean arch shaping with precise, gentle face wax.",
        price: "Rs. 200",
        duration: "",
      },
      {
        name: "Upper Lip",
        description: "Quick upper lip wax for a smooth, hair-free finish.",
        price: "Rs. 300",
        duration: "",
      },
      {
        name: "Chin Wax",
        description: "Targeted chin wax with hygienic prep and aftercare.",
        price: "Rs. 500",
        duration: "",
      },
      {
        name: "Full Face Wax",
        description: "Complete face wax — brows, lip, chin, and side areas.",
        price: "Rs. 1,000",
        duration: "",
      },
    ],
  },
  {
    id: "arm-wax",
    emoji: "💪",
    title: "Arm Waxing",
    services: [
      {
        name: "Half Arms",
        description: "Forearm wax from elbow to wrist for silky smooth skin.",
        price: "Rs. 1,000",
        duration: "",
      },
      {
        name: "Full Arms",
        description: "Full arm wax from shoulder to wrist.",
        price: "Rs. 1,500",
        duration: "",
      },
    ],
  },
  {
    id: "leg-wax",
    emoji: "🦵",
    title: "Leg Waxing",
    services: [
      {
        name: "Half Legs",
        description: "Lower leg wax from knee to ankle.",
        price: "Rs. 1,500",
        duration: "",
      },
      {
        name: "Full Legs",
        description: "Complete leg wax from thigh to ankle.",
        price: "Rs. 2,000",
        duration: "",
      },
    ],
  },
  {
    id: "body-wax",
    emoji: "✨",
    title: "Body Waxing",
    services: [
      {
        name: "Full Stomach",
        description: "Stomach area wax with careful, hygienic technique.",
        price: "Rs. 1,000",
        duration: "",
      },
      {
        name: "Underarms",
        description: "Clean underarm wax with gentle post-care.",
        price: "Rs. 1,000",
        duration: "",
      },
    ],
  },
  {
    id: "bikini-wax",
    emoji: "💎",
    title: "Bikini Waxing",
    services: [
      {
        name: "Basic Bikini Line",
        description: "Neat bikini line tidy-up — discreet and hygienic.",
        price: "Rs. 2,000",
        duration: "",
      },
      {
        name: "Full Body Wax",
        description: "Full body bikini wax with comfort-first technique.",
        price: "Rs. 7,000",
        duration: "",
      },
    ],
  },
];

export function allBodySpaServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of bodySpaServiceSections) {
    for (const s of sec.services) names.push(s.name);
  }
  return names;
}
