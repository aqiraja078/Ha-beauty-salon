export type NailsServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type NailsServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: NailsServiceItem[];
};

export const nailsServiceSections: NailsServiceSection[] = [
  {
    id: "manicure",
    emoji: "✋",
    title: "Manicure (hands)",
    services: [
      {
        name: "Basic Manicure",
        description: "Shape, cuticles, buff, and polish — tidy for everyday and Eid.",
        price: "Rs. 1,200",
        duration: "30 min",
      },
      {
        name: "Classic Manicure",
        description: "Soak, cuticle care, light massage, and colour of your choice.",
        price: "Rs. 1,500",
        duration: "35 min",
      },
      {
        name: "Spa Manicure",
        description: "Deeper clean and hand massage before mehndi or jewellery.",
        price: "Rs. 2,000",
        duration: "40 min",
      },
      {
        name: "French Manicure",
        description: "Soft pink with white tips — classic for nikkah and guest looks.",
        price: "Rs. 1,800",
        duration: "40 min",
      },
      {
        name: "Gel Manicure",
        description: "Long-wear gel that survives barat hugs and late walima nights.",
        price: "Rs. 2,800",
        duration: "45 min",
      },
      {
        name: "Paraffin Manicure",
        description: "Warm paraffin for dry hands after henna or winter air.",
        price: "Rs. 2,400",
        duration: "45 min",
      },
      {
        name: "Luxury Manicure",
        description: "Masks and longer massage — bridal-week hand pampering at home.",
        price: "Rs. 3,200",
        duration: "55 min",
      },
    ],
  },
  {
    id: "pedicure",
    emoji: "🦶",
    title: "Pedicure (feet)",
    services: [
      {
        name: "Basic Pedicure",
        description: "Soak, shape, light heel care, and polish for sandals and khussas.",
        price: "Rs. 1,800",
        duration: "40 min",
      },
      {
        name: "Classic Pedicure",
        description: "Full soak, scrub, cuticles, massage, and colour.",
        price: "Rs. 2,200",
        duration: "50 min",
      },
      {
        name: "Spa Pedicure",
        description: "Scrub and mask for feet tired from shopping and mehndi standing.",
        price: "Rs. 2,800",
        duration: "55 min",
      },
      {
        name: "Deluxe Pedicure",
        description: "Extra sole and callus care before bridal open-footwear looks.",
        price: "Rs. 3,500",
        duration: "65 min",
      },
      {
        name: "French Pedicure",
        description: "French tips on toes that show under lehenga hems.",
        price: "Rs. 2,400",
        duration: "50 min",
      },
      {
        name: "Paraffin Pedicure",
        description: "Paraffin soak for cracked heels common in dry Punjab weather.",
        price: "Rs. 3,000",
        duration: "55 min",
      },
      {
        name: "Medical Pedicure (for cracked heels etc.)",
        description: "Gentler care for problem heels — tell us skin concerns on booking.",
        price: "From Rs. 3,200",
        duration: "60 min",
      },
    ],
  },
  {
    id: "nail-art",
    emoji: "🎨",
    title: "Nail art",
    services: [
      {
        name: "Simple Nail Art",
        description: "Dots, lines, or small accents for casual and office days.",
        price: "From Rs. 500",
        duration: "+15–25 min",
      },
      {
        name: "Bridal Nail Art",
        description: "Designs matched to jewellery for ring and mehndi close-ups.",
        price: "From Rs. 2,500",
        duration: "45–60 min",
      },
      {
        name: "3D Nail Art",
        description: "Raised florals and details for statement mehndi hands.",
        price: "From Rs. 1,800",
        duration: "30–50 min",
      },
      {
        name: "Stone / Rhinestone Nail Art",
        description: "Crystals that catch light in baraat and stage photos.",
        price: "From Rs. 1,200",
        duration: "+20–40 min",
      },
      {
        name: "Glitter Nails",
        description: "Full glitter or accent sparkle for parties and Chaand Raat.",
        price: "From Rs. 800",
        duration: "+15–30 min",
      },
      {
        name: "Ombre Nails",
        description: "Soft colour melt that pairs with festive outfits.",
        price: "From Rs. 1,500",
        duration: "35–50 min",
      },
      {
        name: "Custom Design Nails",
        description: "Bring a reference — we quote after seeing the detail level.",
        price: "From Rs. 2,000",
        duration: "Varies",
      },
    ],
  },
  {
    id: "nail-extensions",
    emoji: "💎",
    title: "Nail extensions",
    services: [
      {
        name: "Acrylic Extensions",
        description: "Strong length for bridal jewellery and long event days.",
        price: "From Rs. 3,500",
        duration: "75 min",
      },
      {
        name: "Gel Extensions",
        description: "Flexible gel length that looks natural in ring shots.",
        price: "From Rs. 4,000",
        duration: "80 min",
      },
      {
        name: "Polygel Nails",
        description: "Lighter hybrid build — easier for long mehndi evenings.",
        price: "From Rs. 4,500",
        duration: "85 min",
      },
      {
        name: "Nail Tips Extension",
        description: "Faster tip-and-overlay length before a sudden function.",
        price: "From Rs. 3,000",
        duration: "60 min",
      },
      {
        name: "French Extensions",
        description: "Extensions finished French — classic for nikkah and walima.",
        price: "From Rs. 4,200",
        duration: "90 min",
      },
    ],
  },
  {
    id: "nail-polish",
    emoji: "💅",
    title: "Nail polish",
    services: [
      {
        name: "Regular Nail Paint",
        description: "Classic lacquer in shades that match outfit colours.",
        price: "Rs. 800",
        duration: "25 min",
      },
      {
        name: "Gel Polish",
        description: "Cured gel shine that lasts through wedding-week errands.",
        price: "Rs. 2,200",
        duration: "40 min",
      },
      {
        name: "Shellac Polish",
        description: "Thin hybrid wear with glossy finish for guest events.",
        price: "Rs. 2,400",
        duration: "40 min",
      },
      {
        name: "Matte Finish Polish",
        description: "Velvet matte top over gel or regular — soft bridal look.",
        price: "Rs. 900",
        duration: "+10 min",
      },
      {
        name: "Chrome Nails",
        description: "Mirror or pearl chrome for fashion and party nights.",
        price: "From Rs. 1,800",
        duration: "35 min",
      },
    ],
  },
  {
    id: "nail-care-repair",
    emoji: "🧴",
    title: "Nail care & repair",
    services: [
      {
        name: "Nail Repair",
        description: "Fixes a split tip before photos or a last-minute invite.",
        price: "From Rs. 500",
        duration: "20 min",
      },
      {
        name: "Cuticle Treatment",
        description: "Softens and tidies cuticles so hands look neat with mehndi.",
        price: "Rs. 800",
        duration: "25 min",
      },
      {
        name: "Nail Strengthening Treatment",
        description: "Helps weak nails after gel removal or frequent painting.",
        price: "Rs. 1,200",
        duration: "30 min",
      },
      {
        name: "Nail Removal (Gel / Acrylic)",
        description: "Careful soak-off or file-down — no rushed damage.",
        price: "From Rs. 1,500",
        duration: "40–55 min",
      },
      {
        name: "Hand & Foot Massage",
        description: "Relaxing massage add-on before long standing at functions.",
        price: "Rs. 1,500",
        duration: "25 min",
      },
    ],
  },
  {
    id: "bridal-nails",
    emoji: "👰",
    title: "Bridal nail packages",
    services: [
      {
        name: "Bridal Manicure + Pedicure",
        description: "Matching hands and feet for your wedding week at home.",
        price: "From Rs. 6,500",
        duration: "120 min",
      },
      {
        name: "Bridal Nail Art",
        description: "Custom lace, florals, or jewels — plan with your outfit colours.",
        price: "From Rs. 3,500",
        duration: "60 min",
      },
      {
        name: "Full Nail Extension Package",
        description: "Extensions, shape, colour, and art in one bridal booking.",
        price: "From Rs. 8,000",
        duration: "120+ min",
      },
    ],
  },
];

export function allNailsServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of nailsServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
