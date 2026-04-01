export type HairServiceItem = {
  name: string;
  hint: string;
  price: string;
};

export type HairServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: HairServiceItem[];
};

export const hairServiceSections: HairServiceSection[] = [
  {
    id: "hair-cut",
    emoji: "✂️",
    title: "Hair cut services",
    services: [
      { name: "Hair Trim", hint: "Neaten length and ends while keeping your shape.", price: "Rs. 1,200" },
      { name: "Straight Cut", hint: "Clean, one-length line for a polished silhouette.", price: "Rs. 1,500" },
      { name: "Layer Cut", hint: "Movement and volume with soft or defined layers.", price: "Rs. 2,000" },
      { name: "Step Cut", hint: "Graduated steps for texture and bounce.", price: "Rs. 2,200" },
      { name: "Feather Cut", hint: "Light, feathered ends for a soft, airy finish.", price: "Rs. 1,800" },
      { name: "Bob Cut", hint: "Classic or modern bob tailored to your jawline.", price: "Rs. 2,500" },
      { name: "Pixie Cut", hint: "Short, sculpted crop with bespoke detailing.", price: "Rs. 2,000" },
      { name: "Bangs (Fringe)", hint: "Curtain, blunt, or side-swept fringe design.", price: "Rs. 800" },
      { name: "U Cut / V Cut", hint: "Shaped perimeter for length at back with flow.", price: "Rs. 1,800" },
    ],
  },
  {
    id: "hair-color",
    emoji: "🎨",
    title: "Hair coloring services",
    services: [
      { name: "Root Touch-Up", hint: "Seamless regrowth refresh to match your tone.", price: "Rs. 3,000" },
      { name: "Full Hair Color", hint: "Rich, even color from roots to ends.", price: "Rs. 5,000" },
      { name: "Highlights", hint: "Dimensional ribbons of light where you want glow.", price: "Rs. 6,000" },
      { name: "Lowlights", hint: "Depth and contrast for fuller-looking hair.", price: "Rs. 5,500" },
      { name: "Balayage", hint: "Hand-painted sun-kissed gradient, low maintenance.", price: "Rs. 8,000" },
      { name: "Ombre", hint: "Bold or soft melt from depth to lighter ends.", price: "Rs. 7,000" },
      { name: "Global Color", hint: "One unified shade from scalp to tips.", price: "Rs. 4,500" },
      {
        name: "Fashion Colors (Red, Blue, Purple etc.)",
        hint: "Creative vivids and pastels with healthy prep and aftercare.",
        price: "Rs. 6,000",
      },
    ],
  },
  {
    id: "hair-treatment",
    emoji: "💆‍♀️",
    title: "Hair treatment services",
    services: [
      { name: "Hair Spa", hint: "Deep nourishment, massage, and shine ritual.", price: "Rs. 3,500" },
      { name: "Keratin Treatment", hint: "Smoothing care to reduce frizz and styling time.", price: "Rs. 8,000" },
      { name: "Protein Treatment", hint: "Strength and elasticity for stressed strands.", price: "Rs. 4,000" },
      { name: "Smoothening Treatment", hint: "Sleek, manageable finish with expert application.", price: "Rs. 7,000" },
      { name: "Rebonding", hint: "Straight, structured results for resistant textures.", price: "Rs. 10,000" },
      { name: "Botox Hair Treatment", hint: "Fillers and care for silky, plumped hair feel.", price: "Rs. 6,000" },
      { name: "Scalp Treatment", hint: "Balance, comfort, and a healthy base for growth.", price: "Rs. 2,500" },
      { name: "Dandruff Treatment", hint: "Targeted calming and clarifying for flaky scalp.", price: "Rs. 3,000" },
      { name: "Hair Fall Treatment", hint: "Fortifying ritual to support density and strength.", price: "Rs. 4,500" },
    ],
  },
  {
    id: "hair-styling",
    emoji: "💃",
    title: "Hair styling services",
    services: [
      { name: "Blow Dry", hint: "Volume, smoothness, or waves with a pro finish.", price: "Rs. 1,500" },
      { name: "Straightening (Temporary)", hint: "Sleek pass with heat protection.", price: "Rs. 2,000" },
      { name: "Curling", hint: "Waves or curls sized to your occasion.", price: "Rs. 2,500" },
      { name: "Ironing", hint: "Pin-straight polish with lasting hold.", price: "Rs. 2,200" },
      { name: "Party Hairstyle", hint: "Statement look for evenings and celebrations.", price: "Rs. 4,000" },
      { name: "Bridal Hairstyle", hint: "Secure, photogenic styling for your big day.", price: "Rs. 6,000" },
      { name: "Braids / Plaits", hint: "Classic and trend braids tailored to your hair.", price: "Rs. 3,000" },
      { name: "Bun Styles", hint: "Low, high, or textured buns with elegant detail.", price: "Rs. 2,500" },
    ],
  },
  {
    id: "bridal-hair",
    emoji: "👰",
    title: "Bridal hair services",
    services: [
      { name: "Bridal Hairstyling", hint: "Trial and day-of styling aligned with your veil and look.", price: "Rs. 8,000" },
      { name: "Hair Accessories Setting", hint: "Pins, vines, and jewels placed to stay all day.", price: "Rs. 1,500" },
      { name: "Dupatta Setting", hint: "Secure, comfortable draping that complements hair.", price: "Rs. 2,000" },
      { name: "Hair Extensions Setup", hint: "Volume or length blended for bridal styling.", price: "Rs. 5,000" },
    ],
  },
  {
    id: "hair-care",
    emoji: "🧴",
    title: "Hair care services",
    services: [
      { name: "Hair Wash", hint: "Gentle cleanse and finish with salon care.", price: "Rs. 500" },
      { name: "Conditioning", hint: "Instant slip, softness, and detangling.", price: "Rs. 800" },
      { name: "Deep Conditioning", hint: "Intensive moisture for dry or damaged hair.", price: "Rs. 1,500" },
      { name: "Oil Massage (Head Massage)", hint: "Relaxing scalp massage to boost circulation.", price: "Rs. 1,000" },
    ],
  },
  {
    id: "advanced-premium",
    emoji: "➕",
    title: "Advanced / premium services",
    services: [
      { name: "Hair Extensions", hint: "Tape, weave, or keratin — matched to your color.", price: "Rs. 10,000" },
      { name: "Hair Volume Treatment", hint: "Body and lift without heavy product feel.", price: "Rs. 8,000" },
      { name: "Scalp Detox", hint: "Deep cleanse to remove buildup and refresh roots.", price: "Rs. 3,000" },
      {
        name: "Laser Hair Therapy (premium salons)",
        hint: "Light-based scalp support where offered — consult for suitability.",
        price: "Rs. 5,000",
      },
    ],
  },
];

export function allHairServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of hairServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
