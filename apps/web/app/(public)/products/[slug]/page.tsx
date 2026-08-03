import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductsByCategory } from "@/actions/products";
import ProductImages from "@/components/pages/product-detail/ProductImages";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  Download,
  FileText,
  MessageSquareText,
  PackageSearch,
} from "lucide-react";

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
  const galleryImages = product.images ?? [];
  const category = product.category;
  const categoryId = product.categoryId ?? category?.id;
  const relatedResult = categoryId
    ? await getProductsByCategory(categoryId, 1, 5)
    : undefined;
  const relatedProducts =
    relatedResult?.success && relatedResult.data
      ? relatedResult.data.items
          .filter((relatedProduct) => relatedProduct.id !== product.id)
          .slice(0, 4)
      : [];
  const specs = product.specs ? Object.entries(product.specs) : [];
  const catalogs = product.catalogs ?? [];
  const productCode = product.sku ?? product.modelNumber;

  return (
    <main className="pb-16 sm:pb-20">
      <Container className="pt-5 sm:pt-8">
        <Breadcrumb className="mb-6 sm:mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">خانه</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/products">محصولات</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {category ? (
              <>
                <BreadcrumbSeparator>
                  <ChevronLeft />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/products?category=${encodeURIComponent(category.slug)}&page=1`}>
                      {category.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            ) : null}
            <BreadcrumbSeparator>
              <ChevronLeft />
            </BreadcrumbSeparator>
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="max-w-56 truncate sm:max-w-md">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <ProductImages images={galleryImages} fallbackLabel={productCode} />
          </div>

          <section className="min-w-0 lg:col-span-5" aria-labelledby="product-title">
            <div className="border-b border-border pb-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {category ? (
                  <Link
                    href={`/products?category=${encodeURIComponent(category.slug)}&page=1`}
                    className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {category.name}
                  </Link>
                ) : null}
                {product.brand ? (
                  <span className="text-sm text-muted-foreground">{product.brand}</span>
                ) : null}
              </div>

              <h1
                id="product-title"
                className="text-balance text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl"
              >
                {product.name}
              </h1>

              {productCode ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>کد محصول</span>
                  <span
                    className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-medium text-foreground"
                    dir="ltr"
                  >
                    {productCode}
                  </span>
                </div>
              ) : null}
            </div>

            {product.shortDesc || product.longDesc ? (
              <div className="border-b border-border py-6">
                <p className="max-w-[70ch] whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
                  {product.shortDesc ?? product.longDesc}
                </p>
              </div>
            ) : null}

            <div className="py-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">استعلام فنی و قیمت</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  کد محصول و تعداد موردنیاز را برای بررسی موجودی و دریافت پیشنهاد ثبت کنید.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button asChild size="lg" className="min-h-11 flex-1">
                  <Link href="/contact#quote-form">
                    <MessageSquareText />
                    ثبت درخواست استعلام
                  </Link>
                </Button>
                {catalogs[0] ? (
                  <Button asChild variant="outline" size="lg" className="min-h-11 flex-1">
                    <a href={catalogs[0].url} target="_blank" rel="noreferrer">
                      <Download />
                      دانلود کاتالوگ
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            {catalogs.length > 1 ? (
              <div className="border-t border-border pt-5">
                <h2 className="mb-3 text-sm font-semibold text-foreground">فایل‌های فنی</h2>
                <ul className="space-y-2">
                  {catalogs.slice(1).map((catalog) => (
                    <li key={catalog.id}>
                      <a
                        href={catalog.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-11 items-center justify-between gap-4 rounded-lg px-3 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <FileText className="size-4 shrink-0 text-primary" />
                          <span className="truncate">{catalog.filename}</span>
                        </span>
                        <ArrowLeft className="size-4 shrink-0 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        </div>

        <div className="mt-14 grid gap-10 border-t border-border pt-10 sm:mt-16 sm:pt-12 lg:grid-cols-12 lg:gap-12">
          <section className="lg:col-span-7" aria-labelledby="specifications-title">
            <div className="mb-5">
              <h2 id="specifications-title" className="text-xl font-bold text-foreground sm:text-2xl">
                مشخصات فنی
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                مقادیر ثبت‌شده برای این مدل را پیش از سفارش بررسی کنید.
              </p>
            </div>

            {specs.length > 0 ? (
              <dl className="overflow-hidden rounded-xl border border-border bg-card">
                {specs.map(([label, value], index) => (
                  <div
                    key={label}
                    className={`grid gap-1 px-4 py-3.5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-6 sm:px-5 ${
                      index > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-semibold text-foreground sm:text-left" dir="auto">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="flex min-h-32 items-center gap-4 rounded-xl border border-dashed border-border bg-muted/40 p-5">
                <PackageSearch className="size-6 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">مشخصات تکمیلی در حال آماده‌سازی است</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    برای دریافت اطلاعات فنی این مدل، درخواست استعلام ثبت کنید.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className="lg:col-span-5" aria-labelledby="features-title">
            <div className="mb-5">
              <h2 id="features-title" className="text-xl font-bold text-foreground sm:text-2xl">
                ویژگی‌های محصول
              </h2>
            </div>

            {product.features.length > 0 ? (
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-7 text-foreground sm:text-base">
                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border bg-muted/40 p-5 text-sm leading-6 text-muted-foreground">
                ویژگی تکمیلی برای این محصول ثبت نشده است. برای انتخاب مدل مناسب با تیم فنی تماس بگیرید.
              </p>
            )}
          </section>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-14 border-t border-border pt-10 sm:mt-16 sm:pt-12" aria-labelledby="related-products-title">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 id="related-products-title" className="text-xl font-bold text-foreground sm:text-2xl">
                  محصولات مرتبط
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  مدل‌های دیگر در همین گروه محصولی
                </p>
              </div>
              {category ? (
                <Link
                  href={`/products?category=${encodeURIComponent(category.slug)}&page=1`}
                  className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
                >
                  مشاهده همه
                  <ArrowLeft className="size-4" />
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
