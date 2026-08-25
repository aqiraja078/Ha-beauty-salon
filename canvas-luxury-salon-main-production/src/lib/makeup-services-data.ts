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
    id: "event-makeup",
    emoji: "✨",
    title: "Event & Party Makeup",
    services: [
      {
        name: "Festive Makeup",
        hint: "Celebrate Eid, Diwali, and festive occasions with colour-pop makeup that feels joyful, fresh, and beautifully you.",
        price: "Rs. 6,000",
      },
      {
        name: "Party Makeup",
        hint: "Get party-ready with glamorous makeup designed for weddings, gatherings, and celebrations that lasts beautifully all evening.",
        price: "Rs. 7,000",
      },
      {
        name: "Mehndi Makeup",
        hint: "Complement your henna and traditional attire with vibrant, festive makeup crafted for mehndi night radiance.",
        price: "Rs. 14,500",
      },
      {
        name: "Nikkah & Engagement Makeup",
        hint: "Achieve a timeless bride look with soft, refined makeup perfect for your Nikkah ceremony or intimate engagement celebration.",
        price: "Rs. 16,000",
      },
    ],
  },
  {
    id: "bridal-barat-makeup",
    emoji: "💍",
    title: "Bridal Barat Makeup",
    services: [
      {
        name: "Signature Bridal Package Barat",
        hint: "Soft glam HD makeup, elegant hair styling, dupatta setting, Arabic mehndi, and glow facial for a fresh, radiant finish.",
        price: "Rs. 18,000",
      },
      {
        name: "Bridal Makeup Barat",
        hint: "Create a bold and glamorous Barat look with stunning makeup, rich colour, and camera-ready finishing.",
        price: "Rs. 30,000",
      },
      {
        name: "Exclusive Bridal Package",
        hint: "Complete bridal transformation with long-lasting HD makeup, signature hair styling, full bridal mehndi and advanced facial.",
        price: "Rs. 35,000",
      },
      {
        name: "Luxury Bridal Package Barat",
        hint: "Royal bridal makeover with premium HD makeup, hairstyling, heavy bridal mehndi, advanced skin treatments & mini touch-up kit.",
        price: "Rs. 45,000",
      },
    ],
  },
  {
    id: "bridal-walima-makeup",
    emoji: "👰",
    title: "Bridal Walima Makeup",
    services: [
      {
        name: "Signature Walima Package",
        hint: "HD bridal makeup, elegant hair styling, dupatta setting, premium eyelashes, jewellery setting & long-lasting finish.",
        price: "Rs. 21,000",
      },
      {
        name: "Premium Walima Package",
        hint: "Luxury HD makeup, signature hair styling, designer dupatta setting, eyelashes, jewellery setting, advanced skin prep & mini touch-up kit.",
        price: "Rs. 26,000",
      },
      {
        name: "Royal Walima Package",
        hint: "HD bridal makeup, luxury hairstyling, designer dupatta draping, jewellery setting, advanced skin treatment, glow facial & touch-up kit.",
        price: "Rs. 32,000",
      },
    ],
  },
  {
    id: "everyday-makeup",
    emoji: "🎨",
    title: "Everyday Makeup",
    services: [
      {
        name: "Everyday Makeup",
        hint: "Enhance your natural features with light, effortless everyday makeup that looks fresh, polished, and beautifully understated.",
        price: "Rs. 3,500",
      },
      {
        name: "Office Makeup",
        hint: "Look professional and polished with refined office makeup perfect for work, meetings, and everyday confidence.",
        price: "Rs. 4,500",
      },
      {
        name: "Editorial Makeup",
        hint: "Make a creative statement with artistic editorial makeup designed for magazine shoots and bold visual projects.",
        price: "Rs. 6,000",
      },
      {
        name: "Photoshoot Makeup",
        hint: "Get camera-ready with makeup tailored to your lighting, angles, and photography needs for flawless on-screen results.",
        price: "Rs. 10,000",
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
