import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn, focusRing, toneClass, type Tone } from "./tone";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Colour role. Defaults to the indigo brand colour. */
  tone?: Tone;
  /** `solid` is the main action; `ghost` is the quiet text button. Both sentence case. */
  variant?: "solid" | "ghost";
  icon?: ReactNode;
}

export function Button({
  tone = "neutral",
  variant = "solid",
  icon,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={cn(
        toneClass[tone],
        focusRing,
        "inline-flex min-h-11 [&_svg]:shrink-0 items-center justify-center gap-2 rounded-control whitespace-nowrap select-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid"
          ? "bg-tone-solid px-4 text-base font-semibold text-white enabled:hover:bg-tone-solid-hover enabled:active:bg-tone-solid-active"
          : "px-3 text-base text-tone-700 enabled:hover:bg-tone-50 enabled:active:bg-tone-100",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
