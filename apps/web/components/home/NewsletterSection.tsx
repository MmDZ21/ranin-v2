"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { FileText } from "lucide-react";
import { useEnterAnimation } from "@/lib/animations";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { NewsletterSectionProps } from "@/constants";

export function NewsletterSection(props: NewsletterSectionProps) {
  const { title, subtitle, buttonText, buttonHref } = props;

  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.8,
  });

  return (
    <section className="bg-gray-200 py-16 md:py-24">
      <Container>
        <motion.div
          ref={ref}
          className="mx-auto max-w-3xl px-4 text-center xl:max-w-4xl 2xl:max-w-5xl"
          initial="offscreen"
          animate={animate}
          variants={variants.container}
        >
          <motion.h2
            className="text-foreground mb-4 text-xl leading-tight font-bold md:mb-6 md:text-4xl"
            variants={variants.fadeInUp}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-muted-foreground mx-auto mb-8 max-w-2xl text-sm leading-loose md:mb-12 md:text-lg"
            variants={variants.fadeInUp}
          >
            {subtitle}
          </motion.p>

          <motion.div className="mx-auto flex justify-center" variants={variants.fadeInUp}>
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link href={buttonHref}>
                {buttonText}
                <FileText className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
