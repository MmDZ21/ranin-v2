"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { CheckCircle, Users, Award } from "lucide-react";
import { ABOUT_VALUES } from "@/constants";

export function AboutValues() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  return (
    <div className="bg-gray-200">
      <Container className="py-6 md:py-12">
        <motion.div
          ref={ref}
          className="mb-12 sm:mb-16"
          initial="offscreen"
          animate={animate}
          variants={variants.container}
        >
          <motion.div
            className="text-center mb-8 sm:mb-12"
            variants={variants.fadeInUp}
          >
            <Heading
              level={2}
              className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4"
            >
              ارزش‌های ما
            </Heading>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {ABOUT_VALUES.map((v, idx) => (
              <motion.div key={idx} className="text-center group" variants={variants.fadeInUp}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {v.icon === "check" && <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                  {v.icon === "users" && <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                  {v.icon === "award" && <Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                </div>
                <Heading level={3} className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {v.title}
                </Heading>
                <Text className="text-muted-foreground leading-loose text-sm sm:text-base px-4">{v.text}</Text>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
