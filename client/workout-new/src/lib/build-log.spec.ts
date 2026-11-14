import { SetStage, type Workout } from "@workout-tracker/types";
import { buildLog, SET_DEFAULTS } from "./build-log";

const workout: Workout = {
  id: "w1",
  name: "Push",
  date: new Date(0),
  duration: 0,
  isComplete: false,
  activeSetId: "s1",
  activeExerciseId: "e1",
  exercises: [
    {
      id: "e1",
      name: "Bench",
      sets: [
        { id: "s1", stage: SetStage.Resting, defaultReps: 5 },
        { id: "s2", stage: SetStage.Idle },
      ],
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

  it("completes every set and fills missing values with defaults", () => {
    const [set1, set2] = log.exercises[0].sets;
    expect(set1).toMatchObject({ stage: SetStage.Complete, defaultReps: 5 });
    expect(set1.defaultWeight).toBe(SET_DEFAULTS.defaultWeight);
    expect(set2).toMatchObject({ stage: SetStage.Complete, ...SET_DEFAULTS });
  });

  it("defaults rpe", () => {
    expect(log.exercises[0]).toMatchObject({ rpe: 5 });
  });

  it("does not mutate the input", () => {
    expect(workout.isComplete).toBe(false);
    expect(workout.exercises[0].sets[1].defaultReps).toBeUndefined();
  });
});
