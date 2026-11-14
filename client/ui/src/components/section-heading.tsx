import type { HTMLAttributes } from "react";
import { cn } from "./tone";

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  tone?: "neutral" | "primary";
}

export function SectionHeading({
  tone = "neutral",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "px-4 pt-6 text-2xl font-semibold text-balance",
        tone === "primary" ? "text-blue-800" : "text-indigo-800",
        className,
      )}
      {...props}
    />
  );
}
