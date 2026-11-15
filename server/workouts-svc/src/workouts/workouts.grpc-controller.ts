import { Controller, UseFilters } from "@nestjs/common";
import type { Metadata } from "@grpc/grpc-js";
import { Ctx, Payload } from "@nestjs/microservices";
import {
  type CreateLogRequest,
  type CreateWorkoutRequest,
  type DeleteLogRequest,
  type DeleteWorkoutRequest,
  type GetLastRunsRequest,
  type GetLastRunsResponse,
  type GetLogRequest,
  type GetWorkoutRequest,
  type ListLogsRequest,
  type ListLogsResponse,
  type ListWorkoutsRequest,
  type ListWorkoutsResponse,
  type LogEntry,
  SetStage,
  type UpdateLogRequest,
  type UpdateWorkoutRequest,
  type Workout,
  type WorkoutsServiceController,
  WorkoutsServiceControllerMethods,
} from "@workout-tracker/proto";
import {
  toLogId,
  toWorkoutId,
  ZodPipe,
} from "@workout-tracker/helpers";
import { z } from "zod";
import { WorkoutsService } from "./workouts.service";
import { WorkoutsErrorsFilter } from "./workouts-errors.filter";
import { userIdFrom } from "./user-id";

const count = z.number().int().min(0);

const objectId = z.string().regex(/^[0-9a-f]{24}$/i, "must be an ObjectId");
const bodyId = z.literal("").or(objectId);

const timestamp = z.object({
  seconds: z.number().int(),
  nanos: z.number().int().min(0).max(999_999_999),
});

const workoutSetSchema = z.object({
  id: bodyId,
  stage: z.enum(SetStage).exclude([SetStage.UNRECOGNIZED]),
  defaultReps: count.optional(),
  defaultWeight: z.number().min(0).optional(),
  defaultRestTime: count.optional(),
  restStartedAt: count.optional(),
});

const exerciseSchema = z.object({
  id: bodyId,
  name: z.string().trim().min(1).max(100),
  rpe: z.number().int().min(1).max(10).optional(),
  sets: z.array(workoutSetSchema).max(100),
});

const workoutSchema = z.object({
  id: bodyId, // ignored on create
  name: z.string().trim().min(1).max(100),
  date: timestamp,
  duration: count,
  isComplete: z.boolean(),
  activeSetId: objectId.optional(),
  activeExerciseId: objectId.optional(),
  exercises: z.array(exerciseSchema).max(100),
});

const logEntrySchema = workoutSchema.extend({ workoutId: objectId });

const byIdSchema = z.object({ id: objectId });

export const createWorkoutSchema = z.object({ workout: workoutSchema });
export const updateWorkoutSchema = z.object({
  workout: workoutSchema.extend({ id: objectId }),
});
export const createLogSchema = z.object({ log: logEntrySchema });
export const updateLogSchema = z.object({
  log: logEntrySchema.extend({ id: objectId }),
});
// Matches the DataLoader batch the gateway sends for one page.
export const getLastRunsSchema = z.object({
  workoutIds: z.array(objectId).max(100),
});

@Controller()
@WorkoutsServiceControllerMethods()
@UseFilters(WorkoutsErrorsFilter)
export class WorkoutsGrpcController implements WorkoutsServiceController {
  constructor(private readonly workouts: WorkoutsService) {}

  async listWorkouts(
    _req: ListWorkoutsRequest,
    @Ctx() metadata: Metadata,
  ): Promise<ListWorkoutsResponse> {
    return {
      workouts: await this.workouts.listWorkouts(userIdFrom(metadata)),
    };
  }

  getWorkout(
    @Payload(new ZodPipe(byIdSchema)) req: GetWorkoutRequest,
    @Ctx() metadata: Metadata,
  ): Promise<Workout> {
    return this.workouts.getWorkout(userIdFrom(metadata), toWorkoutId(req.id));
  }

  createWorkout(
    @Payload(new ZodPipe(createWorkoutSchema)) req: CreateWorkoutRequest,
    @Ctx() metadata: Metadata,
  ): Promise<Workout> {
    return this.workouts.createWorkout(userIdFrom(metadata), req.workout as Workout);
  }

  updateWorkout(
    @Payload(new ZodPipe(updateWorkoutSchema)) req: UpdateWorkoutRequest,
    @Ctx() metadata: Metadata,
  ): Promise<Workout> {
    const workout = req.workout as Workout;
    return this.workouts.updateWorkout(
      userIdFrom(metadata),
      toWorkoutId(workout.id),
      workout,
    );
  }

  deleteWorkout(
    @Payload(new ZodPipe(byIdSchema)) req: DeleteWorkoutRequest,
    @Ctx() metadata: Metadata,
  ): Promise<void> {
    return this.workouts.deleteWorkout(userIdFrom(metadata), toWorkoutId(req.id));
  }

  async listLogs(
    _req: ListLogsRequest,
    @Ctx() metadata: Metadata,
  ): Promise<ListLogsResponse> {
    return { logs: await this.workouts.listLogs(userIdFrom(metadata)) };
  }

  getLog(
    @Payload(new ZodPipe(byIdSchema)) req: GetLogRequest,
    @Ctx() metadata: Metadata,
  ): Promise<LogEntry> {
    return this.workouts.getLog(userIdFrom(metadata), toLogId(req.id));
  }

  createLog(
    @Payload(new ZodPipe(createLogSchema)) req: CreateLogRequest,
    @Ctx() metadata: Metadata,
  ): Promise<LogEntry> {
    const log = req.log as LogEntry;
    return this.workouts.createLog(
      userIdFrom(metadata),
      toWorkoutId(log.workoutId),
      log,
    );
  }

  updateLog(
    @Payload(new ZodPipe(updateLogSchema)) req: UpdateLogRequest,
    @Ctx() metadata: Metadata,
  ): Promise<LogEntry> {
    const log = req.log as LogEntry;
    return this.workouts.updateLog(userIdFrom(metadata), toLogId(log.id), log);
  }

  deleteLog(
    @Payload(new ZodPipe(byIdSchema)) req: DeleteLogRequest,
    @Ctx() metadata: Metadata,
  ): Promise<void> {
    return this.workouts.deleteLog(userIdFrom(metadata), toLogId(req.id));
  }

  async getLastRuns(
    @Payload(new ZodPipe(getLastRunsSchema)) req: GetLastRunsRequest,
    @Ctx() metadata: Metadata,
  ): Promise<GetLastRunsResponse> {
    return {
      lastRuns: await this.workouts.getLastRuns(
        userIdFrom(metadata),
        req.workoutIds.map(toWorkoutId),
      ),
    };
  }
}
