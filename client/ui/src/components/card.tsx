import type { HTMLAttributes } from "react";
import { cn, toneClass, type Tone } from "./tone";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  /** `panel` groups content on a tinted ground; `item` is a white block inside one. Both
   * use the same inset; an item's radius is the panel's minus that inset, so they nest. */
  variant?: "panel" | "item";
  isActive?: boolean;
}

export function Card({
  tone = "neutral",
  variant = "panel",
  isActive = false,
  className,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        toneClass[tone],
        "border border-tone-200 p-inset",
        variant === "panel"
          ? "rounded-card bg-tone-50"
          : "rounded-control bg-white shadow-sm",
        isActive && "border-tone-400 ring-2 ring-tone-200",
        className,
      )}
      {...props}
    />
  );
}
