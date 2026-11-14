import type { ReactNode } from "react";
export interface WorkoutSummaryCardProps {
    name: string;
    /** Last run or completion date, already formatted. */
    meta?: ReactNode;
    /** Where the card goes when opened. */
    href: string;
    /** History entries are `primary`. */
    tone?: "neutral" | "primary";
    /** Name of the workout, used to label the delete button. */
    onRemove?: () => void;
    /** Client-side navigation supplied by the host; plain links are used without it. */
    navigate?: (to: string) => void;
    className?: string;
}
/** A finished workout in the history: open it, or delete it. */
export declare function WorkoutSummaryCard({ name, meta, href, tone, onRemove, navigate, className, }: WorkoutSummaryCardProps): import("react").JSX.Element;
