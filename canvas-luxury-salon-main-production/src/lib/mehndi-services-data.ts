export type MehndiServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type MehndiServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: MehndiServiceItem[];
};

export const mehndiServiceSections: MehndiServiceSection[] = [
  {
    id: "hand-mehndi",
    emoji: "✦",
    title: "Hand Mehndi",
    services: [
      {
        name: "Finger Mehndi",
        description:
          "Make a minimal yet striking statement with finger mehndi and jewellery-inspired bracelet lines.",
        price: "Rs. 800",
        duration: "",
      },
      {
        name: "Simple Mehndi (Back Hand)",
        description: "Elegant back-hand patterns with clean, balanced coverage.",
        price: "Rs. 1,000",
        duration: "",
      },
      {
        name: "Simple Mehndi (Front Hand)",
        description:
          "Light front-hand coverage for casual days or first-time clients.",
        price: "Rs. 1,200",
        duration: "",
      },
      {
        name: "Arabic Mehndi (Back Hand)",
        description: "Signature Arabic negative-space patterns on the back hand.",
        price: "Rs. 1,800",
        duration: "",
      },
      {
        name: "Arabic Mehndi (Front Hand)",
        description: "Bold Arabic flows and vines on the front of the hand.",
        price: "Rs. 2,000",
        duration: "",
      },
      {
        name: "Simple Mehndi (Full Hand)",
        description:
          "Complete front and back simple design for a cohesive look.",
        price: "Rs. 2,000",
        duration: "",
      },
      {
        name: "Arabic Mehndi (Full Hand)",
        description:
          "Full Arabic mehndi front and back with flowing vine detail.",
        price: "Rs. 3,500",
        duration: "",
      },
    ],
  },
  {
    id: "feet-mehndi",
    emoji: "✦",
    title: "Feet Mehndi",
    services: [
      {
        name: "Simple Feet Mehndi",
        description:
          "Decorate toes and feet tops with light, graceful mehndi patterning for a subtle festive touch.",
        price: "Rs. 1,500",
        duration: "",
      },
      {
        name: "Anklet Style Mehndi",
        description:
          "Wear jewellery-inspired anklet mehndi with delicate bands and charms circling your ankle beautifully.",
        price: "Rs. 1,800",
        duration: "",
      },
      {
        name: "Full Feet Mehndi",
        description:
          "Cover toes to ankle with detailed full feet mehndi for a lavish, traditional bridal finish.",
        price: "Rs. 4,500",
        duration: "",
      },
    ],
  },
  {
    id: "occasion-mehndi",
    emoji: "✦",
    title: "Occasion Mehndi",
    services: [
      {
        name: "Eid Mehndi (Front)",
        description:
          "Festive front-hand set sized for Eid gatherings and photos.",
        price: "Rs. 1,500",
        duration: "",
      },
      {
        name: "Party Mehndi",
        description:
          "Stand out at birthdays and celebrations with trend-forward party mehndi patterns full of personality.",
        price: "Rs. 1,800",
        duration: "",
      },
      {
        name: "Customized Bridal Design",
        description:
          "Tell your story through mehndi — your symbols, references, and ideas woven into a one-of-a-kind bridal design.",
        price: "Quote on Consult",
        duration: "",
      },
    ],
  },
  {
    id: "bridal-mehndi",
    emoji: "✦",
    title: "Bridal Mehndi",
    services: [
      {
        name: "Full Hand + Full Feet Bridal",
        description:
          "Full hands and feet bridal mehndi with rich, detailed coverage.",
        price: "Rs. 10,000",
        duration: "",
      },
      {
        name: "Premium Bridal Mehndi (Designer / Customized)",
        description:
          "Bespoke designer bridal mehndi with customized motifs and premium detail.",
        price: "Rs. 15,000",
        duration: "",
      },
    ],
  },
];

export function allMehndiServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of mehndiServiceSections) {
    for (const s of sec.services) names.push(s.name);
  }
  return names;
}
