export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
  body: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostInput = {
  title: string;
  slug?: string;
  coverImage?: string;
  excerpt?: string;
  body?: string;
  published?: boolean;
};
