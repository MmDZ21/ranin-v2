import CategoryCard from "@/components/ui/CategoryCard";
import { Category } from "@/types/category.types";

interface ProductsCategoriesProps {
  categories: Category[];
}

export default function ProductsCategories({ categories }: ProductsCategoriesProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">هیچ دسته‌بندی‌ای یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.name}
          description={category.description || ""}
          categoryHref={"products?category=" + category.slug}
          productCount={category._count?.products?.toString()}
        />
      ))}
    </div>
  );
}
