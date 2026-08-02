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
    title: "Hair cuts at home",
    services: [
      { name: "Hair Trim", hint: "Tidies split ends so your length still sits well under a dupatta.", price: "Rs. 1,200" },
      { name: "Straight Cut", hint: "One clean line that frames the face for Eid or guest looks.", price: "Rs. 1,500" },
      { name: "Layer Cut", hint: "Soft layers that move with lehenga and open-hair barat styles.", price: "Rs. 2,000" },
      { name: "Step Cut", hint: "Stepped texture that holds volume for party and mehndi nights.", price: "Rs. 2,200" },
      { name: "Feather Cut", hint: "Feathered ends that stay light under jewellery and humid evenings.", price: "Rs. 1,800" },
      { name: "Bob Cut", hint: "Jaw-skimming bob shaped for your face — easy for home touch-ups.", price: "Rs. 2,500" },
      { name: "Pixie Cut", hint: "Short crop with neat edges that still work under a bridal veil.", price: "Rs. 2,000" },
      { name: "Bangs (Fringe)", hint: "Curtain, blunt, or side fringe to soften a bridal forehead.", price: "Rs. 800" },
      { name: "U Cut / V Cut", hint: "U or V perimeter that keeps back length for bridal open hair.", price: "Rs. 1,800" },
    ],
  },
  {
    id: "hair-color",
    emoji: "🎨",
    title: "Hair colour at home",
    services: [
      { name: "Root Touch-Up", hint: "Covers grey regrowth so colour looks even for walima photos.", price: "Rs. 3,000" },
      { name: "Full Hair Color", hint: "Even shade roots to ends — ready for mehndi and barat week.", price: "Rs. 5,000" },
      { name: "Highlights", hint: "Soft ribbons of light that catch in outdoor baraat light.", price: "Rs. 6,000" },
      { name: "Lowlights", hint: "Deeper strands for fullness under heavy bridal jewellery.", price: "Rs. 5,500" },
      { name: "Balayage", hint: "Hand-painted melt that grows out gently between family events.", price: "Rs. 8,000" },
      { name: "Ombre", hint: "Dark-to-light fade that pairs well with open-hair bridal looks.", price: "Rs. 7,000" },
      { name: "Global Color", hint: "One solid tone from scalp to tips for a clean guest look.", price: "Rs. 4,500" },
      {
        name: "Fashion Colors (Red, Blue, Purple etc.)",
        hint: "Bold reds, blues, or pastels for fashion shoots and parties.",
        price: "Rs. 6,000",
      },
    ],
  },
  {
    id: "hair-treatment",
    emoji: "💆‍♀️",
    title: "Hair treatments",
    services: [
      { name: "Hair Spa", hint: "Nourishing spa at home to soften dry strands before wedding week.", price: "Rs. 3,500" },
      { name: "Keratin Treatment", hint: "Tames frizz so hair stays manageable through humid barat days.", price: "Rs. 8,000" },
      { name: "Protein Treatment", hint: "Rebuilds strength after colour or heat from bridal trials.", price: "Rs. 4,000" },
      { name: "Smoothening Treatment", hint: "Sleeker finish that holds through mehndi heat and long evenings.", price: "Rs. 7,000" },
      { name: "Rebonding", hint: "Straight, set results for thick hair that fights humidity.", price: "Rs. 10,000" },
      { name: "Botox Hair Treatment", hint: "Softens rough lengths before heavy styling and hairpins.", price: "Rs. 6,000" },
      { name: "Scalp Treatment", hint: "Calms an itchy, dry scalp ahead of long bridal days.", price: "Rs. 2,500" },
      { name: "Dandruff Treatment", hint: "Targets flakes so white outfits and dark velvet stay clean.", price: "Rs. 3,000" },
      { name: "Hair Fall Treatment", hint: "Strengthening care for shedding after stress or colour work.", price: "Rs. 4,500" },
    ],
  },
  {
    id: "hair-styling",
    emoji: "💃",
    title: "Hair styling",
    services: [
      { name: "Blow Dry", hint: "Volume or smooth finish at home for dinners and small gatherings.", price: "Rs. 1,500" },
      { name: "Straightening (Temporary)", hint: "Heat-protected sleek pass for photos and Eid visits.", price: "Rs. 2,000" },
      { name: "Curling", hint: "Soft waves or curls sized for mehndi or party night.", price: "Rs. 2,500" },
      { name: "Ironing", hint: "Pin-straight polish that stays under a light dupatta.", price: "Rs. 2,200" },
      { name: "Party Hairstyle", hint: "Statement style for dholki, mehndi, or wedding guest nights.", price: "Rs. 4,000" },
      { name: "Bridal Hairstyle", hint: "Secure bridal set that holds through nikkah, barat, and photos.", price: "Rs. 6,000" },
      { name: "Braids / Plaits", hint: "Classic or trend braids that sit well under jewellery.", price: "Rs. 3,000" },
      { name: "Bun Styles", hint: "Low, high, or textured bun ready for veil and gajra.", price: "Rs. 2,500" },
    ],
  },
  {
    id: "bridal-hair",
    emoji: "👰",
    title: "Bridal hair (home service)",
    services: [
      { name: "Bridal Hairstyling", hint: "Day-of bridal hair matched to your outfit, veil, and jewellery.", price: "Rs. 8,000" },
      { name: "Hair Accessories Setting", hint: "Pins, vines, and jewels fixed so they last through barat.", price: "Rs. 1,500" },
      { name: "Dupatta Setting", hint: "Comfortable dupatta drape that stays put for walima photos.", price: "Rs. 2,000" },
      { name: "Hair Extensions Setup", hint: "Length or volume blended for heavy bridal open-hair looks.", price: "Rs. 5,000" },
    ],
  },
  {
    id: "hair-care",
    emoji: "🧴",
    title: "Hair care basics",
    services: [
      { name: "Hair Wash", hint: "Gentle wash and finish before styling or a quick outing.", price: "Rs. 500" },
      { name: "Conditioning", hint: "Softens tangles so styling for Eid or guests goes smoother.", price: "Rs. 800" },
      { name: "Deep Conditioning", hint: "Extra moisture for dry hair after colour or summer sun.", price: "Rs. 1,500" },
      { name: "Oil Massage (Head Massage)", hint: "Warm oil scalp massage — calming before a long wedding day.", price: "Rs. 1,000" },
    ],
  },
  {
    id: "advanced-premium",
    emoji: "➕",
    title: "Advanced hair services",
    services: [
      { name: "Hair Extensions", hint: "Colour-matched length for bridal volume across Jhelum & Gujrat.", price: "Rs. 10,000" },
      { name: "Hair Volume Treatment", hint: "Lift at the crown for fuller bridal and party styles.", price: "Rs. 8,000" },
      { name: "Scalp Detox", hint: "Clears oil and product buildup before colour or spa.", price: "Rs. 3,000" },
      {
        name: "Laser Hair Therapy (premium salons)",
        hint: "Light-based scalp support where available — ask on booking.",
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
