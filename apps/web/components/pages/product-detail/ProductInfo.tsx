"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Package, Award, Shield } from "lucide-react";

interface ProductInfoProps {
  product: {
    name: string;
    description: string;
    code: string;
    catalogUrl?: string | null;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12"
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      {/* Product Details */}
      <motion.div variants={variants.fadeInLeft}>
        <Card className="p-6 sm:p-8">
        <div className="mb-6">
          <Heading level={2} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            مشخصات محصول
          </Heading>
          <div className="w-12 sm:w-16 h-1 bg-primary"></div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <Text className="text-gray-700 font-medium">نام محصول: {product.name}</Text>
          </div>
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-primary" />
            <Text className="text-gray-700 font-medium">کد محصول: {product.code}</Text>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-1" />
            <div>
              <Text className="text-gray-700 font-medium mb-2">توضیحات:</Text>
              <Text className="text-muted-foreground leading-loose">{product.description}</Text>
            </div>
          </div>
        </div>
        </Card>
      </motion.div>

      {/* Product Features */}
      <motion.div variants={variants.fadeInRight}>
        <Card className="p-6 sm:p-8">
        <div className="mb-6">
          <Heading level={2} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            ویژگی‌های کلیدی
          </Heading>
          <div className="w-12 sm:w-16 h-1 bg-primary"></div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <Text className="text-gray-700 font-medium">کیفیت برتر و استانداردهای بین‌المللی</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <Text className="text-gray-700 font-medium">قابلیت اطمینان بالا و دوام طولانی</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <Text className="text-gray-700 font-medium">نصب و راه‌اندازی آسان</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <Text className="text-gray-700 font-medium">پشتیبانی فنی ۲۴/۷</Text>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <Text className="text-gray-700 font-medium">گارانتی و خدمات پس از فروش</Text>
          </div>
        </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
