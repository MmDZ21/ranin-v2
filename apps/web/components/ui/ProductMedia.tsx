"use client";

import Image from "next/image";
import { CircuitBoard } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ProductMediaVariant = "compact" | "card" | "detail";

interface ProductMediaFallbackProps {
  label?: string | null;
  variant?: ProductMediaVariant;
  className?: string;
}

interface ProductMediaProps extends ProductMediaFallbackProps {
  src?: string | null;
  alt: string;
  sizes: string;
  imageClassName?: string;
  priority?: boolean;
}

export function ProductMediaFallback({
  label,
  variant = "card",
  className,
}: ProductMediaFallbackProps) {
  const isCompact = variant === "compact";

  return (
    <div
      role="img"
      aria-label="تصویر محصول ثبت نشده است"
      className={cn(
        "flex h-full w-full items-center justify-center bg-primary/[0.06] text-primary",
        isCompact ? "p-2" : "p-5 sm:p-7",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex items-center",
          isCompact ? "justify-center" : "w-full max-w-sm flex-col gap-4",
        )}
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-xl border border-primary/25 bg-background",
            isCompact ? "size-11" : "aspect-[5/4] w-32 sm:w-36",
            variant === "detail" && "w-40 sm:w-48",
          )}
        >
          <span className="absolute left-2 top-2 size-1 rounded-full bg-primary/30" />
          <span className="absolute right-2 top-2 size-1 rounded-full bg-primary/30" />
          <span className="absolute bottom-2 left-2 size-1 rounded-full bg-primary/30" />
          <span className="absolute bottom-2 right-2 size-1 rounded-full bg-primary/30" />
          <CircuitBoard
            className={cn(
              "text-primary/70",
              isCompact ? "size-5" : "size-12 sm:size-14",
            )}
            strokeWidth={1.35}
          />
        </div>

        {isCompact ? null : (
          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold text-foreground">
              تصویر محصول ثبت نشده است
            </p>
            {label ? (
              <p
                className="max-w-64 truncate text-xs text-muted-foreground"
                dir="ltr"
              >
                {label}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductMedia({
  src,
  alt,
  sizes,
  imageClassName,
  priority,
  ...fallbackProps
}: ProductMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ProductMediaFallback {...fallbackProps} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-contain", imageClassName)}
      onError={() => setFailed(true)}
    />
  );
}
