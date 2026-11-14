import { type Tone } from "@workout-tracker/ui";
export interface SetFieldProps {
    label: string;
    value: number;
    tone?: Tone;
    /** How the value reads when the field is not being edited, e.g. 90 -> 1:30. */
    format?: (value: number) => string;
    readOnly?: boolean;
    onChange?: (value: number) => void;
    /** Fires when editing starts and stops, so the row can become the active set. */
    onEditingChange?: (isEditing: boolean) => void;
    /** The one value to read at a glance: set larger and bolder. */
    prominent?: boolean;
    /** The current set: the value is set in a heavier weight. */
    strong?: boolean;
    /** A set that is waiting its turn: lighter text and no white well. */
    quiet?: boolean;
    /**
     * Slide a changed value in from the side it moved toward (up for more, down for
     * less). Turn it off for a running clock, which changes every second.
     */
    tick?: boolean;
}
/**
 * A number that reads as formatted text and turns into an input on focus.
 * It is always a real input, so keyboards and screen readers get a form field.
 */
export declare function SetField({ label, value, tone, format, readOnly, onChange, onEditingChange, prominent, strong, quiet, tick, }: SetFieldProps): import("react").JSX.Element;
