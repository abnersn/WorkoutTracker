import type { ElementType } from "react";
import { PolymorphicProps } from "@workout-tracker/types/utils";
export type TextLabelProps<T extends ElementType = "p"> = PolymorphicProps<T, {
    small?: boolean;
}>;
export declare function TextLabel<T extends ElementType = "p">({ small, as, className, ...props }: TextLabelProps<T>): import("react").JSX.Element;
