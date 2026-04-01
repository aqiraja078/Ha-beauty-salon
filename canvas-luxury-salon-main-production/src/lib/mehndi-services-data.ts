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
    title: "Hand mehndi designs",
    services: [
      {
        name: "Simple Mehndi Design",
        description: "Light coverage for casual days or first-time clients.",
        price: "From Rs. 1,500",
        duration: "30–45 min",
      },
      {
        name: "Arabic Mehndi",
        description: "Bold flows, negative space, and signature Arabic vines.",
        price: "From Rs. 2,500",
        duration: "45–90 min",
      },
      {
        name: "Indian Mehndi",
        description: "Dense motifs, peacocks, and traditional full-palm coverage.",
        price: "From Rs. 3,500",
        duration: "1–2 hrs",
      },
      {
        name: "Pakistani Mehndi",
        description: "Intricate detail with elegant symmetry front and back.",
        price: "From Rs. 4,000",
        duration: "1.5–2.5 hrs",
      },
      {
        name: "Floral Mehndi",
        description: "Roses, vines, and soft botanical patterns.",
        price: "From Rs. 2,200",
        duration: "45–75 min",
      },
      {
        name: "Mandala Mehndi",
        description: "Circular focal art with balanced geometric layers.",
        price: "From Rs. 2,800",
        duration: "60–90 min",
      },
      {
        name: "Finger Mehndi",
        description: "Statement fingers and bracelet lines — minimal yet striking.",
        price: "From Rs. 1,200",
        duration: "25–40 min",
      },
    ],
  },
  {
    id: "feet-mehndi",
    emoji: "🦶",
    title: "Feet mehndi designs",
    services: [
      {
        name: "Simple Feet Mehndi",
        description: "Toes and tops of feet with light patterning.",
        price: "From Rs. 1,800",
        duration: "30–45 min",
      },
      {
        name: "Bridal Feet Mehndi",
        description: "Rich soles and sides to match your bridal hand set.",
        price: "From Rs. 4,500",
        duration: "1–2 hrs",
      },
      {
        name: "Anklet Style Mehndi",
        description: "Jewellery-inspired bands and charms around the ankle.",
        price: "From Rs. 2,000",
        duration: "40–60 min",
      },
      {
        name: "Full Feet Mehndi",
        description: "Complete coverage from toes to ankle with detailed fill.",
        price: "From Rs. 5,500",
        duration: "1.5–2.5 hrs",
      },
    ],
  },
  {
    id: "bridal-mehndi",
    emoji: "👰",
    title: "Bridal mehndi (most important)",
    services: [
      {
        name: "Full Bridal Mehndi (Hands + Feet)",
        description: "Full hands & feet detailed design — consult for complexity.",
        price: "Rs. 8,000 – 15,000",
        duration: "2–4 hrs",
      },
      {
        name: "Heavy Bridal Mehndi",
        description: "Maximum density, elbows and legs optional — quote on preview.",
        price: "From Rs. 12,000",
        duration: "3–5 hrs",
      },
      {
        name: "Dulhan Special Mehndi",
        description: "Signature bridal package with names, dates, or motifs hidden in art.",
        price: "From Rs. 10,000",
        duration: "3–4 hrs",
      },
      {
        name: "Customized Bridal Design",
        description: "Your story, symbols, and references woven into the pattern.",
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
        description: "Festive sets sized for family gatherings and photos.",
        price: "From Rs. 1,800",
        duration: "30–60 min",
      },
      {
        name: "Party Mehndi",
        description: "Trend-forward patterns for birthdays and celebrations.",
        price: "From Rs. 2,200",
        duration: "45–75 min",
      },
      {
        name: "Wedding Guest Mehndi",
        description: "Elegant but quicker application so you are event-ready.",
        price: "From Rs. 2,500",
        duration: "45–90 min",
      },
      {
        name: "Engagement Mehndi",
        description: "Coordinated with ring shots — hands-focused glam.",
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
        description: "Henna finish with safe cosmetic glitter accents.",
        price: "From Rs. 2,000",
        duration: "+20–30 min",
      },
      {
        name: "White Mehndi",
        description: "White body-safe paste look for contrast on deeper skin tones.",
        price: "From Rs. 2,500",
        duration: "45–75 min",
      },
      {
        name: "Colored Mehndi",
        description: "Tinted pastes or gems for festival or editorial style.",
        price: "From Rs. 2,800",
        duration: "45–90 min",
      },
      {
        name: "Tattoo Style Mehndi",
        description: "Graphic, bold lines inspired by modern tattoo aesthetics.",
        price: "From Rs. 2,200",
        duration: "45–70 min",
      },
      {
        name: "Minimal Mehndi",
        description: "Single-line and negative-space looks for everyday chic.",
        price: "From Rs. 1,500",
        duration: "25–45 min",
      },
    ],
  },
  {
    id: "premium-mehndi",
    emoji: "💎",
    title: "Premium mehndi services",
    services: [
      {
        name: "Portrait Mehndi (Face Design)",
        description: "Small symbolic portrait or motif — placement and size by consult.",
        price: "From Rs. 5,000",
        duration: "1–2 hrs",
      },
      {
        name: "Theme Based Mehndi",
        description: "Travel, cinema, or brand themes sketched into the pattern.",
        price: "From Rs. 6,000",
        duration: "2–3 hrs",
      },
      {
        name: "Designer Mehndi",
        description: "Senior artist bespoke design with preview sketch if needed.",
        price: "From Rs. 8,000",
        duration: "2–4 hrs",
      },
      {
        name: "Instant Mehndi Service (Quick Apply)",
        description: "Pre-mixed cones and fast stencil-friendly patterns on tight timelines.",
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
