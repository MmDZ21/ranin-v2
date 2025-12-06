import { getCategories, getProductsByCategory } from "@/actions/products";
import { ProductsGrid } from "@/components/pages/products/ProductsGrid";

// Cache products per category for shorter period than categories
export const revalidate = 300; // 5 minutes
export const fetchCache = "force-cache";

export default async function ProductsGridServer({ activeCategorySlug }: { activeCategorySlug: string }) {
  const categoriesResult = await getCategories();
  if (!categoriesResult.success || !categoriesResult.data || categoriesResult.data.length === 0) {
    return (
      <div className="py-6">
        <div className="text-center text-sm text-gray-500">خطا در بارگذاری محصولات</div>
      </div>
    );
  }

  const categories = categoriesResult.data;
  const activeCategory = categories.find((c) => c.slug === activeCategorySlug) || categories[0];
  const productsResult = await getProductsByCategory(activeCategory.id);

  if (!productsResult.success || !productsResult.data) {
    return (
      <div className="py-6">
        <div className="text-center text-sm text-gray-500">محصولی برای نمایش وجود ندارد</div>
      </div>
    );
  }

  return <ProductsGrid products={productsResult.data} />;
}
