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

  return (
    <section className={cn("bg-transparent py-12 overflow-x-hidden", className)}>
      <div className="container overflow-x-hidden">
        {images.length === 0 ? (
          <div className="h-96 w-full overflow-hidden rounded-xl border border-border">
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
                className="h-96 w-full rounded-lg overflow-hidden"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative overflow-hidden flex h-full w-full items-center justify-center rounded-lg">
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
              
              {/* Custom Navigation Buttons */}
              <button
                onClick={() => mainSwiper?.slidePrev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              
              <button
                onClick={() => mainSwiper?.slideNext()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Thumbnail */}
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={12}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbs mt-3 h-32 w-full rounded-lg overflow-hidden"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <button className="relative overflow-hidden flex h-full w-full items-center justify-center rounded-lg">
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
          </>
        )}
      </div>
    </section>
  );
}
