import { SetStage } from "@workout-tracker/types";
export type SetFieldName = "duration" | "reps" | "weight" | "rest";
export interface SetRowProps {
    stage: SetStage;
    /** Cardio sets show a time and no weight; weight sets show no time. */
    exerciseType?: "weight" | "cardio";
    /** Seconds. A negative value means the countdown ran out and is counting up. */
    duration?: number;
    reps: number;
    /** Not used by cardio sets. */
    weight?: number;
    /** Seconds, negative once the rest is overrun. */
    rest: number;
    isActive?: boolean;
    /** The only set in its exercise: no divider lines around it. */
    isOnly?: boolean;
    readOnly?: boolean;
    /** How much the steppers change a value. */
    repsStep?: number;
    weightStep?: number;
    /** Seconds the rest and time steppers change a value by. */
    restStep?: number;
    durationStep?: number;
    /** Formats seconds for the time fields, e.g. 90 -> 1:30. */
    formatTime?: (seconds: number) => string;
    onChange?: (field: SetFieldName, value: number) => void;
    /** The row was clicked or one of its fields was focused. */
    onActivate?: () => void;
}
/** One set: reps, weight and rest. Cardio swaps the weight for a time. */
export declare function SetRow({ stage, exerciseType, duration, reps, weight, rest, isActive, isOnly, readOnly, repsStep, weightStep, restStep, durationStep, formatTime, onChange, onActivate, }: SetRowProps): import("react").JSX.Element;
