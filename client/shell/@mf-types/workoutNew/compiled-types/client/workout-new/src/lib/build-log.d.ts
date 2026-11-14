import { type Workout } from "@workout-tracker/types";
/** Values a set shows when nothing was ever entered for it. */
export declare const SET_DEFAULTS: {
    readonly defaultDurationTime: 0;
    readonly defaultReps: 8;
    readonly defaultWeight: 10;
    readonly defaultRestTime: 30;
};
/** The exercises as they should be stored: every set carries explicit values. */
export declare function normalizeExercises(workout: Workout): Workout["exercises"];
/** The history entry for a workout that was just finished. */
export declare function buildLog(workout: Workout, duration: number, date?: Date): Workout;
