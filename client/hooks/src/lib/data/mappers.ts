// Translates between the GraphQL shapes and the domain types the screens use,
// so nothing outside this folder knows the data comes from GraphQL.
import type {
  CreateLogInput,
  ExerciseFieldsFragment,
  ExerciseInput,
  LogFieldsFragment,
  SetStage as GqlSetStage,
  WorkoutFieldsFragment,
} from "@workout-tracker/api";
import {
  SetStage,
  type Exercise,
  type LogEntry,
  type Workout,
  type WorkoutSet,
} from "@workout-tracker/types";

type WorkoutLike = Omit<WorkoutFieldsFragment, "__typename">;

// The domain enum's values are the schema's (mappers.spec.ts checks), so
// these are casts, not lookups.
const toStage = (stage: GqlSetStage): SetStage => stage as SetStage;
const toGqlStage = (stage: SetStage): GqlSetStage => stage as GqlSetStage;

/** Drops null and undefined fields: the domain types mark them optional. */
function present<T extends object>(
  value: T,
): {
  [K in keyof T]: Exclude<T[K], null>;
} {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== null && v !== undefined),
  ) as { [K in keyof T]: Exclude<T[K], null> };
}

function toExercise(exercise: ExerciseFieldsFragment): Exercise {
  return present({
    id: exercise.id,
    name: exercise.name,
    rpe: exercise.rpe,
    sets: exercise.sets.map((set): WorkoutSet =>
      present({
        id: set.id,
        stage: toStage(set.stage),
        defaultReps: set.defaultReps,
        defaultWeight: set.defaultWeight,
        defaultRestTime: set.defaultRestTime,
        restStartedAt: set.restStartedAt,
      }),
    ),
  });
}

export function toWorkout(workout: WorkoutLike): Workout {
  return {
    id: workout.id,
    name: workout.name,
    date: new Date(workout.date),
    duration: workout.duration,
    isComplete: workout.isComplete,
    activeSetId: workout.activeSetId,
    activeExerciseId: workout.activeExerciseId,
    exercises: workout.exercises.map(toExercise),
  };
}

export function toLogEntry(
  log: Omit<LogFieldsFragment, "__typename">,
): LogEntry {
  return { ...toWorkout(log), workoutId: log.workoutId };
}

/**
 * A fresh run of a saved workout or of a past log: today, nothing done, no
 * effort rated. A repeated log is a new run of its workout, not of the log.
 */
export function startRun(source: Workout | LogEntry): Workout {
  const id = "workoutId" in source ? source.workoutId : source.id;
  return {
    id,
    name: source.name,
    date: new Date(),
    duration: 0,
    isComplete: false,
    activeSetId: source.activeSetId,
    activeExerciseId: source.activeExerciseId,
    exercises: source.exercises.map(({ rpe: _rpe, ...exercise }) => ({
      ...exercise,
      sets: exercise.sets.map(({ restStartedAt: _rest, ...set }) => ({
        ...set,
        stage: SetStage.Idle,
      })),
    })),
  };
}

/** A logged workout as shown in view mode: every set it kept was done. */
export function asFinished(log: LogEntry): LogEntry {
  return {
    ...log,
    exercises: log.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({ ...set, stage: SetStage.Complete })),
    })),
  };
}

const SERVER_ID = /^[0-9a-f]{24}$/i;

/**
 * Ids the server gave out are kept. Ids the client made up for exercises and
 * sets added mid-workout (see genId) are dropped, so the server assigns them.
 */
const serverId = (id: string | null | undefined): string | undefined =>
  id && SERVER_ID.test(id) ? id : undefined;

export function toExerciseInputs(exercises: Exercise[]): ExerciseInput[] {
  return exercises.map((exercise) => ({
    id: serverId(exercise.id),
    name: exercise.name,
    rpe: exercise.rpe,
    sets: exercise.sets.map((set) => ({
      id: serverId(set.id),
      stage: toGqlStage(set.stage),
      defaultReps: set.defaultReps,
      defaultWeight: set.defaultWeight,
      defaultRestTime: set.defaultRestTime,
      restStartedAt: set.restStartedAt,
    })),
  }));
}

export function toCreateLogInput(log: LogEntry): CreateLogInput {
  return {
    workoutId: log.workoutId,
    name: log.name,
    date: log.date.toISOString(),
    duration: Math.round(log.duration),
    isComplete: log.isComplete,
    activeSetId: serverId(log.activeSetId),
    activeExerciseId: serverId(log.activeExerciseId),
    exercises: toExerciseInputs(log.exercises),
  };
}
