"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { MapPin } from "lucide-react";

export function ContactMap() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.3,
    textDuration: 0.8,
    imageDuration: 1.0,
  });

  return (
    <motion.div 
      ref={ref}
      className="mt-12 sm:mt-16"
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      <motion.div 
        className="text-center mb-6 sm:mb-8"
        variants={variants.fadeInUp}
      >
        <Heading level={2} className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          موقعیت ما
        </Heading>
        <div className="w-16 sm:w-20 h-1 bg-primary mx-auto mb-3 sm:mb-4"></div>
      </motion.div>
      <motion.div 
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl"
        variants={variants.scale}
      >
        <div className="aspect-[4/3] sm:aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div 
              className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
              variants={variants.fadeInUp}
            >
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <motion.div variants={variants.fadeInUp}>
              <Text className="text-base sm:text-lg font-bold text-gray-700 mb-2">نقشه موقعیت دفتر مرکزی</Text>
            </motion.div>
            <motion.div variants={variants.fadeInUp}>
              <Text className="text-muted-foreground text-sm sm:text-base">
                تهران، خیابان ولیعصر، پلاک ۱۲۳۴
              </Text>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
