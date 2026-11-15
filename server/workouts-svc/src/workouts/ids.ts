import { Types } from "mongoose";

declare const kind: unique symbol;

// An ObjectId tagged with what it identifies, so a WorkoutId can't be passed
// where a UserId is expected. At runtime it is a plain ObjectId; only the
// type differs.
export type Id<Kind extends string> = Types.ObjectId & {
  readonly [kind]: Kind;
};

export type UserId = Id<"User">;
export type WorkoutId = Id<"Workout">;
export type LogId = Id<"Log">;

// Expects a valid ObjectId string; validate it first (the controllers do).
export const toUserId = (id: string): UserId =>
  new Types.ObjectId(id) as UserId;
export const toWorkoutId = (id: string): WorkoutId =>
  new Types.ObjectId(id) as WorkoutId;
export const toLogId = (id: string): LogId => new Types.ObjectId(id) as LogId;
