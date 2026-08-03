import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsHeaderServer from "./ProductsHeaderServer";
import ProductsGridServer from "./ProductsGridServer";
import { ProductsFilters } from "@/components/pages/products/ProductsFilters";
import { productCategories } from "@/constants";
import { HeaderSkeleton, GridSkeleton } from "./skeletons";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "محصولات",
  description:
    "مشاهده و فیلتر کاتالوگ رله‌های حفاظتی و تجهیزات حفاظت الکتریکی صنعتی رانین فرایند برای پست‌ها و تابلوهای برق.",
  alternates: { canonical: "/products" },
};

interface ProductsPageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  // Get active category slug from query params
  const activeCategorySlug =
    (await searchParams)?.category || productCategories[0].slug;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex items-center gap-2 pb-6 sm:pb-6">
        <Separator orientation="horizontal" className="!w-4 bg-primary" />
        <h1 className="text-sm text-primary font-bold">محصولات</h1>
      </div>
      <Suspense fallback={<HeaderSkeleton />}>
        <ProductsHeaderServer activeCategorySlug={activeCategorySlug} />
      </Suspense>

      {/* Filter and Sort Controls */}
      <div className="py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:gap-0">
          <ProductsFilters />
        </div>
      </div>

      {/* Products Grid */}
      <Suspense fallback={<GridSkeleton />}>
        <ProductsGridServer activeCategorySlug={activeCategorySlug} />
      </Suspense>
    </div>
  );
}
