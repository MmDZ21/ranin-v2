"use client";

import { Product } from "@/types/product.types";
import ProductCard from "@/components/ui/ProductCard";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.1,
    textDuration: 0.4,
  });

  return (
    <motion.div 
      ref={ref}
      className="py-4 sm:py-6"
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            محصولی یافت نشد
          </h3>
          <p className="text-gray-500">
            در این دسته‌بندی محصولی موجود نیست.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={variants.scale}
              custom={index}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
