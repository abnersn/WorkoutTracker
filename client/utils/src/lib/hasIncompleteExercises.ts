import type { Workout } from "@workout-tracker/types";
import { hasIncompleteSets } from "./hasIncompleteSets";

export function hasIncompleteExercises(workout: Workout): boolean {
  return workout.exercises.some(hasIncompleteSets);
}
