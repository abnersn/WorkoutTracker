export interface StepperProps {
    /** What the buttons change, e.g. "reps". Used in the accessible names. */
    label: string;
    /** How much one press changes the value. Shown on the buttons. */
    step: number;
    /** Unit shown after the step, e.g. "s". */
    unit?: string;
    onDecrement: () => void;
    onIncrement: () => void;
    disableDecrement?: boolean;
    className?: string;
}
/**
 * One tinted control with a minus and a plus half. Each half says its own
 * step (-5 / +5), so reps, weight and rest steppers differ at a glance.
 */
export declare function Stepper({ label, step, unit, onDecrement, onIncrement, disableDecrement, className, }: StepperProps): import("react").JSX.Element;
