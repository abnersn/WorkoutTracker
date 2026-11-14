import type { HTMLAttributes } from "react";
import { cn } from "./tone";

/** The page column, centred and as tall as the screen, on the same white as the page: one continuous surface. */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-dvh max-w-5xl flex-col bg-white",
        className,
      )}
      {...props}
    />
  );
}
