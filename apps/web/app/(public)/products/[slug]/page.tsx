import { productCategories } from "@/constants";
import { ProductHeader } from "@/components/pages/product-detail/ProductHeader";
import { ProductInfo } from "@/components/pages/product-detail/ProductInfo";
import { ProductActions } from "@/components/pages/product-detail/ProductActions";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } =await params;

  // جستجو در همه محصولات
  const product = productCategories
    .flatMap((cat) => cat.products)
    .find((p) => p.slug === slug);

  if (!product) return <div className="p-8">محصول یافت نشد.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductHeader product={product} />
      <ProductInfo product={product} />
      <ProductActions product={product} />
    </div>
  );
}
