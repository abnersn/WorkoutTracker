import { SetStage, type Exercise } from "@workout-tracker/types";

export function hasIncompleteSets(exercise: Exercise): boolean {
  return exercise.sets.some((s) => s.stage !== SetStage.Complete);
}
