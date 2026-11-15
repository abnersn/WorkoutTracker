import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { type HydratedDocument, type Model, Types } from "mongoose";
import {
  type Exercise,
  fromDate,
  type LastRun,
  type LogEntry,
  SetStage,
  toDate,
  type Workout,
  type WorkoutSet,
} from "@workout-tracker/proto";
import {
  errors,
  type LogId,
  type UserId,
  type WorkoutId,
} from "@workout-tracker/helpers";
import {
  type ExerciseRecord,
  type WorkoutBody,
  LogEntryRecord,
  WorkoutRecord,
  type WorkoutSetRecord,
} from "./workout.schema";

type WorkoutFields = Omit<WorkoutBody, "createdAt" | "userId">;

function toSet(set: WorkoutSetRecord): WorkoutSet {
  return {
    id: set._id.toString(),
    stage: set.stage,
    defaultReps: set.defaultReps,
    defaultWeight: set.defaultWeight,
    defaultRestTime: set.defaultRestTime,
    restStartedAt: set.restStartedAt,
  };
}

function toExercise(exercise: ExerciseRecord): Exercise {
  return {
    id: exercise._id.toString(),
    name: exercise.name,
    rpe: exercise.rpe,
    sets: exercise.sets.map(toSet),
  };
}

function toWorkout(doc: WorkoutRecord | LogEntryRecord): Workout {
  return {
    id: doc._id.toString(),
    name: doc.name,
    date: fromDate(doc.date),
    duration: doc.duration,
    isComplete: doc.isComplete,
    activeSetId: doc.activeSetId?.toString(),
    activeExerciseId: doc.activeExerciseId?.toString(),
    exercises: doc.exercises.map(toExercise),
  };
}

function toLog(doc: LogEntryRecord): LogEntry {
  return {
    ...toWorkout(doc),
    workoutId: doc.workoutId.toString(),
  };
}

const toObjectId = (id: string): Types.ObjectId =>
  id ? new Types.ObjectId(id) : new Types.ObjectId();

function assertUnique(ids: Types.ObjectId[], label: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    const key = id.toString();
    if (seen.has(key)) {
      throw new errors.InvalidArgumentError(`duplicate ${label} id ${key}`);
    }
    seen.add(key);
  }
}

type ActiveIds = Pick<WorkoutFields, "activeExerciseId" | "activeSetId">;
type ExerciseFields = WorkoutFields["exercises"][number];

// The client can have an active exercise with no active set, but an active
// set always sits in the active exercise.
function activeIds(
  workout: Workout | LogEntry,
  exercises: ExerciseFields[],
): ActiveIds {
  const { activeExerciseId, activeSetId } = workout;
  if (activeExerciseId === undefined) {
    if (activeSetId !== undefined) {
      throw new errors.InvalidArgumentError(
        "activeSetId needs an activeExerciseId",
      );
    }
    return { activeExerciseId: undefined, activeSetId: undefined };
  }
  const exercise = exercises.find((candidate) =>
    candidate._id.equals(activeExerciseId),
  );
  if (!exercise) {
    throw new errors.InvalidArgumentError(
      `activeExerciseId ${activeExerciseId} is not in this workout`,
    );
  }
  if (activeSetId === undefined) {
    return { activeExerciseId: exercise._id, activeSetId: undefined };
  }
  const set = exercise.sets.find((candidate) =>
    candidate._id.equals(activeSetId),
  );
  if (!set) {
    throw new errors.InvalidArgumentError(
      `activeSetId ${activeSetId} is not in exercise ${activeExerciseId}`,
    );
  }
  return { activeExerciseId: exercise._id, activeSetId: set._id };
}

// A saved workout is a template: progress only means something while it is
// being run, in a log. So for templates the server ignores the client's
// stage, restStartedAt, isComplete and active ids, and stores a fresh,
// not-started state instead.
type Kind = "template" | "run";

// Every key is written, even when undefined, so doc.set() on update also
// clears optional fields the client dropped.
function toFields(workout: Workout | LogEntry, kind: Kind): WorkoutFields {
  const run = kind === "run";
  const exercises = workout.exercises.map((exercise) => ({
    _id: toObjectId(exercise.id),
    name: exercise.name,
    rpe: exercise.rpe,
    sets: exercise.sets.map((set) => ({
      _id: toObjectId(set.id),
      stage: run ? set.stage : SetStage.IDLE,
      defaultReps: set.defaultReps,
      defaultWeight: set.defaultWeight,
      defaultRestTime: set.defaultRestTime,
      restStartedAt: run ? set.restStartedAt : undefined,
    })),
  }));
  assertUnique(
    exercises.map((exercise) => exercise._id),
    "exercise",
  );
  assertUnique(
    exercises.flatMap((exercise) => exercise.sets.map((set) => set._id)),
    "set",
  );
  return {
    name: workout.name,
    date: toDate(workout.date),
    duration: workout.duration,
    isComplete: run && workout.isComplete,
    ...(run
      ? activeIds(workout, exercises)
      : { activeExerciseId: undefined, activeSetId: undefined }),
    exercises,
  };
}

