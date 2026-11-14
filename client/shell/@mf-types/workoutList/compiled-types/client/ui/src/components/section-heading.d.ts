import type { HTMLAttributes } from "react";
export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    tone?: "neutral" | "primary";
}
export declare function SectionHeading({ tone, className, ...props }: SectionHeadingProps): import("react").JSX.Element;
