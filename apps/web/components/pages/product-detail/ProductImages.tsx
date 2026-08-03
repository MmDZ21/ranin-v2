"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { cn } from "@/lib/utils";
import {
  ProductMedia,
  ProductMediaFallback,
} from "@/components/ui/ProductMedia";

type ProductImage = { src?: string; url?: string; alt?: string | null };

export default function ProductImages({
  images = [],
  fallbackLabel,
  className = "",
}: {
  images?: ProductImage[];
  fallbackLabel?: string | null;
  className?: string;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
  const hasMultipleImages = images.length > 1;

  return (
    <section
      className={cn("overflow-x-hidden bg-transparent", className)}
      aria-label="تصاویر محصول"
    >
      <div className="overflow-x-hidden">
        {images.length === 0 ? (
          <div className="aspect-square w-full overflow-hidden rounded-xl border border-border sm:aspect-[4/3]">
            <ProductMediaFallback label={fallbackLabel} variant="detail" />
          </div>
        ) : (
          <>
            <div className="relative">
              <Swiper
                onSwiper={setMainSwiper}
                loop={true}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[4/3]"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                      <ProductMedia
                        src={image.src ?? image.url}
                        alt={image.alt || fallbackLabel || "تصویر محصول"}
                        label={fallbackLabel}
                        variant="detail"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        imageClassName="p-4"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {hasMultipleImages ? (
                <>
                  <button
                    type="button"
                    onClick={() => mainSwiper?.slideNext()}
                    className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-background/95 text-foreground shadow-theme-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="تصویر بعدی"
                  >
                    <ChevronRight className="size-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => mainSwiper?.slidePrev()}
                    className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-background/95 text-foreground shadow-theme-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="تصویر قبلی"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                </>
              ) : null}
            </div>

            {hasMultipleImages ? (
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs mt-3 h-20 w-full overflow-hidden sm:h-24"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={image.url ?? image.src ?? index}>
                    <button
                      type="button"
                      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`نمایش تصویر ${index + 1}`}
                    >
                      <ProductMedia
                        src={image.src ?? image.url}
                        alt={image.alt || fallbackLabel || "تصویر محصول"}
                        label={fallbackLabel}
                        variant="compact"
                        sizes="(max-width: 1024px) 25vw, 13vw"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
