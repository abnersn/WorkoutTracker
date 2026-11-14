import type { ReactNode } from "react";
import { cn } from "./tone";

export function EmptyMessage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn("text-sm text-indigo-700", className)}>{children}</p>;
}
