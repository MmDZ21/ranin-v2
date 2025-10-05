"use client";

import Image from "next/image";
import { useState } from "react";

// Enhanced Image component with mobile optimization
interface MobileOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function MobileOptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  loading = "lazy",
  sizes,
  fill = false,
  objectFit = "cover",
  fallbackSrc = "/images/relay.png",
  onLoad: externalOnLoad,
  onError: externalOnError,
  ...props
}: MobileOptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.warn(`Image failed to load: ${imageSrc}`);
    setHasError(true);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    externalOnError?.();
  };

  const handleLoad = () => {
    if (hasError) {
      console.log(`Fallback image loaded: ${imageSrc}`);
    }
    externalOnLoad?.();
  };

  // Default mobile-optimized sizes if not provided
  const defaultSizes = fill 
    ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px";

  const imageProps = {
    src: imageSrc,
    alt: alt || "",
    className: `${className} ${objectFit === "contain" ? "object-contain" : objectFit === "cover" ? "object-cover" : ""}`,
    onError: handleError,
    onLoad: handleLoad,
    sizes: sizes || defaultSizes,
    priority,
    loading,
    ...props,
  };

  if (fill) {
    return <Image {...imageProps} alt={alt || ""} fill />;
  }

  return (
    <Image
      {...imageProps}
      alt={alt || ""}
      width={width || 400}
      height={height || 300}
    />
  );
}

// Removed debug components for production
