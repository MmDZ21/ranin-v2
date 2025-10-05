
"use client";

import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductsCategories from "./productsCategories";
import { useEnterAnimation } from "@/lib/animations";
import { ProductsCategoriesConfig } from "@/constants";
import { Container } from "../ui/Container";
import { Heading } from "../ui/Heading";
import { Text } from "../ui/Text";
import { Button } from "../ui/Button";
import { FullScreenSection } from "../ui/FullScreenSection";
import { Section } from "../ui/Section";

export function Products(props: ProductsCategoriesConfig) {
  const { title, subtitle, ctaText, ctaHref, categories } = props;
  const fullScreen = false; // Force fullscreen mode

  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.8,
  });

  const header = (
    <Container className="mb-8">
      <motion.div
        ref={ref}
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" variants={variants.fadeInUp}>
          <motion.div className="flex-1" variants={variants.fadeInUp}>
            <Heading level={2} className="text-xl md:text-2xl font-semibold tracking-tight">
              {title}
            </Heading>
            <Text className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </Text>
          </motion.div>
          {/* Button visible only on desktop */}
          <motion.div variants={variants.fadeInUp} className="hidden sm:block">
            <Button variant="default" asChild className="w-auto">
              <Link href={ctaHref} className="flex items-center gap-2">
                {ctaText}
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </Container>
  );

  const mobileButton = (
    <Container className="mt-8">
      <motion.div
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div variants={variants.fadeInUp} className="sm:hidden flex justify-center">
          <Button variant="default" asChild className="w-full">
            <Link href={ctaHref} className="flex items-center justify-center gap-2">
              {ctaText}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );

  const content = (
    <Container className={fullScreen ? "max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px]" : ""}>
      <motion.div
        initial="offscreen"
        animate={animate}
        variants={variants.container}
      >
        <motion.div variants={variants.fadeInUp} className="md:py-4">
          <ProductsCategories
            categories={categories}
            ctaText={ctaText}
            ctaHref={ctaHref}
          />
        </motion.div>
      </motion.div>
    </Container>
  );

  if (fullScreen) {
    return (
      <FullScreenSection background="default" align="start">
        <div className="w-full">
          {header}
          {content}
          {mobileButton}
        </div>
      </FullScreenSection>
    );
  }

  return (
    <Section className="bg-muted/20">
      <div className="py-8 md:py-10 lg:py-14">
        {header}
        {content}
        {mobileButton}
      </div>
    </Section>
  );
}
