import { getProduct } from "@/actions/products";
import ProductImages from "@/components/pages/product-detail/ProductImages";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product using server action
  const productResult = await getProduct(slug);

  if (!productResult.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            خطا در بارگذاری محصول
          </h2>
          <p className="text-gray-600">{productResult.error}</p>
        </div>
      </div>
    );
  }

  if (!productResult.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            محصول یافت نشد
          </h2>
          <p className="text-gray-500">
            محصول مورد نظر شما وجود ندارد یا حذف شده است.
          </p>
        </div>
      </div>
    );
  }

  const product = productResult.data;
  console.log(product)
  const dummyImages = [
    { url: "/images/relay.png", alt: "Slide 1" },
    { url: "/images/relay.png", alt: "Slide 2" },
    { url: "/images/relay.png", alt: "Slide 3" },
  ];

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
            <ProductImages
              images={
                product.images && product.images.length
                  ? product.images
                  : dummyImages
              }
            />
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-8 lg:space-y-16">
          <div className="space-y-6 lg:space-y-10">
            <h2 className="font-semibold text-xl sm:text-2xl">مشخصات فنی محصول</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {product.specs && Object.entries(product.specs).map(([label, value], i) => (
                <div className="bg-gray-200 rounded-xl p-3 sm:p-4 flex flex-col gap-2 justify-center items-center lg:items-start" key={i}>
                  <h6 className="font-semibold text-sm sm:text-base">{label}</h6>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {value}
                  </p>
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
