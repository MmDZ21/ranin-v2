import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16", className)}>{children}</div>;
}


