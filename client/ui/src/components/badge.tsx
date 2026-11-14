import type { ReactNode } from "react";
import { cn, toneClass, type Tone } from "./tone";

export interface BadgeProps {
  tone?: Tone;
  icon?: ReactNode;
  /** Small uppercase text after the value, such as a date. */
  caption?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A compact read-out: the running workout clock and its date. */
export function Badge({
  tone = "neutral",
  icon,
  caption,
  className,
  children,
}: BadgeProps) {
  return (
    <div
      className={cn(
        toneClass[tone],
        "inline-flex shrink-0 items-center gap-2 rounded-control border border-tone-200 bg-tone-50 px-3 py-1.5 text-xl text-tone-800",
        className,
      )}
    >
      {icon}
      <span className="flex flex-col leading-tight">
        <span className="tabular">{children}</span>
        {caption && (
          <span className="text-xs tracking-wider whitespace-nowrap uppercase">
            {caption}
          </span>
        )}
      </span>
    </div>
  );
}
