import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function slugify(str: string): string {
  return str
    .toString()
    .normalize("NFD") // حذف accent ها
    .replace(/[\u0300-\u036f]/g, "") // حذف علامت‌های ترکیبی
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // حذف کاراکتر غیر مجاز
    .replace(/\s+/g, "-") // اسپیس → -
    .replace(/-+/g, "-"); // dash تکراری → یکی
}
