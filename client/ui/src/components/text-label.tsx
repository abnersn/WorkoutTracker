import type { ElementType, HTMLAttributes } from "react";
import { cn } from "./tone";

export interface TextLabelProps extends HTMLAttributes<HTMLElement> {
  small?: boolean;
  as?: ElementType;
}

export function TextLabel({
  small = false,
  as: Tag = "p",
  className,
  ...props
}: TextLabelProps) {
  return (
    <Tag
      className={cn(
        small ? "text-xs" : "text-sm",
        "tracking-wider uppercase",
        className,
      )}
      {...props}
    />
  );
}
