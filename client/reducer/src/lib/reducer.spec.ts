import { SetStage, type Workout } from "@workout-tracker/types";
import { reducer } from "./reducer";

function makeWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: "w1",
    name: "Test workout",
    date: new Date(0),
    duration: 0,
    isComplete: false,
    exercises: [
      {
        id: "ex1",
        name: "Squat",
        sets: [
          { id: "s1", stage: SetStage.Idle },
          { id: "s2", stage: SetStage.Idle },
        ],
      },
      {
        id: "ex2",
        name: "Bench",
        sets: [{ id: "s3", stage: SetStage.Idle }],
      },
    ],
    activeSetId: "s1",
    activeExerciseId: "ex1",
    ...overrides,
  };
}

describe("reducer", () => {
  it("SET_WORKOUT replaces the state with the payload", () => {
    const next = makeWorkout({ activeSetId: null });
    const result = reducer(makeWorkout(), {
      type: "SET_WORKOUT",
      payload: next,
    });
    expect(result).toEqual(next);
  });

  it("does not mutate the input state", () => {
    const state = makeWorkout();
    const snapshot = structuredClone(state);
    reducer(state, { type: "ADD_EXERCISE", payload: { name: "Row" } });
    expect(state).toEqual(snapshot);
  });

  it("ADD_SET appends an IDLE set to the exercise and activates it", () => {
    const result = reducer(makeWorkout(), {
      type: "ADD_SET",
      payload: { exerciseId: "ex1" },
    });
    const sets = result.exercises[0].sets;
    expect(sets).toHaveLength(3);
    expect(sets[2]).toMatchObject({ stage: SetStage.Idle });
    expect(result.activeSetId).toBe(sets[2].id);
  });

  it("ADD_SET throws when the exercise does not exist", () => {
    expect(() =>
      reducer(makeWorkout(), {
        type: "ADD_SET",
        payload: { exerciseId: "nope" },
      }),
    ).toThrow("Exercise not found: nope");
  });

  it("REMOVE_SET removes the active set and clears activeSetId", () => {
    const result = reducer(makeWorkout(), {
      type: "REMOVE_SET",
      payload: { exerciseId: "ex1" },
    });
    expect(result.exercises[0].sets.map((s) => s.id)).toEqual(["s2"]);
    expect(result.activeSetId).toBeNull();
  });

  it("REMOVE_SET is a no-op for the sets when no set is active", () => {
    const state = makeWorkout({ activeSetId: "missing" });
    const result = reducer(state, {
      type: "REMOVE_SET",
      payload: { exerciseId: "ex1" },
    });
    expect(result.exercises[0].sets).toHaveLength(2);
  });

  it("UPDATE_ACTIVE_SET sets the active set and exercise", () => {
    const result = reducer(makeWorkout(), {
      type: "UPDATE_ACTIVE_SET",
      payload: { setId: "s3", exerciseId: "ex2" },
    });
    expect(result.activeSetId).toBe("s3");
    expect(result.activeExerciseId).toBe("ex2");
  });

  it("UPDATE_SET_STAGE advances the active set and moves to the next set on COMPLETE", () => {
    const active = reducer(makeWorkout(), {
      type: "UPDATE_SET_STAGE",
    });
    expect(active.exercises[0].sets[0].stage).toBe(SetStage.Active);
    expect(active.activeSetId).toBe("s1");

    const resting = reducer(active, { type: "UPDATE_SET_STAGE" });
    expect(resting.exercises[0].sets[0].stage).toBe(SetStage.Resting);

    const complete = reducer(resting, { type: "UPDATE_SET_STAGE" });
    expect(complete.exercises[0].sets[0].stage).toBe(SetStage.Complete);
    expect(complete.activeSetId).toBe("s2");
  });

  it("UPDATE_SET_STAGE cycles back to IDLE after COMPLETE", () => {
    const state = makeWorkout({
      exercises: [
        {
          id: "ex1",
          name: "Squat",
          sets: [
            { id: "s1", stage: SetStage.Complete },
            { id: "s2", stage: SetStage.Idle },
          ],
        },
      ],
      activeSetId: "s1",
      activeExerciseId: "ex1",
    });
    const result = reducer(state, { type: "UPDATE_SET_STAGE" });
    expect(result.exercises[0].sets[0].stage).toBe(SetStage.Idle);
  });

  it("UPDATE_SET_STAGE clears activeSetId once every set is complete", () => {
    const state = makeWorkout({
      exercises: [
        {
          id: "ex1",
          name: "Squat",
          sets: [{ id: "s1", stage: SetStage.Resting }],
        },
      ],
      activeSetId: "s1",
      activeExerciseId: "ex1",
    });
    const result = reducer(state, { type: "UPDATE_SET_STAGE" });
    expect(result.exercises[0].sets[0].stage).toBe(SetStage.Complete);
    expect(result.activeSetId).toBeNull();
  });

  it("COMPLETE_EXERCISE activates the next exercise and its first set", () => {
    const result = reducer(makeWorkout(), { type: "COMPLETE_EXERCISE" });
    expect(result.activeExerciseId).toBe("ex2");
    expect(result.activeSetId).toBe("s3");
  });

  it("COMPLETE_EXERCISE wraps around to the first exercise", () => {
    const state = makeWorkout({ activeExerciseId: "ex2" });
    const result = reducer(state, { type: "COMPLETE_EXERCISE" });
    expect(result.activeExerciseId).toBe("ex1");
    expect(result.activeSetId).toBe("s1");
  });

  it("ADD_EXERCISE appends an exercise with no sets", () => {
    const result = reducer(makeWorkout(), {
      type: "ADD_EXERCISE",
      payload: { name: "Row" },
    });
    expect(result.exercises).toHaveLength(3);
    expect(result.exercises[2]).toMatchObject({ name: "Row", sets: [] });
    expect(typeof result.exercises[2].id).toBe("string");
  });

  it("COMPLETE_WORKOUT marks the workout as complete", () => {
    const result = reducer(makeWorkout(), { type: "COMPLETE_WORKOUT" });
    expect(result.isComplete).toBe(true);
  });

  it("MOVE_EXERCISE swaps an exercise with its neighbour", () => {
    const result = reducer(makeWorkout(), {
      type: "MOVE_EXERCISE",
      payload: { exerciseId: "ex1", factor: 1 },
    });
    expect(result.exercises.map((e) => e.id)).toEqual(["ex2", "ex1"]);
  });

  it("MOVE_EXERCISE clamps at the list boundaries", () => {
    const result = reducer(makeWorkout(), {
      type: "MOVE_EXERCISE",
      payload: { exerciseId: "ex1", factor: -5 },
    });
    expect(result.exercises.map((e) => e.id)).toEqual(["ex1", "ex2"]);
  });

  it("MOVE_EXERCISE ignores unknown exercise ids", () => {
    const state = makeWorkout();
    const result = reducer(state, {
      type: "MOVE_EXERCISE",
      payload: { exerciseId: "nope", factor: 1 },
    });
    expect(result).toEqual(state);
  });

  it("REMOVE_EXERCISE drops the matching exercise", () => {
    const result = reducer(makeWorkout(), {
      type: "REMOVE_EXERCISE",
      payload: { exerciseId: "ex1" },
    });
    expect(result.exercises.map((e) => e.id)).toEqual(["ex2"]);
  });

  it("UPDATE_SET merges the changes into the matching set only", () => {
    const result = reducer(makeWorkout(), {
      type: "UPDATE_SET",
      payload: {
        exerciseId: "ex1",
        setId: "s2",
        changes: { defaultReps: 12, defaultWeight: 40 },
      },
    });
    expect(result.exercises[0].sets[1]).toMatchObject({
      defaultReps: 12,
      defaultWeight: 40,
    });
    expect(result.exercises[0].sets[0].defaultReps).toBeUndefined();
  });

  it("UPDATE_EXERCISE_RPE stores the rating on the exercise", () => {
    const result = reducer(makeWorkout(), {
      type: "UPDATE_EXERCISE_RPE",
      payload: { exerciseId: "ex2", rpe: 8 },
    });
    expect(result.exercises[1].rpe).toBe(8);
    expect(result.exercises[0].rpe).toBeUndefined();
  });

  it("throws on an unknown action type", () => {
    expect(() =>
      reducer(makeWorkout(), { type: "BOGUS" } as unknown as Parameters<
        typeof reducer
      >[1]),
    ).toThrow();
  });
});
