"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { cn } from "@/lib/utils";

type ProductImage = { src?: string; url?: string; alt?: string | null };

export default function ProductImages({
  images = [],
  className = "",
}: {
  images?: ProductImage[];
  className?: string;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);

  return (
    <section className={cn("bg-transparent py-12 overflow-x-hidden", className)}>
      <div className="container overflow-x-hidden">
        {images.length === 0 ? (
          <div className="h-96 w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500">
            No images available
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
                      <Image
                        src={image.src ?? image.url ?? ""}
                        alt={image.alt ?? ""}
                        className="block h-full w-full object-contain"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
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
                    <Image
                      src={image.src ?? image.url ?? ""}
                      alt={image.alt ?? ""}
                      className="block h-full w-full object-contain"
                      fill
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
