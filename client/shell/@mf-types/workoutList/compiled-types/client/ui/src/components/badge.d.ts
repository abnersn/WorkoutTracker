import type { ReactNode } from "react";
import { type Tone } from "./tone";
export interface BadgeProps {
    tone?: Tone;
    icon?: ReactNode;
    /** Small uppercase text after the value, such as a date. */
    caption?: ReactNode;
    className?: string;
    children: ReactNode;
}
/** A compact read-out: the running workout clock and its date. */
export declare function Badge({ tone, icon, caption, className, children, }: BadgeProps): import("react").JSX.Element;
