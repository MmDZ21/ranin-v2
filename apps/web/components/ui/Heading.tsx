import React, { ReactNode } from "react";
import clsx from "clsx";

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
}

const levelToClass: Record<number, string> = {
  1: "text-3xl font-extrabold leading-tight",
  2: "text-2xl font-bold",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold",
};

export function Heading({ level = 2, className, children }: HeadingProps) {
  const Tag = (`h${level}` as unknown) as keyof React.JSX.IntrinsicElements;
  return <Tag className={clsx(levelToClass[level], className)}>{children}</Tag>;
}


