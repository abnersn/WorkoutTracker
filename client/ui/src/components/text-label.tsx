import type { ElementType } from "react";
import { cn } from "./tone";
import { PolymorphicProps } from "@workout-tracker/types/utils";

export type TextLabelProps<T extends ElementType = "p"> = PolymorphicProps<
  T,
  {
    small?: boolean;
  }
>;

export function TextLabel<T extends ElementType = "p">({
  small = false,
  as,
  className,
  ...props
}: TextLabelProps<T>) {
  const Tag: ElementType = as ?? "p";
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
