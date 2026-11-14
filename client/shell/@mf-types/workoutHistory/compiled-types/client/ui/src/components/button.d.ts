import type { ButtonHTMLAttributes, ReactNode } from "react";
import { type Tone } from "./tone";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Colour role. Defaults to the indigo brand colour. */
    tone?: Tone;
    /** `solid` is the main action; `ghost` is the quiet text button. */
    variant?: "solid" | "ghost";
    icon?: ReactNode;
}
export declare function Button({ tone, variant, icon, type, className, children, ...props }: ButtonProps): import("react").JSX.Element;
