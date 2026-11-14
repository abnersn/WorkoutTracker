import { type ReactNode } from "react";
import type { Tone } from "./tone";
export interface DialogProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children?: ReactNode;
    actions?: ReactNode;
}
/** A modal on the native <dialog>: focus is trapped and Escape closes it. */
export declare function Dialog({ open, title, onClose, children, actions, }: DialogProps): import("react").JSX.Element;
export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel: string;
    cancelLabel?: string;
    /** `danger` for deletes, `primary` for saves. */
    tone?: Extract<Tone, "primary" | "danger" | "success">;
    onConfirm: () => void;
    onCancel: () => void;
}
/** Replaces window.confirm for deletes and for saving a finished workout. */
export declare function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, tone, onConfirm, onCancel, }: ConfirmDialogProps): import("react").JSX.Element;
