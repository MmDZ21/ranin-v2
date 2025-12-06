"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface SheetContentProps {
  className?: string;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  style?: React.CSSProperties;
  "data-sidebar"?: string;
  "data-slot"?: string;
  "data-mobile"?: string;
  open?: boolean;
}

interface SheetOverlayProps {
  className?: string;
  onClick?: () => void;
  open?: boolean;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const [isMounted, setIsMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      // Delay unmounting to allow close animation to play
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300); // Match the animation duration
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-overlay)]">
      {children}
    </div>,
    document.body
  );
}

export function SheetOverlay({ className, onClick, open }: SheetOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm",
        open ? "animate-in fade-in-0" : "animate-out fade-out-0",
        "duration-300",
        className
      )}
      onClick={onClick}
    />
  );
}

export function SheetContent({ className, children, side = "right", style, "data-sidebar": dataSidebar, "data-slot": dataSlot, "data-mobile": dataMobile, open = true }: SheetContentProps) {
  const sideClasses = {
    right: "right-0 top-0 h-full w-80 ",
    left: "left-0 top-0 h-full w-80 ",
    top: "top-0 left-0 w-full h-80 border-b",
    bottom: "bottom-0 left-0 w-full h-80 border-t",
  };

  const state = open ? "open" : "closed";

  return (
    <div
      className={cn(
        "fixed bg-background text-foreground shadow-xl z-[calc(var(--z-overlay)+1)]",
        open ? "animate-in" : "animate-out",
        "duration-300",
        side === "right" && (open ? "slide-in-from-right" : "slide-out-to-right"),
        side === "left" && (open ? "slide-in-from-left" : "slide-out-to-left"),
        side === "top" && (open ? "slide-in-from-top" : "slide-out-to-top"),
        side === "bottom" && (open ? "slide-in-from-bottom" : "slide-out-to-bottom"),
        sideClasses[side],
        className
      )}
      data-state={state}
      style={style}
      data-sidebar={dataSidebar}
      data-slot={dataSlot}
      data-mobile={dataMobile}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function SheetHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("px-6 py-4 border-b", className)}>
      {children}
    </div>
  );
}

export function SheetTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h2 className={cn("text-lg font-semibold text-foreground", className)}>
      {children}
    </h2>
  );
}

export function SheetClose({ className, onClick, children }: { className?: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      className={cn(
        "absolute right-4 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
