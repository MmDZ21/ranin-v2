"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Phone, Mail, MapPin } from "lucide-react";
import { ABOUT_CONTACT_ITEMS } from "@/constants";

export function AboutContact() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  return (
    <Container className="py-8 sm:py-12">
      <motion.div 
        ref={ref}
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl"
        initial="offscreen"
        animate={animate}
        variants={variants.fadeInUp}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90"></div>
        <motion.div 
          className="relative p-6 sm:p-8 lg:p-12 text-white"
          variants={variants.container}
        >
          <motion.div 
            className="text-center mb-6 sm:mb-8"
            variants={variants.fadeInUp}
          >
            <Heading level={2} className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              آماده همکاری با شما هستیم
            </Heading>
            <Text className="text-white/90 text-sm sm:text-base font-light px-4">
              برای کسب اطلاعات بیشتر و مشاوره رایگان با ما تماس بگیرید
            </Text>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {ABOUT_CONTACT_ITEMS.map((item, idx) => (
              <motion.div key={idx} className="flex items-center gap-3 sm:gap-4" variants={variants.fadeInUp}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.icon === "phone" && <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  {item.icon === "mail" && <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                  {item.icon === "map" && <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                </div>
                <div>
                  <Text className="text-xs sm:text-sm font-medium text-white/90 mb-1">{item.label}</Text>
                  <Text className="text-white font-semibold text-sm sm:text-base">{item.value}</Text>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
}
