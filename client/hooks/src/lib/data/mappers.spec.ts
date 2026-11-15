import type { LogFieldsFragment } from "@workout-tracker/api";
import { SetStage } from "@workout-tracker/types";
import {
  asFinished,
  startRun,
  toCreateLogInput,
  toExerciseInputs,
  toLogEntry,
} from "./mappers";

const log: LogFieldsFragment = {
  __typename: "LogEntry",
  id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  workoutId: "bbbbbbbbbbbbbbbbbbbbbbbb",
  name: "Push day",
  date: "2026-11-01T10:00:00.000Z",
  duration: 1800,
  isComplete: true,
  activeSetId: null,
  activeExerciseId: null,
  exercises: [
    {
      __typename: "Exercise",
      id: "cccccccccccccccccccccccc",
      name: "Bench press",
      rpe: 8,
      sets: [
        {
          __typename: "WorkoutSet",
          id: "dddddddddddddddddddddddd",
          stage: "COMPLETE",
          defaultReps: 5,
          defaultWeight: 100,
          defaultRestTime: null,
          restStartedAt: 1_700_000_000_000,
        },
      ],
    },
  ],
};

describe("SetStage", () => {
  it("uses the schema's enum values, so the mappers can cast", () => {
    expect(Object.values(SetStage).sort()).toEqual([
      "ACTIVE",
      "COMPLETE",
      "IDLE",
      "RESTING",
    ]);
  });
});

describe("toLogEntry", () => {
  it("parses the date and drops null fields", () => {
    const entry = toLogEntry(log);
    expect(entry.date).toEqual(new Date("2026-11-01T10:00:00.000Z"));
    expect(entry.workoutId).toBe(log.workoutId);
    expect(entry.exercises[0].sets[0]).toEqual({
      id: "dddddddddddddddddddddddd",
      stage: SetStage.Complete,
      defaultReps: 5,
      defaultWeight: 100,
      restStartedAt: 1_700_000_000_000,
    });
  });
});

describe("startRun", () => {
  it("repeats a log as a fresh run of its workout", () => {
    const run = startRun(toLogEntry(log));
    expect(run.id).toBe(log.workoutId);
    expect("workoutId" in run).toBe(false);
    expect(run.duration).toBe(0);
    expect(run.isComplete).toBe(false);
    expect(run.exercises[0].rpe).toBeUndefined();
    expect(run.exercises[0].sets[0].stage).toBe(SetStage.Idle);
    expect(run.exercises[0].sets[0].restStartedAt).toBeUndefined();
    expect(run.exercises[0].sets[0].defaultWeight).toBe(100);
  });
});

describe("asFinished", () => {
  it("marks every kept set done", () => {
    const entry = toLogEntry({
      ...log,
      exercises: [
        {
          ...log.exercises[0],
          sets: [{ ...log.exercises[0].sets[0], stage: "IDLE" }],
        },
      ],
    });
    expect(asFinished(entry).exercises[0].sets[0].stage).toBe(
      SetStage.Complete,
    );
  });
});

describe("toExerciseInputs", () => {
  it("keeps server ids and leaves client-made ones for the server", () => {
    const [exercise] = toExerciseInputs([
      {
        id: "cccccccccccccccccccccccc",
        name: "Bench press",
        sets: [
          { id: "dddddddddddddddddddddddd", stage: SetStage.Complete },
          { id: "3f2b8c1e-6d4a-4e2b-9a7c-1b2c3d4e5f60", stage: SetStage.Idle },
        ],
      },
      { id: "0e1f2a3b-4c5d-4e6f-8a9b-0c1d2e3f4a5b", name: "Dips", sets: [] },
    ]);
    expect(exercise.id).toBe("cccccccccccccccccccccccc");
    expect(exercise.sets.map((set) => set.id)).toEqual([
      "dddddddddddddddddddddddd",
      undefined,
    ]);
  });
});

describe("toCreateLogInput", () => {
  it("sends the date as an ISO string", () => {
    const input = toCreateLogInput(toLogEntry(log));
    expect(input.date).toBe("2026-11-01T10:00:00.000Z");
    expect(input.workoutId).toBe(log.workoutId);
  });
});
