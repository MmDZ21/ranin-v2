"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { motion } from "motion/react";
import { useEnterAnimation } from "@/lib/animations";
import { Filter, ArrowUpDown, ChevronDown } from "lucide-react";

export function ProductsFilters() {
  const { ref, animate, variants } = useEnterAnimation({
    staggerDelay: 0.1,
    textDuration: 0.4,
  });

  return (
    <motion.div 
      ref={ref}
      className="flex items-center gap-2 sm:gap-3 flex-wrap"
      initial="offscreen"
      animate={animate}
      variants={variants.fadeInUp}
    >
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">فیلتر</span>
            <span className="sm:hidden">فیلتر</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 sm:w-56">
          <DropdownMenuLabel>فیلتر بر اساس</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>همه محصولات</DropdownMenuItem>
          <DropdownMenuItem>موجود در انبار</DropdownMenuItem>
          <DropdownMenuItem>تخفیف‌دار</DropdownMenuItem>
          <DropdownMenuItem>جدیدترین</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>قیمت</DropdownMenuLabel>
          <DropdownMenuItem>زیر 100,000 تومان</DropdownMenuItem>
          <DropdownMenuItem>100,000 - 500,000 تومان</DropdownMenuItem>
          <DropdownMenuItem>بالای 500,000 تومان</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2">
            <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">مرتب‌سازی</span>
            <span className="sm:hidden">مرتب</span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 sm:w-56">
          <DropdownMenuLabel>مرتب‌سازی بر اساس</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>پیش‌فرض</DropdownMenuItem>
          <DropdownMenuItem>نام (الف-ی)</DropdownMenuItem>
          <DropdownMenuItem>نام (ی-الف)</DropdownMenuItem>
          <DropdownMenuItem>قیمت (کم به زیاد)</DropdownMenuItem>
          <DropdownMenuItem>قیمت (زیاد به کم)</DropdownMenuItem>
          <DropdownMenuItem>جدیدترین</DropdownMenuItem>
          <DropdownMenuItem>محبوب‌ترین</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
