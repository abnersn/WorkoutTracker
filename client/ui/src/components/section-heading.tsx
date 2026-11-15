import type { HTMLAttributes } from "react";
import { cn } from "./tone";

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  tone?: "neutral" | "primary";
  /** 1 for the page's own title; 2 (default) for a section within it. */
  level?: 1 | 2;
  /**
   * Drop the built-in page inset, for a heading laid out inside a row of its
   * own (e.g. beside a back button). `cn` only joins classes, so a `p-0`
   * override can't beat the inset; this prop is how to turn it off.
   */
  flush?: boolean;
}

export function SectionHeading({
  tone = "neutral",
  level = 2,
  flush = false,
  className,
  ...props
}: SectionHeadingProps): React.JSX.Element {
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <Tag
      className={cn(
        !flush && "px-4 pt-6",
        "text-2xl font-semibold text-balance",
        tone === "primary" ? "text-blue-800" : "text-indigo-800",
        className,
      )}
      {...props}
    />
  );
}
