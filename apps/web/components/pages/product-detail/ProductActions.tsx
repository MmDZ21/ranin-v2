"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Download, Phone, MessageSquare, ShoppingCart } from "lucide-react";

interface ProductActionsProps {
  product: {
    name: string;
    code: string;
    catalogUrl?: string | null;
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  return (
    <motion.div 
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      {/* Contact Actions */}
      <motion.div variants={variants.fadeInLeft}>
        <Card className="p-6 sm:p-8">
        <div className="mb-6">
          <Heading level={2} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            تماس و مشاوره
          </Heading>
          <div className="w-12 sm:w-16 h-1 bg-primary"></div>
        </div>
        
        <div className="space-y-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white">
            <Phone className="w-4 h-4" />
            تماس تلفنی
          </Button>
          <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <MessageSquare className="w-4 h-4" />
            درخواست مشاوره
          </Button>
          <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <ShoppingCart className="w-4 h-4" />
            درخواست قیمت
          </Button>
        </div>
        </Card>
      </motion.div>

      {/* Download Actions */}
      <motion.div variants={variants.fadeInRight}>
        <Card className="p-6 sm:p-8">
        <div className="mb-6">
          <Heading level={2} className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            دانلود و مستندات
          </Heading>
          <div className="w-12 sm:w-16 h-1 bg-primary"></div>
        </div>
        
        <div className="space-y-4">
          {product.catalogUrl && (
            <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              دانلود کاتالوگ
            </Button>
          )}
          <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            دانلود راهنمای نصب
          </Button>
          <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            دانلود گواهی کیفیت
          </Button>
        </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
