"use client";

import Link from "next/link";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const categoryCardVariants = cva(
  "relative w-full rounded-xl overflow-hidden cursor-pointer group",
  {
    variants: {
      size: {
        sm: "h-48",
        md: "h-64",
        lg: "h-80",
        xl: "h-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const contentVariants = cva(
  "absolute bottom-0 left-0 right-0 text-white",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const titleVariants = cva(
  "font-semibold mb-2 leading-tight",
  {
    variants: {
      size: {
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const descriptionVariants = cva(
  "text-white/90",
  {
    variants: {
      size: {
        sm: "text-xs line-clamp-1",
        md: "text-sm line-clamp-1",
        lg: "text-base line-clamp-2",
        xl: "text-lg line-clamp-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const productCountVariants = cva(
  "text-white/70 mt-1",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-xs",
        lg: "text-sm",
        xl: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface CategoryCardProps extends VariantProps<typeof categoryCardVariants> {
  title: string;
  description: string;
  categoryHref: string;
  imageSrc?: string;
  productCount?: string;
  className?: string;
}

export default function CategoryCard({
  title,
  description,
  categoryHref,
  imageSrc = "/images/relay.png",
  productCount,
  size,
  className,
}: CategoryCardProps) {
  return (
    <Link href={categoryHref}>
      <div className={cn(categoryCardVariants({ size }), className)}>
        {/* Background Image */}
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Overlay with text */}
        <div className="absolute inset-0 bg-gray-900/70 group-hover:bg-gray-900/80 transition-all duration-300" />
        
        {/* Content */}
        <div className={contentVariants({ size })}>
          <h3 className={titleVariants({ size })}>
            {title}
          </h3>
          <p className={descriptionVariants({ size })}>
            {description}
          </p>
          {productCount && (
            <p className={productCountVariants({ size })}>
              {productCount}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
