"use client";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Category } from "@/types/category.types";

interface ProductsHeaderProps {
  categories: Category[];
  activeCategorySlug: string;
  label?: string; // static page h1
}

export function ProductsHeader({ categories, activeCategorySlug }: ProductsHeaderProps) {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  const activeCategory =
    categories.find((cat) => cat.slug === activeCategorySlug) ||
    categories[0];

  return (
    <motion.div
      ref={ref}
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >

      {/* دسته‌بندی‌ها - Carousel */}
      <motion.div 
        className="py-4 sm:py-6"
        variants={variants.fadeInUp}
      >
        <CategoryCarousel
          categories={categories}
          activeCategoryId={activeCategory.id}
          cardSize="sm"
          autoplay={false}
          showNavigation={false}
          showPagination={false}
        />
      </motion.div>

      {/* Category Name and Description Section */}
      <motion.div 
        className="py-4 sm:py-6"
        variants={variants.fadeInUp}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black">
              {activeCategory.name}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {activeCategory.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
