"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { FullScreenSection } from "../ui/FullScreenSection";
import { Heading } from "../ui/Heading";
import { useEnterAnimation } from "@/lib/animations";
import { AnimatedFeaturesProps } from "@/constants";

// Removed custom variants - now using the unified animation system

export function AnimatedFeatures({
  sectionTitle,
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
  background = "default",
  className = "",
  animationOptions = {},
}: AnimatedFeaturesProps) {
  const {
    staggerDelay = 0.4,
    textDuration = 1,
    imageDuration = 1.2,
    viewportAmount = 0.3,
    viewportMargin = "-100px 0px -50px 0px",
  } = animationOptions;

  // Use the unified animation system
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay,
    textDuration,
    imageDuration,
    viewportAmount,
    viewportMargin,
  });

  const contentOrder = reverse
    ? "flex-col md:flex-row-reverse"
    : "flex-col md:flex-row";
  const textPadding = reverse ? "md:ps-16" : "md:pe-8";

  return (
    <FullScreenSection
      background={background}
      align="center"
      padding="px-4 md:px-6 lg:px-8"
      className={className}
    >
      <motion.div
        ref={ref}
        className={`mx-auto flex h-full w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] items-center justify-between ${contentOrder} py-8 md:py-16 md:gap-16`}
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div
          className={`flex-1 mb-8 md:mb-0 ${textPadding}`}
          variants={variants.fadeInUp}
        >
          {sectionTitle && (
            <motion.div
              variants={variants.fadeInUp}
              className="text-start mb-6 md:mb-8 flex gap-2 items-center"
            >
              <div className="w-4 h-0.5 bg-primary rounded-full flex-shrink-0" />
              <Heading
                level={6}
                className="text-xs font-bold md:text-sm lg:text-base text-brand"
              >
                {sectionTitle}
              </Heading>
            </motion.div>
          )}

          <motion.div variants={variants.fadeInUp}>
            <Heading
              level={2}
              className="mb-4 md:mb-6 text-lg md:text-2xl lg:text-4xl font-bold leading-tight"
            >
              {title}
            </Heading>
          </motion.div>
          <motion.p
            className="text-muted-foreground text-sm md:text-lg lg:text-xl leading-loose max-w-lg"
            variants={variants.fadeInUp}
          >
            {description}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative h-80 sm:h-96 md:h-[450px] lg:h-[500px] w-full md:flex-1 overflow-hidden rounded-xl"
          variants={reverse ? variants.fadeInLeft : variants.fadeInRight}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
            className="relative z-10 object-cover rounded-xl"
            loading="lazy"
          />
        </motion.div>
      </motion.div>
    </FullScreenSection>
  );
}

// Export the reusable component as default
export default AnimatedFeatures;
