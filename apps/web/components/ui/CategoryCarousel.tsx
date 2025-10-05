"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { productCategories, ProductCategoryType } from "@/constants";
import CategoryCard, { CategoryCardProps } from "./CategoryCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CategoryCarouselProps {
  activeCategoryId?: string;
  onCategoryClick?: (category: ProductCategoryType) => void;
  cardSize?: CategoryCardProps["size"];
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export default function CategoryCarousel({
  activeCategoryId,
  cardSize = "md",
  autoplay = true,
  autoplayDelay = 5000,
  showNavigation = true,
  showPagination = true,
}: CategoryCarouselProps) {
  return (
    <div className="w-full relative">
      {/* Carousel Header with Scroll Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            دسته‌بندی محصولات
          </h3>
          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span>برای مشاهده بیشتر بکشید</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span>8 دسته‌بندی</span>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={12}
        slidesPerView={1}
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        pagination={
          showPagination
            ? {
                clickable: true,
                bulletClass: "swiper-pagination-bullet !bg-gray-300",
                bulletActiveClass:
                  "swiper-pagination-bullet-active !bg-primary",
              }
            : false
        }
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
              }
            : false
        }
        breakpoints={{
          320: {
            slidesPerView: 1.2,
            spaceBetween: 8,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 16,
          },
        }}
        className="category-swiper"
      >
        {productCategories.map((category) => (
          <SwiperSlide className="py-2" key={category.id}>
            <div
              className={`relative bg-transparent ${
                activeCategoryId === category.id
                  ? " rounded-xl"
                  : ""
              }`}
            >
              <CategoryCard
                title={category.name}
                description={category.description}
                categoryHref={`/products?category=${category.slug}`}
                productCount={`${category.productCount} محصول`}
                imageSrc="/images/relay.png"
                size={cardSize}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {showNavigation && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <button className="swiper-button-prev !relative !top-0 !left-0 !w-8 !h-8 sm:!w-10 sm:!h-10 !mt-0 !bg-white !border !border-gray-300 !rounded-full !shadow-md hover:!bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button className="swiper-button-next !relative !top-0 !right-0 !w-8 !h-8 sm:!w-10 sm:!h-10 !mt-0 !bg-white !border !border-gray-300 !rounded-full !shadow-md hover:!bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Custom Pagination */}
      {showPagination && (
        <div className="swiper-pagination !relative !bottom-0 !mt-4"></div>
      )}

      {/* Scroll Indicator */}
      <div className="flex justify-center mt-3 sm:mt-4">
        <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-400">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <span className="hidden sm:inline">اسکرول کنید</span>
          <span className="sm:hidden">بکشید</span>
          <svg
            className="w-3 h-3 scroll-hint"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
