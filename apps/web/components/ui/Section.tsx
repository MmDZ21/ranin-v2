import { ReactNode } from "react";
import clsx from "clsx";

export function Section({ className, children, bordered = false }: { className?: string; children: ReactNode; bordered?: boolean }) {
  return (
    <section className={clsx(bordered ? "border-b" : undefined, className)}>
      {children}
    </section>
  );
}


