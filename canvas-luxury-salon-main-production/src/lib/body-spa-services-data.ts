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

export const bodySpaServiceSections: BodySpaServiceSection[] = [
  {
    id: "body-massage",
    emoji: "💆‍♀️",
    title: "Body massage (most popular)",
    services: [
      {
        name: "Full Body Massage",
        description:
          "Head-to-toe flow to release tension and improve circulation.",
        price: "Rs. 4,500",
        duration: "60 min",
      },
      {
        name: "Relaxation Massage",
        description: "Slow, gentle strokes for deep calm and better sleep.",
        price: "Rs. 3,800",
        duration: "50 min",
      },
      {
        name: "Swedish Massage",
        description: "Classic long glides and kneading for overall ease.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Deep Tissue Massage",
        description: "Firm pressure for tight muscles and chronic stiffness.",
        price: "Rs. 5,000",
        duration: "60 min",
      },
      {
        name: "Aromatherapy Massage",
        description: "Essential oils blended to your mood — relax or uplift.",
        price: "Rs. 4,800",
        duration: "60 min",
      },
      {
        name: "Hot Stone Massage",
        description: "Warm stones melt tension along back, legs, and shoulders.",
        price: "Rs. 6,000",
        duration: "70 min",
      },
    ],
  },
  {
    id: "body-treatments",
    emoji: "🌿",
    title: "Body treatments",
    services: [
      {
        name: "Body Polishing",
        description: "Exfoliation plus moisture for silky, even skin.",
        price: "Rs. 5,500",
        duration: "55 min",
      },
      {
        name: "Body Scrub",
        description: "Sugar or salt scrub to smooth rough areas and boost glow.",
        price: "Rs. 4,200",
        duration: "45 min",
      },
      {
        name: "Body Wrap (Chocolate / Herbal / Mud)",
        description: "Choice of wrap to nourish, detox, or firm — consult on day.",
        price: "Rs. 6,000",
        duration: "60 min",
      },
      {
        name: "Skin Detox Treatment",
        description: "Clarifying body ritual to refresh congested or dull skin.",
        price: "Rs. 5,200",
        duration: "55 min",
      },
      {
        name: "Whitening Body Treatment",
        description: "Brightening body care for elbows, knees, and overall tone.",
        price: "Rs. 6,500",
        duration: "65 min",
      },
    ],
  },
  {
    id: "premium-spa",
    emoji: "✨",
    title: "Premium spa treatments",
    services: [
      {
        name: "Moroccan Bath (Hammam)",
        description: "Deep cleansing + full body relaxation in steam-inspired ritual.",
        price: "Rs. 5,000",
        duration: "60–90 min",
      },
      {
        name: "Turkish Bath",
        description: "Foam, scrub, and rinse tradition for baby-soft skin.",
        price: "Rs. 5,500",
        duration: "75 min",
      },
      {
        name: "Gold Body Spa",
        description: "Luxury gold-infused oils and mask for luminous skin.",
        price: "Rs. 8,500",
        duration: "80 min",
      },
      {
        name: "Luxury Spa Therapy",
        description: "Extended ritual combining massage, scrub, and hydration.",
        price: "Rs. 9,000",
        duration: "90 min",
      },
      {
        name: "Milk Body Treatment",
        description: "Lactic softness and calm — ideal for sensitive or dry skin.",
        price: "Rs. 5,800",
        duration: "60 min",
      },
    ],
  },
  {
    id: "relaxation-therapy",
    emoji: "🌸",
    title: "Relaxation & therapy services",
    services: [
      {
        name: "Head, Neck & Shoulder Massage",
        description: "Targeted relief for desk strain and tension headaches.",
        price: "Rs. 2,200",
        duration: "30 min",
      },
      {
        name: "Foot Reflexology",
        description: "Pressure-point foot work to restore balance and ease.",
        price: "Rs. 2,800",
        duration: "40 min",
      },
      {
        name: "Back Massage",
        description: "Focused work on upper, mid, or lower back as needed.",
        price: "Rs. 2,500",
        duration: "35 min",
      },
      {
        name: "Stress Relief Therapy",
        description: "Combined breath cues, scalp, and shoulder release.",
        price: "Rs. 3,200",
        duration: "45 min",
      },
    ],
  },
  {
    id: "skin-care-body",
    emoji: "🧴",
    title: "Skin care body services",
    services: [
      {
        name: "Body Bleach",
        description: "Even, gentle brightening for arms, legs, or full body.",
        price: "Rs. 3,500",
        duration: "40 min",
      },
      {
        name: "Body Wax (Full / Half)",
        description: "Strip or hot wax options — choose area at booking.",
        price: "From Rs. 2,500",
        duration: "30–90 min",
      },
      {
        name: "Tan Removal Treatment",
        description: "Helps fade uneven tan and sun-darkened patches.",
        price: "Rs. 4,000",
        duration: "50 min",
      },
      {
        name: "Back Facial",
        description: "Cleanse, extract, and treat hard-to-reach back skin.",
        price: "Rs. 4,500",
        duration: "50 min",
      },
    ],
  },
  {
    id: "bridal-spa",
    emoji: "👰",
    title: "Bridal spa packages",
    services: [
      {
        name: "Pre-Bridal Full Body Spa",
        description: "Full polish, wrap, and massage path — timeline on consult.",
        price: "From Rs. 15,000",
        duration: "120+ min",
      },
      {
        name: "Bridal Glow Treatment",
        description: "Radiance-focused body ritual before your events.",
        price: "Rs. 12,000",
        duration: "90 min",
      },
      {
        name: "Full Body Polish + Massage Package",
        description: "Scrub, mask, and relaxing massage in one session.",
        price: "Rs. 9,500",
        duration: "100 min",
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
