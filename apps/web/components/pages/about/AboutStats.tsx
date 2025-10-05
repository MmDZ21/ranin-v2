"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Award, Users, CheckCircle, Clock } from "lucide-react";
import { ABOUT_STATS } from "@/constants";

export function AboutStats() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  return (
    <div className="bg-gray-200 flex justify-center items-center py-6 md:py-12">
      <Container className="py-8 sm:py-12">
        <motion.div
          ref={ref}
          initial="offscreen"
          animate={animate}
          variants={variants.container}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {ABOUT_STATS.map((s, idx) => (
              <motion.div key={idx} className="text-center group" variants={variants.scale}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {s.icon === "award" && <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  {s.icon === "users" && <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  {s.icon === "check" && <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                  {s.icon === "clock" && <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                </div>
                <Heading level={3} className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-1 sm:mb-2">
                  {s.value}
                </Heading>
                <Text className="text-xs sm:text-sm font-medium text-muted-foreground">{s.label}</Text>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
