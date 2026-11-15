import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./tone";

export interface ActionBarProps extends HTMLAttributes<HTMLDivElement> {
  /** A short-lived line above the buttons, such as an undo offer. */
  notice?: ReactNode;
}

/** Pinned to the bottom of the Container, in thumb reach; holds the clock and the main actions. */
export function ActionBar({
  className,
  notice,
  children,
  ...props
}: ActionBarProps): React.JSX.Element {
  return (
    <div className="sticky bottom-0 mt-auto border-t border-indigo-200 bg-white">
      {notice}
      <div
        className={cn(
          "flex items-center justify-end gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
