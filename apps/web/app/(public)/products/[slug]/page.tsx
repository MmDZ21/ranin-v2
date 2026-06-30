import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/actions/products";
import ProductImages from "@/components/pages/product-detail/ProductImages";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProduct(slug);
  const product = result.success ? result.data : undefined;

  if (!product) {
    return { title: "محصول یافت نشد" };
  }

  const title =
    product.metaTitle ||
    `${product.name}${product.sku ? ` (${product.sku})` : ""}`;
  const description =
    product.metaDescription ||
    product.shortDesc ||
    `مشخصات و اطلاعات فنی ${product.name}`;
  const image = product.images?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      url: `/products/${slug}`,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const productResult = await getProduct(slug);
  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;
  const galleryImages =
    product.images && product.images.length
      ? product.images
      : [{ url: "/images/relay.png", alt: product.name }];

  return (
    <div className="container mx-auto px-4 pt-8 pb-12">
      <div className="flex items-center gap-2 pb-6 sm:pb-8">
        <Separator orientation="horizontal" className="!w-4 bg-primary" />
        <h2 className="text-sm text-primary font-bold">جزئیات محصول</h2>
      </div>
      <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">
        <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl">{product.name}</h1>
            <div className="bg-gray-200 p-2 w-fit rounded-xl">
              <p className="tracking-wider text-muted-foreground text-xs sm:text-sm">{product.sku}</p>
            </div>
          </div>
          <div className="min-w-0">
            <ProductImages images={galleryImages} />
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-8 lg:space-y-16">
          <div className="space-y-6 lg:space-y-10">
            <h2 className="font-semibold text-xl sm:text-2xl">مشخصات فنی محصول</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {product.specs &&
                Object.entries(product.specs).map(([label, value], i) => (
                  <div
                    className="bg-gray-200 rounded-xl p-3 sm:p-4 flex flex-col gap-2 justify-center items-center lg:items-start"
                    key={i}
                  >
                    <h6 className="font-semibold text-sm sm:text-base">{label}</h6>
                    <p className="text-muted-foreground text-sm sm:text-base">{value}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-start">
            <Button size="lg" className="w-full sm:w-auto sm:min-w-[290px]">تماس بگیرید</Button>
          </div>
          {product.features && product.features.length > 0 && (
            <div className="space-y-6 lg:space-y-10">
              <h2 className="font-semibold text-xl sm:text-2xl">ویژگی‌های محصول</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {product.features.map((feature, i) => (
                  <div className="flex gap-2" key={i}>
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm sm:text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
