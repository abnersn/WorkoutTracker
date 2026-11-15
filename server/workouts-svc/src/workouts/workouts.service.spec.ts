import { type Model, Types } from "mongoose";
import {
  errors,
  toLogId,
  toUserId,
  toWorkoutId,
} from "@workout-tracker/helpers";
import { type LogEntry, SetStage, type Workout } from "@workout-tracker/proto";
import { type LogEntryRecord, type WorkoutRecord } from "./workout.schema";
import { WorkoutsService } from "./workouts.service";

const USER_ID = toUserId("64b000000000000000000001");
const WORKOUT_ID = "64b0000000000000000000aa";
const LOG_ID = "64b0000000000000000000cc";
const EXERCISE_ID = "64b0000000000000000000e1";
const OTHER_EXERCISE_ID = "64b0000000000000000000e2";
const SET_ID = "64b0000000000000000000f1";
const OTHER_SET_ID = "64b0000000000000000000f2";
const DATE = { seconds: 1767323045, nanos: 0 };

// A workout mid-run: one exercise per id above, each with one set.
function body(overrides: Partial<Workout> = {}): Workout {
  return {
    id: WORKOUT_ID,
    name: "Push day",
    date: DATE,
    duration: 120,
    isComplete: true,
    activeExerciseId: EXERCISE_ID,
    activeSetId: SET_ID,
    exercises: [
      {
        id: EXERCISE_ID,
        name: "Bench",
        rpe: 8,
        sets: [
          {
            id: SET_ID,
            stage: SetStage.RESTING,
            defaultReps: 5,
            restStartedAt: 1767323000000,
          },
        ],
      },
      {
        id: OTHER_EXERCISE_ID,
        name: "Dips",
        sets: [{ id: OTHER_SET_ID, stage: SetStage.IDLE }],
      },
    ],
    ...overrides,
  };
}

const log = (overrides: Partial<Workout> = {}): LogEntry => ({
  ...body(overrides),
  id: LOG_ID,
  workoutId: WORKOUT_ID,
});

type Fields = Record<string, unknown>;

type FakeModel = {
  exec: jest.Mock;
  model: Record<
    "create" | "find" | "findOne" | "deleteOne" | "aggregate",
    jest.Mock
  >;
};

// Just enough of a Mongoose model: create() echoes the fields back as a
// stored document, and queries resolve to whatever each test queues.
function fakeModel(): FakeModel {
  const exec = jest.fn();
  const query = { sort: jest.fn(() => query), exec };
  return {
    exec,
    model: {
      create: jest.fn(async (fields: Fields) => ({
        _id: new Types.ObjectId(),
        ...fields,
      })),
      find: jest.fn(() => query),
      findOne: jest.fn(() => query),
      deleteOne: jest.fn(() => query),
      aggregate: jest.fn(() => query),
    },
  };
}

function setup(): {
  service: WorkoutsService;
  workouts: FakeModel;
  logs: FakeModel;
} {
  const workouts = fakeModel();
  const logs = fakeModel();
  const service = new WorkoutsService(
    workouts.model as unknown as Model<WorkoutRecord>,
    logs.model as unknown as Model<LogEntryRecord>,
  );
  return { service, workouts, logs };
}

// A loaded document that update tests can set() and save().
type StoredDoc = Fields & { set: jest.Mock; save: jest.Mock };

function storedDoc(fields: Fields): StoredDoc {
  const doc: StoredDoc = {
    ...fields,
    set: jest.fn((changes: Fields) => Object.assign(doc, changes)),
    save: jest.fn(async () => doc),
  };
  return doc;
}

const createdWith = (model: { create: jest.Mock }): Fields =>
  model.create.mock.calls[0][0];

