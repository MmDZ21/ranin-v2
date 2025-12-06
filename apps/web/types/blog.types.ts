// Shared types for Blog

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface BlogPostImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  status: PostStatus;
  publishedAt?: string | null; // ISO
  authorId: string;
  metaTitle?: string | null;
  metaDesc?: string | null;
  featured: boolean;
  tags?: string[];
  images?: BlogPostImage[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status?: PostStatus;
  publishedAt?: string; // ISO
  authorId: string;
  metaTitle?: string;
  metaDesc?: string;
  featured?: boolean;
  tagIds?: string[];
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;


