import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Tone = "success" | "muted" | "warning" | "destructive" | "brand"

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success",
  muted: "bg-muted text-muted-foreground",
  warning: "bg-warning/15 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
  brand: "bg-primary/10 text-primary",
}

const dotClasses: Record<Tone, string> = {
  success: "bg-success",
  muted: "bg-muted-foreground/60",
  warning: "bg-warning",
  destructive: "bg-destructive",
  brand: "bg-primary",
}

interface StatusBadgeProps {
  tone: Tone
  children: ReactNode
  className?: string
}

/** Small pill used in tables to convey a record's status with a brand-aligned tone. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotClasses[tone])} />
      {children}
    </span>
  )
}
