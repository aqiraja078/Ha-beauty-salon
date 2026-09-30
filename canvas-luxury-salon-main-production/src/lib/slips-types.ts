export type SlipPaymentMethod =
  | "cash"
  | "bank"
  | "jazzcash"
  | "easypaisa"
  | "card"
  | "other";

export const SLIP_PAYMENT_LABELS: Record<SlipPaymentMethod, string> = {
  cash: "Cash",
  bank: "Bank transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  card: "Card",
  other: "Other",
};

export type SlipItem = {
  id: string;
  description: string;
  qty: number;
  price: number;
};

export type SlipClient = {
  name: string;
  phone: string;
  email: string;
  address: string;
  idCard: string;
};

export type Slip = {
  id: string;
  /** Long random id used in the public link `/slip/<publicId>`. */
  publicId: string;
  /** Human number, e.g. ADAA-0007. */
  number: string;
  /** Slip date, YYYY-MM-DD. */
  date: string;
  client: SlipClient;
  /** Appointment / service date + time, free text (optional). */
  appointment: string;
  /** Artist / staff who served (optional). */
  staff: string;
  items: SlipItem[];
  discount: number;
  advance: number;
  paymentMethod: SlipPaymentMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type SlipInput = Omit<
  Slip,
  "id" | "publicId" | "number" | "createdAt" | "updatedAt"
>;
