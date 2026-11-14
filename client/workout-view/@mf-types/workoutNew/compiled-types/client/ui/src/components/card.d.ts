import type { HTMLAttributes } from "react";
import { type Tone } from "./tone";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    tone?: Tone;
    /** `panel` groups content on a tinted ground; `item` is a white block inside one. Both
     * use the same inset; an item's radius is the panel's minus that inset, so they nest. */
    variant?: "panel" | "item";
    isActive?: boolean;
}
export declare function Card({ tone, variant, isActive, className, ...props }: CardProps): import("react").JSX.Element;
