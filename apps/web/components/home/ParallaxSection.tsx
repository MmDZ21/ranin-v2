"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { ParallaxSectionProps } from "@/constants";
import { useEnterAnimation } from "@/lib/animations";

export function ParallaxSection(
  props: ParallaxSectionProps,
) {
  const {
    image,
    height,
    overlay,
    overlayOpacity,
    title,
    subtitle,
    ctaText,
    ctaHref,
    textAlign,
    textColor,
  } = props;

  const heightClasses = {
    small: "h-[20vh] md:h-[30vh] min-h-[200px]",
    medium: "h-[30vh] md:h-[50vh] min-h-[300px]",
    large: "h-[50vh] md:h-[70vh] min-h-[400px]",
    full: "h-screen min-h-[500px]",
  };

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const textColorClasses = {
    white: "text-white",
    black: "text-black",
    inherit: "text-inherit",
  };

  const hasContent = title || subtitle || ctaText;

  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.3,
    textDuration: 1.0,
  });

  // Ensure we have a valid image source
  const imageSrc = image || "/images/parallax.png";

  return (
    <section
      className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden bg-gray-900 bg-fixed bg-center bg-cover`}
      style={{ backgroundImage: `url('${imageSrc}')` }}
    >
      
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-800/70 to-gray-700/70 z-10"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {hasContent && (
        <motion.div
          ref={ref}
          className={`relative z-20 mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-4 md:px-6 ${textAlignClasses[textAlign]} ${textColorClasses[textColor]}`}
          initial="offscreen"
          animate={animate}
          variants={variants.container}
        >
          {title && (
            <motion.h2 
              className="mb-4 text-2xl leading-tight font-bold md:text-5xl"
              variants={variants.fadeInUp}
            >
              {title}
            </motion.h2>
          )}

          {subtitle && (
            <motion.p 
              className="mx-auto mb-6 md:mb-8 max-w-2xl text-sm md:text-xl opacity-90 leading-loose"
              variants={variants.fadeInUp}
            >
              {subtitle}
            </motion.p>
          )}

          {ctaText && ctaHref && (
            <motion.div variants={variants.fadeInUp}>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
}
