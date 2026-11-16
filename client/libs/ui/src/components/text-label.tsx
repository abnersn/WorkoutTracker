import type { ElementType } from "react";
import { cn } from "./tone";
import { type PolymorphicProps } from "@workout-tracker/types/utils";

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
}: TextLabelProps<T>): React.JSX.Element {
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
