"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
  A11y,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "motion/react";
import { Container } from "../ui/Container";
import { Text } from "../ui/Text";
import { Heading } from "../ui/Heading";
import { Button } from "../ui/Button";
import { HeroSlide } from "@/constants";

// Component for animated hero text content
function HeroTextContent({ slide, isActive }: { slide: HeroSlide; isActive: boolean }) {
  // Create simple animation variants that work with slide transitions
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="relative text-white"
      variants={containerVariants}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      <Container>
        <div className="py-36 md:py-36">
          <motion.div variants={textVariants}>
            <Text as="span" className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-xs text-white/80">
              تجهیزات برق صنعتی
            </Text>
          </motion.div>
          
          <motion.div variants={textVariants}>
            <Heading level={1} className="mt-4 text-2xl font-semibold leading-tight md:text-6xl">
              {slide.headline}
            </Heading>
          </motion.div>
          
          {slide.sub && (
            <motion.div variants={textVariants}>
              <Text className="mt-4 max-w-2xl text-sm md:text-base text-white/90 leading-loose">
                {slide.sub}
              </Text>
            </motion.div>
          )}
          
          <motion.div 
            variants={textVariants}
            className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Button asChild className="w-full sm:w-auto">
              <Link href={slide.primaryHref ?? "/"}>بیشتر بدانید</Link>
            </Button>
            {slide.secondaryHref && (
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href={slide.secondaryHref} className="text-white border-white/60 hover:bg-white/10">
                  تماس با ما
                </Link>
              </Button>
            )}
          </motion.div>
        </div>
      </Container>
    </motion.div>
  );
}

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative overflow-hidden z-10">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={800}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        className="hero-swiper"
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        onAfterInit={(swiper) => setActiveSlide(swiper.realIndex)}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i} className="!h-full">
            <div className="relative h-full w-full">
              {/* Mobile-optimized background with Next.js Image */}
              <div className="absolute inset-0">
                <Image
                  src={s.image}
                  alt={`Slide ${i + 1}`}
                  fill
                  priority={i === 0} // Priority load for first slide
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
              
              {/* Fallback for older browsers or issues */}
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage: `url(${s.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/70" />
              {/* <div className="absolute inset-x-0 bottom-0 z-50 h-[80%] bg-gradient-to-b from-transparent via-transparent to-muted" /> */}
              <svg
                aria-hidden
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 opacity-30 blur-2xl"
                width="1200"
                height="400"
              >
                <defs>
                  <radialGradient id="g" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="1200" height="400" fill="url(#g)" />
              </svg>

              <HeroTextContent slide={s} isActive={activeSlide === i} />
            </div>
          </SwiperSlide>
        ))}
        {/* Trust bar overlay - positioned on top of slider */}
        <div className="absolute bottom-12 left-0 right-0 z-20 bg-transparent">
          <Container>
            <div className="mx-auto flex h-16 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] items-center justify-center gap-6 md:gap-10">
                <Image
                  src="/images/se-logo.svg"
                  alt="schneider electric"
                  width={300}
                  height={84}
                  className="h-18 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
            </div>
          </Container>
        </div>
      </Swiper>

      <style jsx global>{`
.hero-swiper {
  height: calc(100dvh - 6.5rem); /* full viewport minus header */
}
.hero-swiper .swiper-wrapper {
  height: 100%;
}
.hero-swiper .swiper-slide {
  height: 100%;
}

.swiper-button-prev,
.swiper-button-next {
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 9999px;
  background: var(--hero-control-bg);
  backdrop-filter: blur(6px);
}
.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 18px;
  font-weight: 700;
}
.swiper-pagination-bullet { background: var(--hero-pagination-bullet); opacity: 1; }
.swiper-pagination-bullet-active { background: var(--hero-pagination-active); }

@media (max-width: 767px) {
  .hero-swiper .swiper-button-prev,
  .hero-swiper .swiper-button-next {
    top: auto;
    bottom: 1rem;
  }
}
`}</style>
    </section>
  );
}

