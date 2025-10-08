"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "motion/react";
import type { Variants } from "motion/react";

export interface AnimationOptions {
  staggerDelay?: number;
  textDuration?: number;
  imageDuration?: number;
  viewportAmount?: number;
  viewportMargin?: `${number}px ${number}px ${number}px ${number}px`;
}

// Mobile device detection hook with SSR safety
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
      setIsInitialized(true);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Return false during SSR/initial render to avoid hydration issues
  return isInitialized ? isMobile : false;
}

// Check for user's motion preference with SSR safety
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    setIsInitialized(true);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Only apply reduced motion after initialization to avoid SSR issues
  return isInitialized ? prefersReducedMotion : false;
}

export const defaultAnimationOptions: Required<AnimationOptions> = {
  staggerDelay: 0.3,
  textDuration: 0.8,
  imageDuration: 1.0,
  viewportAmount: 0.2,
  viewportMargin: "-50px 0px -30px 0px" as const,
};

// Mobile-optimized animation options
export const mobileAnimationOptions: Required<AnimationOptions> = {
  staggerDelay: 0.2,  // Slightly faster stagger for mobile
  textDuration: 0.6,  // Slightly shorter duration
  imageDuration: 0.8, // Keep reasonable duration for images
  viewportAmount: 0.2, // Same as desktop for consistency
  viewportMargin: "-50px 0px -30px 0px" as const, // Keep same margins as desktop
};

// Container animation with stagger support
export const createContainerVariants = (staggerDelay: number, isMobile: boolean = false): Variants => ({
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      type: isMobile ? "tween" : "spring", // Use easier tween on mobile
      duration: isMobile ? 0.4 : 0.6,
      staggerChildren: staggerDelay,
    },
  },
});

// Fade in from bottom animation for text elements
export const createFadeInUpVariants = (duration: number = 0.8, isMobile: boolean = false): Variants => ({
  offscreen: {
    opacity: 0,
    y: isMobile ? 30 : 60, // Reduced movement on mobile
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: isMobile ? "tween" : "spring",
      duration,
      staggerChildren: isMobile ? 0.1 : 0.2,
    },
  },
});

// Fade in from left animation
export const createFadeInLeftVariants = (duration: number = 0.8, isMobile: boolean = false): Variants => ({
  offscreen: {
    opacity: 0,
    x: isMobile ? -30 : -60, // Reduced movement on mobile
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: isMobile ? "tween" : "spring",
      duration,
    },
  },
});

// Fade in from right animation
export const createFadeInRightVariants = (duration: number = 0.8, isMobile: boolean = false): Variants => ({
  offscreen: {
    opacity: 0,
    x: isMobile ? 30 : 60, // Reduced movement on mobile
  },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      type: isMobile ? "tween" : "spring",
      duration,
    },
  },
});

// Scale animation for cards and images
export const createScaleVariants = (duration: number = 0.8, isMobile: boolean = false): Variants => ({
  offscreen: {
    opacity: 0,
    scale: isMobile ? 0.9 : 0.8, // Less dramatic scale on mobile
  },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: {
      type: isMobile ? "tween" : "spring",
      duration,
    },
  },
});

// Simple fade in animation
export const createFadeInVariants = (duration: number = 0.8, isMobile: boolean = false): Variants => ({
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      type: isMobile ? "tween" : "spring",
      duration,
    },
  },
});

// Reduced motion variants (very simple animations)
export const createReducedMotionVariants = (): Variants => ({
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
});

// Hook to handle viewport detection and animation state
export function useEnterAnimation(options: AnimationOptions = {}) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  // Use mobile options if on mobile device, otherwise use provided options or defaults
  const baseOptions = isMobile ? mobileAnimationOptions : defaultAnimationOptions;
  const {
    staggerDelay,
    textDuration,
    imageDuration,
    viewportAmount,
    viewportMargin,
  } = { ...baseOptions, ...options };

  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: viewportAmount,
    margin: viewportMargin,
    once: true,
  });

  // For SSR safety and to ensure images always show, default to visible state initially
  // On mobile, be more conservative with animations to prevent image hiding
  const shouldAnimate = isInView;
  
  // If this is SSR or initial render, start in visible state to prevent flash
  const [isInitialRender, setIsInitialRender] = useState(true);
  useEffect(() => {
    setIsInitialRender(false);
  }, []);
  
  const animationState = isInitialRender ? "onscreen" : (shouldAnimate ? "onscreen" : "offscreen");

  // If user prefers reduced motion, use simple fade animations
  if (prefersReducedMotion) {
    const reducedVariants = createReducedMotionVariants();
    return {
      ref,
      isInView,
      animate: animationState,
      variants: {
        container: reducedVariants,
        fadeInUp: reducedVariants,
        fadeInLeft: reducedVariants,
        fadeInRight: reducedVariants,
        scale: reducedVariants,
        fadeIn: reducedVariants,
      },
    };
  }

  const containerVariants = createContainerVariants(staggerDelay, isMobile);
  const fadeInUpVariants = createFadeInUpVariants(textDuration, isMobile);
  const fadeInLeftVariants = createFadeInLeftVariants(imageDuration, isMobile);
  const fadeInRightVariants = createFadeInRightVariants(imageDuration, isMobile);
  const scaleVariants = createScaleVariants(textDuration, isMobile);
  const fadeInVariants = createFadeInVariants(textDuration, isMobile);

  return {
    ref,
    isInView,
    animate: animationState,
    variants: {
      container: containerVariants,
      fadeInUp: fadeInUpVariants,
      fadeInLeft: fadeInLeftVariants,
      fadeInRight: fadeInRightVariants,
      scale: scaleVariants,
      fadeIn: fadeInVariants,
    },
  };
}

// Export mobile detection hooks for use in components
export { useIsMobile, useReducedMotion };
