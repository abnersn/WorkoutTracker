import { Injectable } from "@nestjs/common";
import {
  type Exercise,
  fromDate,
  type LogEntry,
  SetStage,
  type Workout,
} from "@workout-tracker/proto";
import {
  CreateLogInput,
  CreateWorkoutInput,
  ExerciseInput,
  UpdateLogInput,
  UpdateWorkoutInput,
} from "./workout.inputs";
import {
  LogEntryGql,
  toLogEntryGql,
  toWorkoutGql,
  WorkoutGql,
} from "./workout.types";
import { WorkoutsClient } from "./workouts.client";

// workouts-svc reads an empty id as "new; assign one".
const NEW_ID = "";

export const toExercisesProto = (exercises: ExerciseInput[]): Exercise[] =>
  exercises.map((e) => ({
    id: e.id ?? NEW_ID,
    name: e.name,
    rpe: e.rpe ?? undefined,
    sets: e.sets.map((s) => ({
      id: s.id ?? NEW_ID,
      stage: s.stage ?? SetStage.IDLE,
      defaultReps: s.defaultReps ?? undefined,
      defaultWeight: s.defaultWeight ?? undefined,
      defaultRestTime: s.defaultRestTime ?? undefined,
      restStartedAt: s.restStartedAt ?? undefined,
    })),
  }));

// undefined keeps the current id; null clears it. An unset id is sent as
// undefined, never "", which workouts-svc rejects for active ids.
const patchId = (
  next: string | null | undefined,
  current: string | undefined,
): string | undefined =>
  next === undefined ? current || undefined : (next ?? undefined);

@Injectable()
export class WorkoutsService {
  constructor(private readonly client: WorkoutsClient) {}

  async listWorkouts(userId: string): Promise<WorkoutGql[]> {
    return (await this.client.listWorkouts(userId)).map(toWorkoutGql);
  }

  async getWorkout(id: string, userId: string): Promise<WorkoutGql> {
    return toWorkoutGql(await this.client.getWorkout(id, userId));
  }

  async createWorkout(
    input: CreateWorkoutInput,
    userId: string,
  ): Promise<WorkoutGql> {
    // A template has no run state; workouts-svc resets it either way.
    const workout: Workout = {
      id: NEW_ID,
      name: input.name,
      date: fromDate(new Date()),
      duration: 0,
      isComplete: false,
      exercises: toExercisesProto(input.exercises),
    };
    return toWorkoutGql(await this.client.createWorkout(workout, userId));
  }

  // workouts-svc replaces the whole workout, so the omitted fields are read
  // first. Two concurrent updates can still race between the read and the
  // write; the last one wins.
  async updateWorkout(
    input: UpdateWorkoutInput,
    userId: string,
  ): Promise<WorkoutGql> {
    const current = await this.client.getWorkout(input.id, userId);
    const workout: Workout = {
      ...current,
      name: input.name ?? current.name,
      exercises: input.exercises
        ? toExercisesProto(input.exercises)
        : current.exercises,
    };
    return toWorkoutGql(await this.client.updateWorkout(workout, userId));
  }

  async deleteWorkout(id: string, userId: string): Promise<string> {
    await this.client.deleteWorkout(id, userId);
    return id;
  }

  async listLogs(userId: string): Promise<LogEntryGql[]> {
    return (await this.client.listLogs(userId)).map(toLogEntryGql);
  }

  async getLog(id: string, userId: string): Promise<LogEntryGql> {
    return toLogEntryGql(await this.client.getLog(id, userId));
  }

  async getPreviousRun(
    logId: string,
    userId: string,
  ): Promise<LogEntryGql | null> {
    const previous = await this.client.getPreviousRun(logId, userId);
    return previous ? toLogEntryGql(previous) : null;
  }

  async createLog(input: CreateLogInput, userId: string): Promise<LogEntryGql> {
    const log: LogEntry = {
      id: NEW_ID,
      workoutId: input.workoutId,
      name: input.name,
      date: fromDate(input.date),
      duration: input.duration,
      isComplete: input.isComplete,
      activeSetId: input.activeSetId ?? undefined,
      activeExerciseId: input.activeExerciseId ?? undefined,
      exercises: toExercisesProto(input.exercises),
    };
    return toLogEntryGql(await this.client.createLog(log, userId));
  }

  // See updateWorkout: the same read-then-replace, with the same race.
  async updateLog(input: UpdateLogInput, userId: string): Promise<LogEntryGql> {
    const current = await this.client.getLog(input.id, userId);
    const log: LogEntry = {
      ...current,
      name: input.name ?? current.name,
      date: input.date ? fromDate(input.date) : current.date,
      duration: input.duration ?? current.duration,
      isComplete: input.isComplete ?? current.isComplete,
      activeSetId: patchId(input.activeSetId, current.activeSetId),
      activeExerciseId: patchId(
        input.activeExerciseId,
        current.activeExerciseId,
      ),
      exercises: input.exercises
        ? toExercisesProto(input.exercises)
        : current.exercises,
    };
    return toLogEntryGql(await this.client.updateLog(log, userId));
  }

  async deleteLog(id: string, userId: string): Promise<string> {
    await this.client.deleteLog(id, userId);
    return id;
  }
}
