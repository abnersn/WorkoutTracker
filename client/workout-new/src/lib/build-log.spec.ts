import { SetStage, type Workout } from "@workout-tracker/types";
import {
  buildLog,
  nextSetValues,
  normalizeExercises,
  SET_DEFAULTS,
  tallyWorkout,
} from "./build-log";

const workout: Workout = {
  id: "w1",
  name: "Push",
  date: new Date(0),
  duration: 0,
  isComplete: false,
  activeSetId: "s2",
  activeExerciseId: "e1",
  exercises: [
    {
      id: "e1",
      name: "Bench",
      rpe: 8,
      sets: [
        {
          id: "s1",
          stage: SetStage.Complete,
          defaultReps: 5,
          defaultWeight: 100,
        },
        { id: "s2", stage: SetStage.Idle },
      ],
    },
    {
      id: "e2",
      name: "Dips",
      sets: [{ id: "s3", stage: SetStage.Idle }],
    },
  ],
};

describe("buildLog", () => {
  const log = buildLog(workout, 754, new Date("2026-11-14T10:00:00Z"));

  it("marks the workout complete with its duration and date", () => {
    expect(log).toMatchObject({
      isComplete: true,
      duration: 754,
      activeSetId: null,
      activeExerciseId: null,
    });
    expect(log.date).toEqual(new Date("2026-11-14T10:00:00Z"));
  });

  it("keeps only the sets that were done, filling missing values", () => {
    expect(log.exercises[0].sets).toHaveLength(1);
    expect(log.exercises[0].sets[0]).toMatchObject({
      stage: SetStage.Complete,
      defaultReps: 5,
      defaultWeight: 100,
      defaultRestTime: SET_DEFAULTS.defaultRestTime,
    });
  });

  it("drops exercises with nothing done", () => {
    expect(log.exercises.map((e) => e.name)).toEqual(["Bench"]);
  });

  it("keeps a recorded effort and never invents one", () => {
    expect(log.exercises[0].rpe).toBe(8);
    const unrated = buildLog(
      {
        ...workout,
        exercises: [{ ...workout.exercises[0], rpe: undefined }],
      },
      1,
    );
    expect(unrated.exercises[0].rpe).toBeUndefined();
  });

  it("does not mutate the input", () => {
    expect(workout.isComplete).toBe(false);
    expect(workout.exercises[0].sets).toHaveLength(2);
  });
});

describe("normalizeExercises", () => {
  it("keeps every set with values and leaves the effort out of the template", () => {
    const [bench] = normalizeExercises(workout);
    expect(bench.sets).toHaveLength(2);
    expect(bench.sets[1]).toMatchObject(SET_DEFAULTS);
    expect(bench).not.toHaveProperty("rpe");
  });
});

describe("nextSetValues", () => {
  it("copies the previous set", () => {
    expect(nextSetValues(workout.exercises[0])).toMatchObject({
      defaultReps: SET_DEFAULTS.defaultReps,
    });
    expect(
      nextSetValues({
        ...workout.exercises[0],
        sets: [workout.exercises[0].sets[0]],
      }),
    ).toMatchObject({ defaultReps: 5, defaultWeight: 100 });
  });

  it("falls back to the defaults for a first set", () => {
    expect(nextSetValues({ id: "x", name: "x", sets: [] })).toEqual(
      SET_DEFAULTS,
    );
  });
});

describe("tallyWorkout", () => {
  it("counts logged and unlogged sets and the volume", () => {
    expect(tallyWorkout(workout)).toEqual({
      logged: 1,
      unlogged: 2,
      volume: 500,
    });
  });
});
