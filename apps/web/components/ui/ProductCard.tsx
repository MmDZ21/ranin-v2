import type { Product } from "@/types/product.types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductMedia } from "@/components/ui/ProductMedia";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-200 hover:border-primary/40">
      <Link
        href={`/products/${product.slug}`}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <ProductMedia
            src={product.images?.[0]?.url}
            alt={product.images?.[0]?.alt || product.name}
            label={product.sku ?? product.modelNumber}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            imageClassName="p-5 transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:p-7"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <div className="space-y-2">
            <h3 className="min-h-10 line-clamp-2 text-sm font-semibold leading-5 text-foreground transition-colors duration-200 group-hover:text-primary sm:text-base">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between">
              <span
                className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                dir="ltr"
              >
                {product.sku ?? product.modelNumber ?? product.slug}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <div className="flex min-h-11 items-center justify-between rounded-lg px-2 text-sm font-medium text-primary transition-colors duration-200 group-hover:bg-primary/[0.06]">
              <span>مشاهده مشخصات</span>
              <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
