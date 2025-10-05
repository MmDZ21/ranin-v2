"use client";

import { Container } from "@/components/ui/Container";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import Image from "next/image";

export function ContactHero() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.3,
    textDuration: 0.8,
    imageDuration: 1.0,
  });

  return (
    <div className="bg-white">
      <Container className="py-8 sm:py-12">
        {/* Header Section */}
        <motion.div 
          ref={ref}
          className="flex items-center gap-2 pb-6 sm:pb-8"
          initial="offscreen"
          animate={animate}
          variants={variants.fadeInUp}
        >
          <Separator orientation="horizontal" className="!w-4 bg-primary" />
          <h1 className="text-sm text-primary font-bold">تماس با ما</h1>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          className="relative mb-12 sm:mb-16"
          initial="offscreen"
          animate={animate}
          variants={variants.scale}
        >
          <div className="aspect-[4/3] sm:aspect-[16/6] rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl">
            <Image
              src="/images/parallax.png"
              alt="تماس با ما - رانین فرایند"
              width={1200}
              height={450}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
          </div>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center px-4"
            initial="offscreen"
            animate={animate}
            variants={variants.container}
          >
            <div className="text-center text-white">
              <motion.div variants={variants.fadeInUp}>
                <Heading level={1} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight">
                  با ما در تماس باشید
                </Heading>
              </motion.div>
              <motion.div variants={variants.fadeInUp}>
                <div className="w-16 sm:w-20 h-1 bg-white mx-auto mb-4 sm:mb-6"></div>
              </motion.div>
              <motion.div variants={variants.fadeInUp}>
                <Text className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-loose font-light">
                  تیم متخصص ما آماده پاسخگویی به سوالات شما و ارائه مشاوره رایگان
                </Text>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
