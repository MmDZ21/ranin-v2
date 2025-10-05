"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface SheetContentProps {
  className?: string;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

interface SheetOverlayProps {
  className?: string;
  onClick?: () => void;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
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

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-overlay)]">
      {children}
    </div>,
    document.body
  );
}

export function SheetOverlay({ className, onClick }: SheetOverlayProps) {
  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black/50 backdrop-blur-sm",
        className
      )}
      onClick={onClick}
    />
  );
}

export function SheetContent({ className, children, side = "right" }: SheetContentProps) {
  const sideClasses = {
    right: "right-0 top-0 h-full w-80 ",
    left: "left-0 top-0 h-full w-80 ",
    top: "top-0 left-0 w-full h-80 border-b",
    bottom: "bottom-0 left-0 w-full h-80 border-t",
  };

  return (
    <div
      className={clsx(
        "fixed bg-background text-foreground shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:duration-300 data-[state=open]:duration-500",
        side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        sideClasses[side],
        className
      )}
      data-state="open"
    >
      {children}
    </div>
  );
}

export function SheetHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx("px-6 py-4 border-b", className)}>
      {children}
    </div>
  );
}

export function SheetTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h2 className={clsx("text-lg font-semibold text-foreground", className)}>
      {children}
    </h2>
  );
}

export function SheetClose({ className, onClick, children }: { className?: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      className={clsx(
        "absolute right-4 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
