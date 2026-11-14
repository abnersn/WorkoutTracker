import { SetStage, type Exercise, type Workout } from "@workout-tracker/types";
import { hasIncompleteExercises } from "./hasIncompleteExercises";
import { hasIncompleteSets } from "./hasIncompleteSets";

const exercise = (...stages: SetStage[]): Exercise => ({
  id: "e",
  name: "Squat",
  sets: stages.map((stage, i) => ({ id: `s${i}`, stage })),
});

describe("hasIncompleteSets", () => {
  it("is true while any set is not complete", () => {
    expect(hasIncompleteSets(exercise(SetStage.Complete, SetStage.Idle))).toBe(
      true,
    );
  });

  it("is false when every set is complete", () => {
    expect(hasIncompleteSets(exercise(SetStage.Complete))).toBe(false);
  });
});

describe("hasIncompleteExercises", () => {
  it("checks every exercise", () => {
    const workout = {
      exercises: [exercise(SetStage.Complete), exercise(SetStage.Idle)],
    } as Workout;
    expect(hasIncompleteExercises(workout)).toBe(true);
  });
});
