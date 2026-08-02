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
    title: "Bridal makeup at home",
    services: [
      {
        name: "Bridal Makeup Barat",
        hint: "Bold, camera-ready barat glam done at your home in Jhelum, Dina, or Gujrat.",
        price: "From Rs. 18,000",
      },
      {
        name: "Bridal Makeup Walima",
        hint: "Softer walima finish that still holds through stage lights and hugs.",
        price: "From Rs. 15,000",
      },
      {
        name: "Nikkah & Engagement Makeup",
        hint: "Fresh bridal look for nikkah or engagement — light enough for close family.",
        price: "From Rs. 10,000",
      },
      {
        name: "Bridal Trial",
        hint: "Try colours and finish at home so barat day has no surprises.",
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
        hint: "Full glam for cousin weddings, dholki, and evening gatherings.",
        price: "From Rs. 7,000",
      },
      {
        name: "Mehndi Makeup",
        hint: "Warm, festive tones that sit well with henna and bright mehndi outfits.",
        price: "From Rs. 12,000",
      },
      {
        name: "Engagement Makeup",
        hint: "Ring-shot friendly finish for your mangni — soft yet defined.",
        price: "From Rs. 8,000",
      },
      {
        name: "Festive Makeup",
        hint: "Colour-pop looks for Eid, Chaand Raat, and family celebrations.",
        price: "From Rs. 6,000",
      },
    ],
  },
  {
    id: "everyday-makeup",
    emoji: "🎨",
    title: "Everyday & photoshoot",
    services: [
      {
        name: "Everyday Makeup",
        hint: "Light home-service makeup for visits, brunches, and casual days.",
        price: "From Rs. 3,000",
      },
      {
        name: "Office Makeup",
        hint: "Polished, workplace-friendly finish without heavy bridal colour.",
        price: "From Rs. 3,500",
      },
      {
        name: "Photoshoot Makeup",
        hint: "Makeup tuned for studio or outdoor shoots across Punjab weather.",
        price: "From Rs. 5,000",
      },
      {
        name: "Editorial Makeup",
        hint: "Creative looks for fashion content, campaigns, and concept shoots.",
        price: "From Rs. 6,000",
      },
    ],
  },
  {
    id: "correction-touch-up",
    emoji: "💄",
    title: "Touch-ups & corrections",
    services: [
      {
        name: "Makeup Touch-Up",
        hint: "Quick refresh between barat and walima or mid-event shine.",
        price: "From Rs. 1,500",
      },
      {
        name: "Makeup Correction",
        hint: "Fix uneven or outdated makeup before guests arrive.",
        price: "From Rs. 3,000",
      },
      {
        name: "Makeup Removal & Refresh",
        hint: "Gentle remove and reapply so skin rests between functions.",
        price: "From Rs. 2,500",
      },
    ],
  },
  {
    id: "specialized-makeup",
    emoji: "🌟",
    title: "Specialised makeup",
    services: [
      {
        name: "HD Makeup",
        hint: "HD-friendly finish that stays clear in close wedding videos.",
        price: "From Rs. 5,500",
      },
      {
        name: "Airbrush Makeup",
        hint: "Even airbrush base for long barat hours and humid evenings.",
        price: "From Rs. 8,000",
      },
      {
        name: "Bridal Party Makeup",
        hint: "Matched looks for sisters, bridesmaids, and close family at home.",
        price: "From Rs. 6,000",
      },
      {
        name: "Consultation / Trial",
        hint: "Skin tone and style chat — book before your wedding week.",
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
