import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsHeaderServer from "./ProductsHeaderServer";
import ProductsGridServer from "./ProductsGridServer";
import { productCategories } from "@/constants";
import { HeaderSkeleton, GridSkeleton } from "./skeletons";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "محصولات",
  description:
    "مشاهده و فیلتر کاتالوگ رله‌های حفاظتی و تجهیزات حفاظت الکتریکی صنعتی رانین فرایند برای پست‌ها و تابلوهای برق.",
  alternates: { canonical: "/products" },
};

interface ProductsPageProps {
  searchParams?: Promise<{ category?: string; page?: string }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = await searchParams;
  const activeCategorySlug = query?.category || productCategories[0].slug;
  const parsedPage = Number.parseInt(query?.page ?? "1", 10);
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return (
    <Container className="py-4 sm:py-8">
      <div className="flex items-center gap-2 pb-6 sm:pb-6">
        <Separator orientation="horizontal" className="!w-4 bg-primary" />
        <span className="text-sm text-primary font-bold">کاتالوگ محصولات</span>
      </div>
      <Suspense fallback={<HeaderSkeleton />}>
        <ProductsHeaderServer activeCategorySlug={activeCategorySlug} />
      </Suspense>

      {/* Products Grid */}
      <Suspense key={`${activeCategorySlug}-${currentPage}`} fallback={<GridSkeleton />}>
        <ProductsGridServer
          activeCategorySlug={activeCategorySlug}
          currentPage={currentPage}
        />
      </Suspense>
    </Container>
  );
}
