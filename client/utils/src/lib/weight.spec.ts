import { SetStage, type Workout } from "@workout-tracker/types";
import {
  defaultWeightUnit,
  fromDisplayWeight,
  toDisplayWeight,
  workoutWeightsToKg,
} from "./weight";

describe("defaultWeightUnit", () => {
  it("uses pounds in the US", () => {
    expect(defaultWeightUnit("en-US")).toBe("lb");
  });

  it("uses kilograms elsewhere, and for a bare language", () => {
    expect(defaultWeightUnit("pt-BR")).toBe("kg");
    expect(defaultWeightUnit("en")).toBe("kg");
  });
});

describe("toDisplayWeight", () => {
  it("shows kilograms as they are, to 0.01", () => {
    expect(toDisplayWeight(61.2, "kg")).toBe(61.2);
    expect(toDisplayWeight(61.2345, "kg")).toBe(61.23);
  });

  it("shows kilograms in pounds, to 0.1", () => {
    expect(toDisplayWeight(61.235, "lb")).toBe(135);
    expect(toDisplayWeight(80, "lb")).toBe(176.4);
  });
});

describe("fromDisplayWeight", () => {
  it("keeps kilograms as typed", () => {
    expect(fromDisplayWeight(62.5, "kg")).toBe(62.5);
  });

  it("stores pounds as kilograms", () => {
    expect(fromDisplayWeight(135, "lb")).toBe(61.235);
  });

  it("reads a pound entry back as the same pounds", () => {
    for (const lb of [5, 45, 135, 140.5, 225]) {
      expect(toDisplayWeight(fromDisplayWeight(lb, "lb"), "lb")).toBe(lb);
    }
  });
});

describe("workoutWeightsToKg", () => {
  const workout: Workout = {
    id: "w1",
    name: "Legs",
    date: new Date(0),
    duration: 0,
    isComplete: true,
    activeSetId: null,
    exercises: [
      {
        id: "e1",
        name: "Squat",
        sets: [
          { id: "s1", stage: SetStage.Complete, defaultWeight: 225 },
          { id: "s2", stage: SetStage.Complete },
        ],
      },
    ],
  };

  it("converts recorded pounds to kilograms", () => {
    const converted = workoutWeightsToKg(workout, "lb");
    expect(converted.exercises[0].sets[0].defaultWeight).toBe(102.058);
    expect(converted.exercises[0].sets[1].defaultWeight).toBeUndefined();
  });

  it("leaves a workout recorded in kilograms untouched", () => {
    expect(workoutWeightsToKg(workout, "kg")).toBe(workout);
  });

  it("does not modify the workout it was given", () => {
    workoutWeightsToKg(workout, "lb");
    expect(workout.exercises[0].sets[0].defaultWeight).toBe(225);
  });
});
