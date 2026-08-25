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
    emoji: "✦",
    title: "Basic Facial",
    services: [
      {
        name: "Basic Facial",
        description:
          "Restore everyday glow with a classic facial of cleanse, exfoliation, mask, and moisture for healthy, balanced skin.",
        price: "Rs. 1,800",
        duration: "",
      },
      {
        name: "Clean Up Facial",
        description:
          "Refresh your skin with a quick clean-up facial featuring gentle cleanse, steam, and extraction for clearer, smoother pores.",
        price: "Rs. 2,000",
        duration: "",
      },
      {
        name: "Express Facial",
        description:
          "Get a fast skin refresh when time is short — bright, fresh, and radiant in just half an hour.",
        price: "Rs. 2,200",
        duration: "",
      },
    ],
  },
  {
    id: "whitening-brightening",
    emoji: "✦",
    title: "Whitening / Brightening",
    services: [
      {
        name: "Gold Facial",
        description:
          "Indulge in a luxury gold-infused facial that firms, brightens, and leaves skin feeling sumptuously smooth.",
        price: "Rs. 3,200",
        duration: "",
      },
      {
        name: "Whitening Facial",
        description:
          "Reveal a brighter, more even complexion with a gentle whitening facial designed for visible radiance and clarity.",
        price: "Rs. 3,800",
        duration: "",
      },
      {
        name: "Glow Facial",
        description:
          "Achieve a lit-from-within glow with a facial perfect before weddings, parties, and special occasions.",
        price: "Rs. 4,200",
        duration: "",
      },
    ],
  },
  {
    id: "advanced-facial",
    emoji: "✦",
    title: "Advanced",
    services: [
      {
        name: "Skin Polish Facial",
        description:
          "Smooth texture and even tone with a skin polish facial for silky, refined skin that reflects light beautifully.",
        price: "Rs. 3,000",
        duration: "",
      },
      {
        name: "Josn",
        description:
          "Advanced skin renewal treatment for smoother, refreshed complexion.",
        price: "Rs. 4,000",
        duration: "",
      },
      {
        name: "Vitamin C Facial",
        description:
          "Brighten sun-stressed skin with an antioxidant-rich vitamin C facial for clarity and environmental protection.",
        price: "Rs. 4,500",
        duration: "",
      },
      {
        name: "Hydra Facial",
        description:
          "Deeply hydrate and glow with a hydra facial that cleanses, extracts, and infuses skin with nourishing serums.",
        price: "Rs. 5,500",
        duration: "",
      },
    ],
  },
  {
    id: "herbal-organic",
    emoji: "✦",
    title: "Herbal / Organic",
    services: [
      {
        name: "Fruit Facial",
        description:
          "Exfoliate naturally with enzyme-rich fruit actives for a fresh, glowing complexion and silky softness.",
        price: "Rs. 3,200",
        duration: "",
      },
      {
        name: "Herbal Facial",
        description:
          "Nourish your skin with plant-based herbal extracts for a calm, balanced, and naturally refreshed complexion.",
        price: "Rs. 3,800",
        duration: "",
      },
    ],
  },
  {
    id: "bridal-facial",
    emoji: "✦",
    title: "Bridal",
    services: [
      {
        name: "Instant Glow Facial",
        description:
          "Get same-day luminosity with an instant glow facial perfect before photos, parties, or last-minute occasions.",
        price: "Rs. 5,200",
        duration: "",
      },
      {
        name: "Bridal Glow Facial",
        description:
          "Prepare radiant wedding-day skin with a multi-step bridal glow facial designed to perfect your complexion before events.",
        price: "Rs. 7,200",
        duration: "",
      },
      {
        name: "Luxury Facial",
        description:
          "Experience top-tier masks and massage in a luxury facial for red-carpet skin that feels as good as it looks.",
        price: "Rs. 8,500",
        duration: "",
      },
    ],
  },
];

export function allFacialServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of facialServiceSections) {
    for (const s of sec.services) names.push(s.name);
  }
  return names;
}
