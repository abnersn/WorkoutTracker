import { type Dispatch } from "react";
import { type WorkoutAction, type WorkoutSet } from "@workout-tracker/types";
export interface SetItemProps {
    exerciseId: string;
    exerciseType: "weight" | "cardio";
    set: WorkoutSet;
    isActive: boolean;
    isOnly: boolean;
    readOnly: boolean;
    dispatch: Dispatch<WorkoutAction>;
}
/**
 * One set wired to the workout: its values live in the reducer, while the
 * time and rest countdowns tick locally while the set is in the matching stage.
 */
export declare function SetItem({ exerciseId, exerciseType, set, isActive, isOnly, readOnly, dispatch, }: SetItemProps): import("react").JSX.Element;
