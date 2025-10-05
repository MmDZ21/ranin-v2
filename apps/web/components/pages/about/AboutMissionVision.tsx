"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Award, Users } from "lucide-react";
import Image from "next/image";
import { ABOUT_MISSION_VISION } from "@/constants";

export function AboutMissionVision() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.3,
    textDuration: 0.8,
    imageDuration: 1.0,
  });

  return (
    <Container className="py-8 sm:py-12">
      <motion.div 
        ref={ref}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16"
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        {ABOUT_MISSION_VISION.map((item, idx) => (
          <motion.div key={idx} className="relative group" variants={variants.fadeInUp}>
            <div className="aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={600}
                height={450}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <motion.div className="absolute bottom-3 right-3 left-3 sm:bottom-4 sm:right-4 sm:left-4" variants={variants.fadeInUp}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                {item.icon === "award" ? (
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
              <Heading level={2} className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                {item.title}
              </Heading>
              <Text className="text-white/90 leading-loose text-xs sm:text-sm">
                {item.text}
              </Text>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
