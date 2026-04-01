/** Featured makeup packages on the home page (hero below). */
export type HomeMakeupCard = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export const homeMakeupCards: HomeMakeupCard[] = [
  {
    id: "bridal-barat",
    name: "Bridal Makeup Barat",
    price: "From Rs. 18,000",
    image:
      "https://i.pinimg.com/1200x/68/64/65/68646592ddaac1f191d4100112a100e5.jpg",
  },
  {
    id: "bridal-walima",
    name: "Bridal Makeup Walima",
    price: "From Rs. 15,000",
    image:
      "https://i.pinimg.com/736x/ae/98/b3/ae98b360d36f7de2f3779737997f291a.jpg",
  },
  {
    id: "nikkah-engagement",
    name: "Nikkah & Engagement Makeup",
    price: "From Rs. 10,000",
    image:
      "https://i.pinimg.com/736x/b8/21/e7/b821e7e61a24e9f629029d037437bd37.jpg",
  },
  {
    id: "party",
    name: "Party Makeup",
    price: "From Rs. 7,000",
    image:
      "https://i.pinimg.com/736x/ad/3c/57/ad3c5725b10916fc21efc5d54f411654.jpg",
  },
  {
    id: "mehndi-makeup",
    name: "Mehndi Makeup",
    price: "From Rs. 12,000",
    image:
      "https://i.pinimg.com/1200x/c9/b1/1b/c9b11bbc7661272bc5f82134fc037e09.jpg",
  },
];

export function allHomeMakeupCardNames(): string[] {
  return homeMakeupCards.map((c) => c.name);
}
