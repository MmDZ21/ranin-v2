"use client";

import { Container } from "@/components/ui/Container";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Phone, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ABOUT_HERO_CONFIG } from "@/constants";

export function AboutHero() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.3,
    textDuration: 0.8,
    imageDuration: 1.0,
  });

  return (
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
          <h1 className="text-sm text-primary font-bold">درباره ما</h1>
        </motion.div>

        {/* Hero Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12 sm:mb-16"
          initial="offscreen"
          animate={animate}
          variants={variants.container}
        >
          <motion.div 
            className="space-y-4 sm:space-y-6 order-2 lg:order-1"
            variants={variants.fadeInUp}
          >
            <motion.div 
              className="space-y-3 sm:space-y-4"
              variants={variants.container}
            >
              <motion.div variants={variants.fadeInUp}>
                <Heading level={1} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  {ABOUT_HERO_CONFIG.title}
                </Heading>
                <div className="w-12 sm:w-16 h-1 bg-primary mt-2 sm:mt-3"></div>
              </motion.div>
              <motion.div variants={variants.fadeInUp}>
                <Text className="text-base sm:text-lg md:text-xl text-gray-500 leading-loose font-light">
                  {ABOUT_HERO_CONFIG.subtitle}
                </Text>
              </motion.div>
                <motion.div variants={variants.fadeInUp}>
                  <Text className="text-sm sm:text-base text-muted-foreground leading-loose max-w-lg">
                    {ABOUT_HERO_CONFIG.description}
                  </Text>
                </motion.div>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              variants={variants.fadeInUp}
            >
               <Button className="w-full md:w-fit" asChild>
                 <a href={ABOUT_HERO_CONFIG.primaryCta.href}>
                 <Phone className="w-4 h-4" />
                 {ABOUT_HERO_CONFIG.primaryCta.label}
                 </a>
               </Button>
               <Button variant="outline" className="w-full md:w-fit" asChild>
                 <a href={ABOUT_HERO_CONFIG.secondaryCta.href}>
                 {ABOUT_HERO_CONFIG.secondaryCta.label}
                 <ArrowRight className="w-4 h-4" />
                 </a>
               </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative group order-1 lg:order-2"
            variants={variants.fadeInUp}
          >
            <div className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
              <Image
                src={ABOUT_HERO_CONFIG.image.src}
                alt={ABOUT_HERO_CONFIG.image.alt}
                width={600}
                height={450}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-primary/20 to-transparent rounded-lg sm:rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>
        </motion.div>
      </Container>

  );
}
