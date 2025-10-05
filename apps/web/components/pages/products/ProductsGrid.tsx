"use client";

import { productCategories } from "@/constants";
import ProductCard from "@/components/ui/ProductCard";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";

interface ProductsGridProps {
  activeCategorySlug: string;
}

export function ProductsGrid({ activeCategorySlug }: ProductsGridProps) {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.1,
    textDuration: 0.4,
  });

  const activeCategory =
    productCategories.find((cat) => cat.slug === activeCategorySlug) ||
    productCategories[0];

  return (
    <motion.div 
      ref={ref}
      className="py-4 sm:py-6"
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {activeCategory.products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={variants.scale}
            custom={index}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
