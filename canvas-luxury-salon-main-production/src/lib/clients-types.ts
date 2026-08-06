export type SalonClient = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  /** CNIC / ID card number. */
  idCard?: string;
  area?: string;
  address?: string;
  notes?: string;
  /** Free-text preferred services / preferences. */
  preferences?: string;
  createdAt: string;
  updatedAt: string;
};

export type SalonClientInput = {
  name: string;
  phone?: string;
  email?: string;
  idCard?: string;
  area?: string;
  address?: string;
  notes?: string;
  preferences?: string;
};
