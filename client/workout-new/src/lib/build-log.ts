import { SetStage, type Workout } from "@workout-tracker/types";

/** Values a set shows when nothing was ever entered for it. */
export const SET_DEFAULTS = {
  defaultDurationTime: 0,
  defaultReps: 8,
  defaultWeight: 10,
  defaultRestTime: 30,
} as const;

/** The exercises as they should be stored: every set carries explicit values. */
export function normalizeExercises(workout: Workout): Workout["exercises"] {
  return workout.exercises.map((exercise) => ({
    ...exercise,
    type: exercise.type ?? "weight",
    rpe: exercise.rpe ?? 5,
    sets: exercise.sets.map((set) => ({
      ...SET_DEFAULTS,
      ...stripUndefined(set),
      stage: SetStage.Complete,
    })),
  }));
}

function stripUndefined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T;
}

/** The history entry for a workout that was just finished. */
export function buildLog(
  workout: Workout,
  duration: number,
  date = new Date(),
): Workout {
  return {
    ...workout,
    date,
    duration,
    isComplete: true,
    activeSetId: null,
    activeExerciseId: null,
    exercises: normalizeExercises(workout),
  };
}
