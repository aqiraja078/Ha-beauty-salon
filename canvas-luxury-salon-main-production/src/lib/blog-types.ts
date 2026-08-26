export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt?: string;
  body: string;
  category?: string;
  tags?: string[];
  author?: string;
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
  category?: string;
  tags?: string[] | string;
  author?: string;
  published?: boolean;
};
