import { type SchemaType } from "mongoose";
import { LogEntrySchema, WorkoutSchema } from "./workout.schema";

const shared = [
  "userId",
  "name",
  "date",
  "duration",
  "isComplete",
  "activeSetId",
  "activeExerciseId",
  "exercises",
];

describe("workout schemas", () => {
  it("gives workouts every WorkoutBody field", () => {
    expect(Object.keys(WorkoutSchema.paths)).toEqual(
      expect.arrayContaining(shared),
    );
  });

  it("gives logs every WorkoutBody field plus their own", () => {
    expect(Object.keys(LogEntrySchema.paths)).toEqual(
      expect.arrayContaining([...shared, "workoutId"]),
    );
  });

  it.each([
    ["workouts", WorkoutSchema],
    ["logs", LogEntrySchema],
  ])("stores %s' userId as a required, immutable ObjectId", (_, schema) => {
    const path: SchemaType = schema.paths["userId"];
    expect(path.instance).toBe("ObjectId");
    expect(path.isRequired).toBe(true);
    expect(path.options.immutable).toBe(true);
  });

  it("no longer stores persistenceKey", () => {
    expect(LogEntrySchema.paths).not.toHaveProperty("persistenceKey");
  });

  it.each([
    ["workouts", WorkoutSchema],
    ["logs", LogEntrySchema],
  ])("uses optimistic concurrency for %s", (_, schema) => {
    expect(schema.get("optimisticConcurrency")).toBe(true);
  });

  it("indexes logs for the getLastRuns lookup", () => {
    expect(LogEntrySchema.indexes().map(([fields]) => fields)).toContainEqual({
      userId: 1,
      workoutId: 1,
      date: -1,
    });
  });
});
