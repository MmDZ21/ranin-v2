"use client";

import CategoryCard from "@/components/ui/CategoryCard";

export interface Category {
  title: string;
  description: string;
  icon: "plug" | "lightning" | "shield";
  categoryHref: string;
  productCount?: string;
}

interface ProductsCategoriesProps {
  categories: Category[];
  ctaText: string;
  ctaHref: string;
}

export default function ProductsCategories({
  categories,
}: ProductsCategoriesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, i) => (
        <CategoryCard
          key={i}
          title={category.title}
          description={category.description}
          categoryHref={category.categoryHref}
          productCount={category.productCount}
        />
      ))}
    </div>
  );
}
