import { productCategories } from "@/constants";
import { ProductsHeader } from "@/components/pages/products/ProductsHeader";
import { ProductsFilters } from "@/components/pages/products/ProductsFilters";
import { ProductsGrid } from "@/components/pages/products/ProductsGrid";

interface ProductsPageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // دسته فعال از query param
  const activeCategorySlug =
    (await searchParams)?.category || productCategories[0].slug;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <ProductsHeader activeCategorySlug={activeCategorySlug} />
      
      {/* Filter and Sort Controls */}
      <div className="py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:gap-0">
          <ProductsFilters />
        </div>
      </div>
      
      {/* محصولات دسته فعال */}
      <ProductsGrid activeCategorySlug={activeCategorySlug} />
    </div>
  );
}