// Records are scoped to their owner: someone else's id is NOT_FOUND, not
// PERMISSION_DENIED, so callers can't probe which ids exist.
async function findOrThrow<T extends WorkoutRecord | LogEntryRecord>(
  model: Model<T>,
  id: T["_id"],
  userId: UserId,
  label: string,
): Promise<HydratedDocument<T>> {
  const doc = await model.findOne({ _id: id, userId }).exec();
  if (!doc) {
    throw new errors.NotFoundError(`${label} ${id} not found`);
  }
  return doc;
}

async function deleteOrThrow<T extends WorkoutRecord | LogEntryRecord>(
  model: Model<T>,
  id: T["_id"],
  userId: UserId,
  label: string,
): Promise<void> {
  const { deletedCount } = await model.deleteOne({ _id: id, userId }).exec();
  if (deletedCount === 0) {
    throw new errors.NotFoundError(`${label} ${id} not found`);
  }
}

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(WorkoutRecord.name)
    private readonly workouts: Model<WorkoutRecord>,
    @InjectModel(LogEntryRecord.name)
    private readonly logs: Model<LogEntryRecord>,
  ) {}

  async listWorkouts(userId: UserId): Promise<Workout[]> {
    const docs = await this.workouts
      .find({ userId })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map(toWorkout);
  }

  async getWorkout(userId: UserId, id: WorkoutId): Promise<Workout> {
    return toWorkout(await findOrThrow(this.workouts, id, userId, "workout"));
  }

  async createWorkout(userId: UserId, workout: Workout): Promise<Workout> {
    const doc = await this.workouts.create({
      ...toFields(workout, "template"),
      userId,
    });
    return toWorkout(doc);
  }

  async updateWorkout(
    userId: UserId,
    id: WorkoutId,
    workout: Workout,
  ): Promise<Workout> {
    const doc = await findOrThrow(this.workouts, id, userId, "workout");
    doc.set(toFields(workout, "template"));
    await doc.save();
    return toWorkout(doc);
  }

  deleteWorkout(userId: UserId, id: WorkoutId): Promise<void> {
    return deleteOrThrow(this.workouts, id, userId, "workout");
  }

  async listLogs(userId: UserId): Promise<LogEntry[]> {
    const docs = await this.logs.find({ userId }).sort({ date: -1 }).exec();
    return docs.map(toLog);
  }

  async getLog(userId: UserId, id: LogId): Promise<LogEntry> {
    return toLog(await findOrThrow(this.logs, id, userId, "log"));
  }

  // A log can only be run from one of the caller's own workouts.
  async createLog(
    userId: UserId,
    workoutId: WorkoutId,
    log: LogEntry,
  ): Promise<LogEntry> {
    const workout = await findOrThrow(
      this.workouts,
      workoutId,
      userId,
      "workout",
    );
    const doc = await this.logs.create({
      ...toFields(log, "run"),
      userId: workout.userId,
      workoutId: workout._id,
    });
    return toLog(doc);
  }

  // workoutId is fixed at creation: a log keeps pointing at the workout it
  // was run from, even after that workout is deleted.
  async updateLog(userId: UserId, id: LogId, log: LogEntry): Promise<LogEntry> {
    const doc = await findOrThrow(this.logs, id, userId, "log");
    doc.set(toFields(log, "run"));
    await doc.save();
    return toLog(doc);
  }

  deleteLog(userId: UserId, id: LogId): Promise<void> {
    return deleteOrThrow(this.logs, id, userId, "log");
  }

  // The newest log date of each workout, in one grouped query. Ids that
  // were never run, or belong to another user, simply match no logs.
  async getLastRuns(
    userId: UserId,
    workoutIds: WorkoutId[],
  ): Promise<LastRun[]> {
    if (workoutIds.length === 0) {
      return [];
    }
    // aggregate() skips Mongoose's casting, so the ids must already be
    // ObjectIds; the branded types guarantee that.
    const rows = await this.logs
      .aggregate<{ _id: WorkoutId; lastRunAt: Date }>([
        { $match: { userId, workoutId: { $in: workoutIds } } },
        { $group: { _id: "$workoutId", lastRunAt: { $max: "$date" } } },
      ])
      .exec();
    return rows.map((row) => ({
      workoutId: row._id.toString(),
      lastRunAt: fromDate(row.lastRunAt),
    }));
  }
}
