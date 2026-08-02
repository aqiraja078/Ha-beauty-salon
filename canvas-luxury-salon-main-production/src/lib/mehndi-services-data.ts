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
    emoji: "✋",
    title: "Hand mehndi",
    services: [
      {
        name: "Simple Mehndi Design",
        description: "Light coverage for first-timers, Eid visits, or casual days.",
        price: "From Rs. 1,500",
        duration: "30–45 min",
      },
      {
        name: "Arabic Mehndi",
        description: "Bold vines and open space — popular for mehndi nights in Punjab.",
        price: "From Rs. 2,500",
        duration: "45–90 min",
      },
      {
        name: "Indian Mehndi",
        description: "Dense peacocks and motifs with full-palm fill for festive weeks.",
        price: "From Rs. 3,500",
        duration: "1–2 hrs",
      },
      {
        name: "Pakistani Mehndi",
        description: "Fine front-and-back detail in the classic Pakistani bridal style.",
        price: "From Rs. 4,000",
        duration: "1.5–2.5 hrs",
      },
      {
        name: "Floral Mehndi",
        description: "Roses and vines that sit well with pastel mehndi outfits.",
        price: "From Rs. 2,200",
        duration: "45–75 min",
      },
      {
        name: "Mandala Mehndi",
        description: "Centred mandala with layered rings for guest and party looks.",
        price: "From Rs. 2,800",
        duration: "60–90 min",
      },
      {
        name: "Finger Mehndi",
        description: "Fingers and bracelet lines — quick for Chaand Raat or office Eid.",
        price: "From Rs. 1,200",
        duration: "25–40 min",
      },
    ],
  },
  {
    id: "feet-mehndi",
    emoji: "🦶",
    title: "Feet mehndi",
    services: [
      {
        name: "Simple Feet Mehndi",
        description: "Toes and tops of feet for khussas and guest sandals.",
        price: "From Rs. 1,800",
        duration: "30–45 min",
      },
      {
        name: "Bridal Feet Mehndi",
        description: "Rich soles and sides matched to your bridal hand set.",
        price: "From Rs. 4,500",
        duration: "1–2 hrs",
      },
      {
        name: "Anklet Style Mehndi",
        description: "Jewellery-style bands that peek under lehenga hems.",
        price: "From Rs. 2,000",
        duration: "40–60 min",
      },
      {
        name: "Full Feet Mehndi",
        description: "Toes to ankle fill — full bridal or heavy festive coverage.",
        price: "From Rs. 5,500",
        duration: "1.5–2.5 hrs",
      },
    ],
  },
  {
    id: "bridal-mehndi",
    emoji: "👰",
    title: "Bridal mehndi",
    services: [
      {
        name: "Full Bridal Mehndi (Hands + Feet)",
        description: "Full hands and feet at home — density planned on consult.",
        price: "Rs. 8,000 – 15,000",
        duration: "2–4 hrs",
      },
      {
        name: "Heavy Bridal Mehndi",
        description: "Maximum fill; elbows or calves optional — quote after preview.",
        price: "From Rs. 12,000",
        duration: "3–5 hrs",
      },
      {
        name: "Dulhan Special Mehndi",
        description: "Signature dulhan set with names, dates, or hidden motifs.",
        price: "From Rs. 10,000",
        duration: "3–4 hrs",
      },
      {
        name: "Customized Bridal Design",
        description: "Your story and references drawn into the pattern — Jhelum to Gujrat.",
        price: "Quote on consult",
        duration: "Varies",
      },
    ],
  },
  {
    id: "occasion-mehndi",
    emoji: "🎉",
    title: "Occasion mehndi",
    services: [
      {
        name: "Eid Mehndi",
        description: "Festive sets sized for family Eid photos and Chaand Raat.",
        price: "From Rs. 1,800",
        duration: "30–60 min",
      },
      {
        name: "Party Mehndi",
        description: "Trend patterns for birthdays, dholki, and girls’ nights.",
        price: "From Rs. 2,200",
        duration: "45–75 min",
      },
      {
        name: "Wedding Guest Mehndi",
        description: "Elegant but quicker so you are ready before the baraat.",
        price: "From Rs. 2,500",
        duration: "45–90 min",
      },
      {
        name: "Engagement Mehndi",
        description: "Hands-focused design for mangni ring shots and close-ups.",
        price: "From Rs. 3,500",
        duration: "1–2 hrs",
      },
    ],
  },
  {
    id: "modern-mehndi",
    emoji: "✨",
    title: "Modern / trend mehndi",
    services: [
      {
        name: "Glitter Mehndi",
        description: "Henna with safe glitter accents for party and mehndi nights.",
        price: "From Rs. 2,000",
        duration: "+20–30 min",
      },
      {
        name: "White Mehndi",
        description: "White paste look for contrast on deeper skin tones.",
        price: "From Rs. 2,500",
        duration: "45–75 min",
      },
      {
        name: "Colored Mehndi",
        description: "Tinted pastes or gems for festivals and content shoots.",
        price: "From Rs. 2,800",
        duration: "45–90 min",
      },
      {
        name: "Tattoo Style Mehndi",
        description: "Bold graphic lines inspired by modern tattoo looks.",
        price: "From Rs. 2,200",
        duration: "45–70 min",
      },
      {
        name: "Minimal Mehndi",
        description: "Single-line and open-space looks for everyday Eid wear.",
        price: "From Rs. 1,500",
        duration: "25–45 min",
      },
    ],
  },
  {
    id: "premium-mehndi",
    emoji: "💎",
    title: "Premium mehndi",
    services: [
      {
        name: "Portrait Mehndi (Face Design)",
        description: "Small portrait or symbol — size and placement on consult.",
        price: "From Rs. 5,000",
        duration: "1–2 hrs",
      },
      {
        name: "Theme Based Mehndi",
        description: "Travel, film, or personal themes sketched into the design.",
        price: "From Rs. 6,000",
        duration: "2–3 hrs",
      },
      {
        name: "Designer Mehndi",
        description: "Bespoke senior-artist design with a sketch if you want one.",
        price: "From Rs. 8,000",
        duration: "2–4 hrs",
      },
      {
        name: "Instant Mehndi Service (Quick Apply)",
        description: "Fast patterns when guests arrive early or time is short.",
        price: "From Rs. 1,000",
        duration: "15–30 min",
      },
    ],
  },
];

export function allMehndiServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of mehndiServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
