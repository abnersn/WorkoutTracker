import type { HTMLAttributes } from "react";
import { cn } from "./tone";

/** Pinned to the bottom of the Container; holds the clock and the stage buttons. */
export function ActionBar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "sticky bottom-0 mt-auto flex items-center justify-end gap-2 border-t border-indigo-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    />
  );
}
