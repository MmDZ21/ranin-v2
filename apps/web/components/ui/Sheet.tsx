"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
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
  "aria-label"?: string;
}

interface SheetOverlayProps {
  className?: string;
  onClick?: () => void;
  open?: boolean;
}

// Lets a SheetTitle rendered anywhere inside SheetContent (e.g. nested in
// SheetHeader) report its id upward so the panel can be labelled via
// aria-labelledby.
const SheetTitleContext = createContext<((id: string) => void) | null>(null);

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.tabIndex !== -1 && el.getClientRects().length > 0
  );
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

export function SheetContent({ className, children, side = "right", style, "data-sidebar": dataSidebar, "data-slot": dataSlot, "data-mobile": dataMobile, open = true, "aria-label": ariaLabel = "Menu" }: SheetContentProps) {
  const sideClasses = {
    right: "right-0 top-0 h-full w-80 ",
    left: "left-0 top-0 h-full w-80 ",
    top: "top-0 left-0 w-full h-80 border-b",
    bottom: "bottom-0 left-0 w-full h-80 border-t",
  };

  const state = open ? "open" : "closed";

  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const [titleId, setTitleId] = useState<string | undefined>(undefined);

  const registerTitle = useCallback((id: string) => {
    setTitleId(id);
  }, []);

  // Move focus into the panel when it opens. The cleanup restores focus to
  // whatever element triggered the sheet, covering both an explicit
  // open -> false transition and the panel unmounting outright (this
  // component only mounts while the sheet is shown).
  useEffect(() => {
    if (!open) return;

    previousActiveElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const node = panelRef.current;
    if (node) {
      const focusable = getFocusableElements(node);
      (focusable[0] ?? node).focus();
    }

    return () => {
      const trigger = previousActiveElementRef.current;
      if (trigger && document.contains(trigger)) {
        trigger.focus();
      }
    };
  }, [open]);

  // Trap Tab/Shift+Tab focus within the panel while it is open so it can
  // never escape into the rest of the page.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const node = panelRef.current;
      if (!node) return;

      const focusable = getFocusableElements(node);
      if (focusable.length === 0) {
        e.preventDefault();
        node.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !node.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !node.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <SheetTitleContext.Provider value={registerTitle}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={titleId ? undefined : ariaLabel}
        tabIndex={-1}
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
    </SheetTitleContext.Provider>
  );
}

export function SheetHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("px-6 py-4 border-b", className)}>
      {children}
    </div>
  );
}

export function SheetTitle({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  const generatedId = useId();
  const titleId = id ?? generatedId;
  const registerTitle = useContext(SheetTitleContext);

  // Report this title's id to the enclosing SheetContent so it can be wired
  // up via aria-labelledby, regardless of how deeply it's nested (e.g.
  // inside SheetHeader).
  useEffect(() => {
    registerTitle?.(titleId);
  }, [registerTitle, titleId]);

  return (
    <h2 id={titleId} className={cn("text-lg font-semibold text-foreground", className)}>
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
