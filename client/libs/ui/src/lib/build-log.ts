import {
  SetStage,
  type Exercise,
  type LogEntry,
  type Workout,
  type WorkoutSet,
} from "@workout-tracker/types";
import { genId } from "@workout-tracker/utils";

/** Values a set shows when nothing was ever entered for it. */
export const SET_DEFAULTS = {
  defaultReps: 8,
  defaultWeight: 20,
  defaultRestTime: 90,
} as const;

function stripUndefined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T;
}

function withValues(set: WorkoutSet): WorkoutSet {
  // The rest timestamp only matters while the set is running.
  const values = { ...SET_DEFAULTS, ...stripUndefined(set) };
  delete values.restStartedAt;
  return { ...values, stage: SetStage.Complete };
}

/**
 * The exercises as a template: every set carries explicit values. Effort
 * ratings belong to a session, not a plan, so they are left out.
 */
export function normalizeExercises(workout: Workout): Exercise[] {
  return workout.exercises.map((exercise) => {
    const template: Exercise = {
      ...exercise,
      sets: exercise.sets.map(withValues),
    };
    delete template.rpe;
    return template;
  });
}

/**
 * The values a new set starts from: the set before it, so a lifter repeating
 * 5 × 100 kg doesn't re-enter it; the defaults for an exercise's first set.
 */
export function nextSetValues(
  exercise: Exercise,
): Pick<WorkoutSet, "defaultReps" | "defaultWeight" | "defaultRestTime"> {
  const last = exercise.sets[exercise.sets.length - 1];
  return {
    defaultReps: last?.defaultReps ?? SET_DEFAULTS.defaultReps,
    defaultWeight: last?.defaultWeight ?? SET_DEFAULTS.defaultWeight,
    defaultRestTime: last?.defaultRestTime ?? SET_DEFAULTS.defaultRestTime,
  };
}

export interface WorkoutTally {
  /** Sets that reached Done. */
  logged: number;
  /** Sets that were planned but never finished. */
  unlogged: number;
  /** Reps × weight over the logged sets. */
  volume: number;
}

export function tallyWorkout(workout: Workout): WorkoutTally {
  let logged = 0;
  let unlogged = 0;
  let volume = 0;
  for (const exercise of workout.exercises) {
    for (const set of exercise.sets) {
      if (set.stage === SetStage.Complete) {
        logged += 1;
        volume +=
          (set.defaultReps ?? SET_DEFAULTS.defaultReps) *
          (set.defaultWeight ?? SET_DEFAULTS.defaultWeight);
      } else {
        unlogged += 1;
      }
    }
  }
  return { logged, unlogged, volume };
}

/**
 * The history entry for a workout that was just finished. Only the sets that
 * were done are kept, so finishing early never records work that didn't happen;
 * an exercise with nothing done is dropped. An unrated effort stays unrated.
 * The log gets an id of its own; `workoutId` points back at the workout.
 */
export function buildLog(
  workout: Workout,
  duration: number,
  date = new Date(),
): LogEntry {
  const exercises = workout.exercises
    .map((exercise) => ({
      ...exercise,
      sets: exercise.sets
        .filter((set) => set.stage === SetStage.Complete)
        .map(withValues),
    }))
    .filter((exercise) => exercise.sets.length > 0);

  return {
    ...workout,
    id: genId(),
    workoutId: workout.id,
    date,
    duration,
    isComplete: true,
    activeSetId: null,
    activeExerciseId: null,
    exercises,
  };
}
