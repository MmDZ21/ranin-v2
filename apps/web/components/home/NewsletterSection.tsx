"use client";

import { motion } from "motion/react";

import { MailCheck } from "lucide-react";
import { useEnterAnimation } from "@/lib/animations";
import { Button } from "../ui/Button";
import { Container } from "../ui/Container";
import { NewsletterSectionProps } from "@/constants";
import { Input } from "../ui/input";

export function NewsletterSection(props: NewsletterSectionProps) {
  const { title, subtitle, placeholder, buttonText } = props;

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

          <motion.div className="mx-auto max-w-lg" variants={variants.fadeInUp}>
            <form className="flex flex-col gap-3 sm:flex-row md:gap-4">
              <Input
                type="email"
                placeholder={placeholder}
                className="bg-background text-foreground placeholder-muted-foreground placeholder:text-sm focus:ring-primary/30 md:flex-1 rounded-xl  border-0 px-4 py-4 transition-all focus:ring-4 focus:outline-none md:px-6 md:py-6"
                required
              />
              <Button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-4 sm:w-auto md:py-6"
              >
                {buttonText}
                <MailCheck className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
