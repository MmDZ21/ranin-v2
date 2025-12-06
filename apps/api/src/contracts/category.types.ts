// Shared types for Category

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryCount {
  products: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  products?: ProductSummary[];
  _count?: CategoryCount;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;


