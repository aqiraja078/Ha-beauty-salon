export type Course = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  price?: string;
  duration?: string;
  level?: string;
  description: string;
  whatsappNote?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseInput = {
  title: string;
  slug?: string;
  coverImage?: string;
  price?: string;
  duration?: string;
  level?: string;
  description?: string;
  whatsappNote?: string;
  published?: boolean;
};
