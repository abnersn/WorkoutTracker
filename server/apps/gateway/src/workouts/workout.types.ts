import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import {
  type Exercise,
  type KnownSetStage,
  type LogEntry,
  requireKnownSetStage,
  SetStage,
  toDate,
  type Workout,
  type WorkoutSet,
} from "@workout-tracker/proto";

// The proto enum minus UNRECOGNIZED, which is a decoding artifact, not a
// stage a client can hold or send.
export const SetStageGql = {
  IDLE: SetStage.IDLE,
  ACTIVE: SetStage.ACTIVE,
  RESTING: SetStage.RESTING,
  COMPLETE: SetStage.COMPLETE,
} as const satisfies Record<KnownSetStage, KnownSetStage>;

registerEnumType(SetStageGql, { name: "SetStage" });

@ObjectType("WorkoutSet")
export class WorkoutSetGql {
  @Field(() => ID) id!: string;
  @Field(() => SetStageGql) stage!: KnownSetStage;
  @Field(() => Int, { nullable: true }) defaultReps!: number | null;
  @Field(() => Float, { nullable: true, description: "Always kg." })
  defaultWeight!: number | null;
  @Field(() => Int, { nullable: true, description: "Seconds." })
  defaultRestTime!: number | null;
  // Epoch ms, as the client keeps it; it overflows Int, so Float.
  @Field(() => Float, {
    nullable: true,
    description: "Epoch ms the set started resting.",
  })
  restStartedAt!: number | null;
}

@ObjectType("Exercise")
export class ExerciseGql {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field(() => Int, { nullable: true, description: "1 to 10." })
  rpe!: number | null;
  @Field(() => [WorkoutSetGql]) sets!: WorkoutSetGql[];
}

// The fields a Workout and a LogEntry share, as WorkoutBody does in
// workouts-svc.
@ObjectType({ isAbstract: true })
export abstract class WorkoutBodyGql {
  @Field(() => ID) id!: string;
  @Field() name!: string;
  @Field() date!: Date;
  @Field(() => Int, { description: "Seconds." }) duration!: number;
  @Field() isComplete!: boolean;
  @Field(() => ID, { nullable: true }) activeSetId!: string | null;
  @Field(() => ID, { nullable: true }) activeExerciseId!: string | null;
  @Field(() => [ExerciseGql]) exercises!: ExerciseGql[];
}

/**
 * A saved workout: a template. workouts-svc stores it not started, so
 * isComplete is false, active ids are null and every set is IDLE.
 * `lastRunAt` is resolved separately, through a DataLoader.
 */
@ObjectType("Workout")
export class WorkoutGql extends WorkoutBodyGql {}

/** A run of a workout. `workoutId` may name a workout that was deleted since. */
@ObjectType("LogEntry")
export class LogEntryGql extends WorkoutBodyGql {
  @Field(() => ID) workoutId!: string;
}

const toWorkoutSetGql = (s: WorkoutSet): WorkoutSetGql => ({
  id: s.id,
  stage: requireKnownSetStage(s.stage),
  defaultReps: s.defaultReps ?? null,
  defaultWeight: s.defaultWeight ?? null,
  defaultRestTime: s.defaultRestTime ?? null,
  restStartedAt: s.restStartedAt ?? null,
});

const toExerciseGql = (e: Exercise): ExerciseGql => ({
  id: e.id,
  name: e.name,
  rpe: e.rpe ?? null,
  sets: e.sets.map(toWorkoutSetGql),
});

export const toWorkoutGql = (w: Workout): WorkoutGql => ({
  id: w.id,
  name: w.name,
  date: toDate(w.date),
  duration: w.duration,
  isComplete: w.isComplete,
  activeSetId: w.activeSetId || null,
  activeExerciseId: w.activeExerciseId || null,
  exercises: w.exercises.map(toExerciseGql),
});

export const toLogEntryGql = (l: LogEntry): LogEntryGql => ({
  ...toWorkoutGql(l),
  workoutId: l.workoutId,
});
