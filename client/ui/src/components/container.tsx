import type { HTMLAttributes } from "react";
import { cn } from "./tone";

/** The page column: a white sheet, centred, as tall as the screen. */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "m-auto flex min-h-dvh max-w-5xl flex-col border border-slate-200 bg-white shadow-md",
        className,
      )}
      {...props}
    />
  );
}
