import { ReactNode, forwardRef } from "react";
import clsx from "clsx";

interface FullScreenSectionProps {
  children: ReactNode;
  className?: string;
  /** Whether to account for header + topbar (default: true) */
  withHeader?: boolean;
  /** Custom height override */
  height?: string;
  /** Background styling */
  background?: "default" | "gray" | "gradient" | "dark";
  /** Vertical alignment of content */
  align?: "start" | "center" | "end";
  /** Padding override */
  padding?: string;
}

/**
 * FullScreenSection - A utility component for creating full-screen sections
 * 
 * @param withHeader - If true (default), accounts for header + topbar height
 * @param height - Custom height (overrides withHeader calculation)
 * @param background - Pre-defined background styles
 * @param align - Vertical alignment of content
 * @param padding - Custom padding (default: container padding)
 */
export const FullScreenSection = forwardRef<HTMLElement, FullScreenSectionProps>(({
  children,
  className,
  withHeader = true,
  height,
  background = "default",
  align = "center",
  padding,
  ...props
}, ref) => {
  // Calculate height based on header consideration
  const sectionHeight = height || (withHeader ? "calc(100dvh - 6.5rem)" : "100dvh");
  
  // Background styles
  const backgroundStyles = {
    default: "",
    gray: "bg-gray-200 gray-background",
    gradient: "bg-gradient-to-b from-muted to-muted/40",
    dark: "bg-gray-900 text-white",
  };

  // Alignment styles
  const alignStyles = {
    start: "justify-start items-start",
    center: "justify-center items-center",
    end: "justify-end items-end",
  };

  return (
    <section
      ref={ref}
      className={clsx(
        "flex flex-col w-full md:py-0 overflow-hidden",
        alignStyles[align],
        backgroundStyles[background],
        className
      )}
      style={{ height: sectionHeight }}
      {...props}
    >
      <div 
        className={clsx(
          "flex flex-col w-full h-full",
          alignStyles[align],
          padding || "px-4 md:px-6 lg:px-8"
        )}
      >
        {children}
      </div>
    </section>
  );
});

FullScreenSection.displayName = "FullScreenSection";
