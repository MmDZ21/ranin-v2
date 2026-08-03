"use client";

import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { CONTACT_DETAILS } from "@/constants";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { FileText, Mail } from "lucide-react";
import Link from "next/link";

export function ContactInfo() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.2,
    textDuration: 0.6,
  });

  const sections = [
    { key: "email", title: "ایمیل فروش و اطلاعات", icon: Mail, lines: CONTACT_DETAILS.emails },
  ] as const;

  return (
    <motion.div 
      ref={ref}
      className="space-y-6 sm:space-y-8"
      initial="offscreen"
      animate={animate}
      variants={variants.container}
    >
      {/* Contact Details */}
      <motion.div 
        className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg sm:shadow-xl"
        variants={variants.scale}
      >
        <div className="mb-4 sm:mb-6">
          <Heading level={3} className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            اطلاعات تماس
          </Heading>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {sections.map(({ key, title, icon: Icon, lines }) => (
            <div key={key} className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <Text className="text-sm sm:text-base font-bold text-gray-900 mb-1">{title}</Text>
                {lines.map((line) => (
                  <Text key={line} className="text-muted-foreground text-xs sm:text-sm leading-loose">{line}</Text>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quote shortcut */}
      <motion.div 
        className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl"
        variants={variants.scale}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90"></div>
        <div className="relative p-4 sm:p-6 text-white">
          <Heading level={3} className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
            درخواست سریع
          </Heading>
          <Text className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base">
            برای بررسی قیمت و مشخصات محصول، فرم استعلام را تکمیل کنید.
          </Text>
          <Button asChild className="w-full bg-white text-primary hover:bg-white/90 rounded-lg h-10 text-sm sm:text-base font-semibold">
            <Link href="#quote-form">
              <FileText className="w-4 h-4" />
              تکمیل فرم استعلام
            </Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
