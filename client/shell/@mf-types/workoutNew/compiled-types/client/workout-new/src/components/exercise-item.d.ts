import type { Dispatch } from "react";
import type { Exercise, WorkoutAction } from "@workout-tracker/types";
export interface ExerciseItemProps {
    exercise: Exercise;
    isFirst: boolean;
    isLast: boolean;
    isActive: boolean;
    activeSetId: string | null;
    /** The whole workout is finished, or it is being viewed from the history. */
    readOnly: boolean;
    dispatch: Dispatch<WorkoutAction>;
}
/** An exercise wired to the workout reducer. */
export declare function ExerciseItem({ exercise, isFirst, isLast, isActive, activeSetId, readOnly, dispatch, }: ExerciseItemProps): import("react").JSX.Element;
