import type { ReactNode } from "react";
export interface SavedWorkoutCardProps {
    name: string;
    /** Last run or completion date, already formatted. */
    meta?: ReactNode;
    /** Where the card goes when opened. */
    href: string;
    /** Name of the workout, used to label the delete button. */
    onRemove?: () => void;
    /** Client-side navigation supplied by the host; plain links are used without it. */
    navigate?: (to: string) => void;
    className?: string;
}
/** A saved workout: open it to start, or delete it. */
export declare function SavedWorkoutCard({ name, meta, href, onRemove, navigate, className, }: SavedWorkoutCardProps): import("react").JSX.Element;
