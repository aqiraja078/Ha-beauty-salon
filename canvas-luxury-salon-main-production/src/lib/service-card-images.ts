export type ServiceImageTheme = "hair" | "makeup" | "facial" | "bodySpa";

/** Hero photo used on the right side of each luxury service hero. */
export const SERVICE_HERO_IMAGE: Record<ServiceImageTheme, string> = {
  makeup:
    "https://i.pinimg.com/736x/86/87/9c/86879c401e8248877e6a6f3065c08118.jpg",
  hair: "https://i.pinimg.com/736x/2c/a0/25/2ca0258ddeef532121c97c579a897541.jpg",
  facial:
    "https://i.pinimg.com/736x/90/c2/ca/90c2ca7d26c07a57933640fac0b9173b.jpg",
  bodySpa:
    "https://i.pinimg.com/736x/81/6d/df/816ddf871f37612426c401d39c55d22f.jpg",
};

/** Kept for existing imports. */
export const MAKEUP_HERO_IMAGE = SERVICE_HERO_IMAGE.makeup;

const u = (id: string, w = 700) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

/** Card image pools per category (all URLs verified reachable). */
const POOLS: Record<ServiceImageTheme, string[]> = {
  makeup: [
    u("1487412947147-5cebf100ffc2"),
    u("1516975080664-ed2fc6a32937"),
    u("1596462502278-27bfdc403348"),
    u("1522337360788-8b13dee7a37e"),
    u("1529626455594-4ff0802cfb7e"),
    u("1519741497674-611481863552"),
    u("1469334031218-e382a71b716b"),
    u("1522335789203-aabd1fc54bc9"),
  ],
  hair: [
    u("1562322140-8baeececf3df"),
    u("1595476108010-b4d1f102b1b1"),
    u("1519415943484-9fa1873496d4"),
    u("1596755389378-c31d21fd1273"),
    u("1560066984-138dadb4c035"),
    u("1633681926022-84c23e8cb2d6"),
  ],
  facial: [
    u("1512290923902-8a9f81dc236c"),
    u("1596755389378-c31d21fd1273"),
    u("1519415943484-9fa1873496d4"),
    u("1633681926022-84c23e8cb2d6"),
  ],
  bodySpa: [
    u("1544161515-4ab6ce6db874"),
    u("1512290923902-8a9f81dc236c"),
    u("1596462502278-27bfdc403348"),
    u("1560066984-138dadb4c035"),
  ],
};

/** Named makeup overrides so the original makeup menu keeps its exact photos. */
const MAKEUP_NAMED: Record<string, string> = {
  "Festive Makeup": POOLS.makeup[0],
  "Party Makeup": POOLS.makeup[1],
  "Mehndi Makeup": POOLS.makeup[2],
  "Nikkah & Engagement Makeup": POOLS.makeup[3],
  "Signature Bridal Package Barat": POOLS.makeup[4],
  "Bridal Makeup Barat": POOLS.makeup[5],
  "Exclusive Bridal Package": POOLS.makeup[6],
  "Luxury Bridal Package Barat": POOLS.makeup[7],
};

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

/** Stable image for a service card; same name always gets the same photo. */
export function serviceCardImage(
  theme: ServiceImageTheme,
  name: string,
  index = 0
): string {
  if (theme === "makeup" && MAKEUP_NAMED[name]) return MAKEUP_NAMED[name];
  const pool = POOLS[theme];
  return pool[(hash(name) + index) % pool.length];
}

/** Kept for existing imports. */
export function makeupServiceImage(name: string): string {
  return serviceCardImage("makeup", name);
}
