export type MakeupServiceItem = {
  name: string;
  hint: string;
  price: string;
};

export type MakeupServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: MakeupServiceItem[];
};

export const makeupServiceSections: MakeupServiceSection[] = [
  {
    id: "bridal-makeup",
    emoji: "💍",
    title: "Bridal makeup",
    services: [
      {
        name: "Bridal Makeup Barat",
        hint: "Glamorous look for your barat ceremony — bold, stunning, and camera-ready.",
        price: "From Rs. 18,000",
      },
      {
        name: "Bridal Makeup Walima",
        hint: "Elegant reception look — refined, fresh, and radiant for your walima day.",
        price: "From Rs. 15,000",
      },
      {
        name: "Nikkah & Engagement Makeup",
        hint: "Timeless bride look for your intimate ceremony or engagement celebration.",
        price: "From Rs. 10,000",
      },
      {
        name: "Bridal Trial",
        hint: "Perfect your bridal look before the big day with expert consultation.",
        price: "From Rs. 5,000",
      },
    ],
  },
  {
    id: "event-makeup",
    emoji: "✨",
    title: "Event & party makeup",
    services: [
      {
        name: "Party Makeup",
        hint: "Glamorous party-ready makeup for weddings, gatherings, and celebrations.",
        price: "From Rs. 7,000",
      },
      {
        name: "Mehndi Makeup",
        hint: "Vibrant, festive look designed to complement henna and traditional attire.",
        price: "From Rs. 12,000",
      },
      {
        name: "Engagement Makeup",
        hint: "Special look for your engagement celebration — elegant and photo-perfect.",
        price: "From Rs. 8,000",
      },
      {
        name: "Festive Makeup",
        hint: "Color-pop makeup for Eid, Diwali, and other celebrations.",
        price: "From Rs. 6,000",
      },
    ],
  },
  {
    id: "everyday-makeup",
    emoji: "🎨",
    title: "Everyday & special occasion makeup",
    services: [
      {
        name: "Everyday Makeup",
        hint: "Light, natural everyday look that enhances your features beautifully.",
        price: "From Rs. 3,000",
      },
      {
        name: "Office Makeup",
        hint: "Professional, polished makeup perfect for work and meetings.",
        price: "From Rs. 3,500",
      },
      {
        name: "Photoshoot Makeup",
        hint: "Camera-ready makeup tailored to lighting and photography needs.",
        price: "From Rs. 5,000",
      },
      {
        name: "Editorial Makeup",
        hint: "Creative, artistic makeup for magazine shoots and special projects.",
        price: "From Rs. 6,000",
      },
    ],
  },
  {
    id: "correction-touch-up",
    emoji: "💄",
    title: "Correction & touch-up services",
    services: [
      {
        name: "Makeup Touch-Up",
        hint: "Quick refresh to keep your makeup fresh throughout the day or event.",
        price: "From Rs. 1,500",
      },
      {
        name: "Makeup Correction",
        hint: "Fix and refine any makeup imperfections from previous application.",
        price: "From Rs. 3,000",
      },
      {
        name: "Makeup Removal & Refresh",
        hint: "Professional removal and fresh makeup application for comfort.",
        price: "From Rs. 2,500",
      },
    ],
  },
  {
    id: "specialized-makeup",
    emoji: "🌟",
    title: "Specialized makeup services",
    services: [
      {
        name: "HD Makeup",
        hint: "High-definition makeup specially formulated to look perfect on camera.",
        price: "From Rs. 5,500",
      },
      {
        name: "Airbrush Makeup",
        hint: "Flawless airbrushed finish for long-lasting, camera-perfect results.",
        price: "From Rs. 8,000",
      },
      {
        name: "Bridal Party Makeup",
        hint: "Coordinated makeup for bride, bridesmaids, and family members.",
        price: "From Rs. 6,000",
      },
      {
        name: "Consultation / Trial",
        hint: "Expert consultation to find your perfect makeup style and colors.",
        price: "Complimentary / from Rs. 2,000",
      },
    ],
  },
];

export function allMakeupServiceNames(): string[] {
  const names: string[] = [];
  for (const section of makeupServiceSections) {
    for (const service of section.services) {
      names.push(service.name);
    }
  }
  return names;
}