describe("WorkoutsService", () => {
  describe("createWorkout (a template)", () => {
    it("ignores run-time state and stores a not-started workout", async () => {
      const { service, workouts } = setup();

      const res = await service.createWorkout(USER_ID, body());

      const saved = createdWith(workouts.model);
      expect(saved).toMatchObject({
        userId: USER_ID,
        isComplete: false,
        activeExerciseId: undefined,
        activeSetId: undefined,
        duration: 120,
      });
      const [bench] = saved.exercises as { sets: Fields[] }[];
      expect(bench.sets[0]).toMatchObject({
        stage: SetStage.IDLE,
        restStartedAt: undefined,
        defaultReps: 5,
      });
      expect(res).toMatchObject({ isComplete: false, activeSetId: undefined });
    });

    it("does not reject active ids it is going to ignore", async () => {
      const { service } = setup();

      await expect(
        service.createWorkout(USER_ID, body({ activeSetId: OTHER_SET_ID })),
      ).resolves.toBeDefined();
    });

    it("keeps server ids and assigns new ones for empty ids", async () => {
      const { service, workouts } = setup();
      const input = body();
      input.exercises[1].id = "";

      await service.createWorkout(USER_ID, input);

      const [bench, dips] = createdWith(workouts.model).exercises as {
        _id: Types.ObjectId;
      }[];
      expect(bench._id.equals(EXERCISE_ID)).toBe(true);
      expect(Types.ObjectId.isValid(dips._id)).toBe(true);
      expect(dips._id.equals(OTHER_EXERCISE_ID)).toBe(false);
    });

    it("rejects two sets with the same id", async () => {
      const { service } = setup();
      const input = body();
      input.exercises[1].sets[0].id = SET_ID;

      await expect(service.createWorkout(USER_ID, input)).rejects.toThrow(
        errors.InvalidArgumentError,
      );
    });
  });

  describe("updateWorkout", () => {
    it("loads the caller's workout, applies the template fields and saves", async () => {
      const { service, workouts } = setup();
      const doc = storedDoc({ _id: toWorkoutId(WORKOUT_ID), ...body() });
      workouts.exec.mockResolvedValue(doc);

      await service.updateWorkout(USER_ID, toWorkoutId(WORKOUT_ID), body());

      expect(workouts.model.findOne).toHaveBeenCalledWith({
        _id: toWorkoutId(WORKOUT_ID),
        userId: USER_ID,
      });
      expect(doc.set).toHaveBeenCalledWith(
        expect.objectContaining({ isComplete: false, activeSetId: undefined }),
      );
      expect(doc.save).toHaveBeenCalled();
    });

    it("returns NOT_FOUND for a workout the caller doesn't own", async () => {
      const { service, workouts } = setup();
      workouts.exec.mockResolvedValue(null);

      await expect(
        service.updateWorkout(USER_ID, toWorkoutId(WORKOUT_ID), body()),
      ).rejects.toThrow(errors.NotFoundError);
    });
  });

  describe("createLog (a run)", () => {
    function withWorkout(): ReturnType<typeof setup> {
      const ctx = setup();
      ctx.workouts.exec.mockResolvedValue({
        _id: toWorkoutId(WORKOUT_ID),
        userId: USER_ID,
      });
      return ctx;
    }

    it("keeps run-time state and links the caller's workout", async () => {
      const { service, logs } = withWorkout();

      await service.createLog(USER_ID, toWorkoutId(WORKOUT_ID), log());

      const saved = createdWith(logs.model);
      expect(saved).toMatchObject({
        userId: USER_ID,
        workoutId: toWorkoutId(WORKOUT_ID),
        isComplete: true,
      });
      expect((saved.activeSetId as Types.ObjectId).equals(SET_ID)).toBe(true);
      expect(saved).not.toHaveProperty("persistenceKey");
      const [bench] = saved.exercises as { sets: Fields[] }[];
      expect(bench.sets[0]).toMatchObject({
        stage: SetStage.RESTING,
        restStartedAt: 1767323000000,
      });
    });

    it("allows an active exercise with no active set", async () => {
      const { service } = withWorkout();

      await expect(
        service.createLog(
          USER_ID,
          toWorkoutId(WORKOUT_ID),
          log({ activeSetId: undefined }),
        ),
      ).resolves.toBeDefined();
    });

    it.each([
      [
        "an active set without an active exercise",
        { activeExerciseId: undefined },
      ],
      [
        "an active set from another exercise",
        { activeSetId: OTHER_SET_ID },
      ],
      [
        "an active exercise that isn't in the log",
        { activeExerciseId: "64b0000000000000000000e9" },
      ],
    ])("rejects %s", async (_, overrides) => {
      const { service, logs } = withWorkout();

      await expect(
        service.createLog(USER_ID, toWorkoutId(WORKOUT_ID), log(overrides)),
      ).rejects.toThrow(errors.InvalidArgumentError);
      expect(logs.model.create).not.toHaveBeenCalled();
    });

    it("returns NOT_FOUND when the workout isn't the caller's", async () => {
      const { service, workouts, logs } = setup();
      workouts.exec.mockResolvedValue(null);

      await expect(
        service.createLog(USER_ID, toWorkoutId(WORKOUT_ID), log()),
      ).rejects.toThrow(errors.NotFoundError);
      expect(logs.model.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteLog", () => {
    it("returns NOT_FOUND when nothing of the caller's was deleted", async () => {
      const { service, logs } = setup();
      logs.exec.mockResolvedValue({ deletedCount: 0 });

      await expect(service.deleteLog(USER_ID, toLogId(LOG_ID))).rejects.toThrow(
        errors.NotFoundError,
      );
      expect(logs.model.deleteOne).toHaveBeenCalledWith({
        _id: toLogId(LOG_ID),
        userId: USER_ID,
      });
    });
  });

  describe("getLastRuns", () => {
    it("groups the caller's logs by workout and maps the newest date", async () => {
      const { service, logs } = setup();
      const lastRunAt = new Date("2026-01-02T03:04:05.000Z");
      logs.exec.mockResolvedValue([
        { _id: toWorkoutId(WORKOUT_ID), lastRunAt },
      ]);

      const res = await service.getLastRuns(USER_ID, [toWorkoutId(WORKOUT_ID)]);

      expect(logs.model.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            userId: USER_ID,
            workoutId: { $in: [toWorkoutId(WORKOUT_ID)] },
          },
        },
        { $group: { _id: "$workoutId", lastRunAt: { $max: "$date" } } },
      ]);
      expect(res).toEqual([
        { workoutId: WORKOUT_ID, lastRunAt: { seconds: 1767323045, nanos: 0 } },
      ]);
    });

    it("skips the query for an empty batch", async () => {
      const { service, logs } = setup();

      await expect(service.getLastRuns(USER_ID, [])).resolves.toEqual([]);
      expect(logs.model.aggregate).not.toHaveBeenCalled();
    });
  });
});
