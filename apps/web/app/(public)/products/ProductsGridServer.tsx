import { getCategories, getProductsByCategory } from "@/actions/products";
import { ProductsGrid } from "@/components/pages/products/ProductsGrid";
import { ProductsPagination } from "@/components/pages/products/ProductsPagination";
import { redirect } from "next/navigation";

// Cache products per category for shorter period than categories
export const revalidate = 300; // 5 minutes
export const fetchCache = "force-cache";

const PAGE_SIZE = 12;

export default async function ProductsGridServer({
  activeCategorySlug,
  currentPage,
}: {
  activeCategorySlug: string;
  currentPage: number;
}) {
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
  const productsResult = await getProductsByCategory(
    activeCategory.id,
    currentPage,
    PAGE_SIZE,
  );

  if (!productsResult.success || !productsResult.data) {
    return (
      <div className="py-6">
        <div className="text-center text-sm text-gray-500">محصولی برای نمایش وجود ندارد</div>
      </div>
    );
  }

  const { items, total } = productsResult.data;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (totalPages > 0 && currentPage > totalPages) {
    redirect(
      `/products?category=${encodeURIComponent(activeCategory.slug)}&page=${totalPages}`,
    );
  }

  return (
    <div className="pb-10 sm:pb-14">
      <ProductsGrid products={items} />
      <ProductsPagination
        categorySlug={activeCategory.slug}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        totalItems={total}
        totalPages={totalPages}
      />
    </div>
  );
}
