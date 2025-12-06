// Shared types for Product

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  order: number;
}

export interface CatalogFile {
  id: string;
  url: string;
  filename: string;
  size?: number | null;
  mimeType?: string | null;
}

export interface Product {
  id: string;
  sku?: string | null;
  name: string;
  slug: string;
  shortDesc?: string | null;
  longDesc?: string | null;
  brand?: string | null;
  modelNumber?: string | null;
  categoryId?: string | null;
  specs?: Record<string, string> | null;
  tags: string[];
  features: string[];
  images?: ProductImage[];
  catalogs?: CatalogFile[];
  published: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface CreateProductInput {
  sku?: string;
  name: string;
  slug: string;
  shortDesc?: string;
  longDesc?: string;
  brand?: string;
  modelNumber?: string;
  categoryId?: string;
  specs?: Record<string, string>;
  tags?: string[];
  features?: string[];
  published?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;


