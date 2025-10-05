"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";

interface ProductHeaderProps {
  product: {
    name: string;
    description: string;
    code: string;
    catalogUrl?: string | null;
  };
}

export function ProductHeader({ product }: ProductHeaderProps) {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  return (
    <motion.div
      ref={ref}
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      <motion.div 
        className="flex items-center gap-2 pb-6 sm:pb-8"
        variants={variants.fadeInUp}
      >
        <Separator orientation="horizontal" className="!w-4 bg-primary" />
        <h1 className="text-sm text-primary font-bold">جزئیات محصول</h1>
      </motion.div>
      
      <motion.div 
        className="mb-6 sm:mb-8"
        variants={variants.fadeInUp}
      >
        <Heading level={1} className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
          {product.name}
        </Heading>
        <div className="w-16 sm:w-20 h-1 bg-primary mb-4"></div>
        <Text className="text-base sm:text-lg text-muted-foreground leading-loose mb-4">
          {product.description}
        </Text>
        <Text className="text-sm sm:text-base text-gray-500 font-medium">
          کد محصول: {product.code}
        </Text>
      </motion.div>
    </motion.div>
  );
}
