import type { Exercise, Workout, WorkoutSet } from "@workout-tracker/types";
import { SetStage } from "@workout-tracker/types";

// Scrapes the rendered workout DOM into a Workout.
function query<T extends Element = HTMLElement>(
  root: ParentNode,
  selector: string,
): T {
  const element = root.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}

export function getWorkout(id: string): Workout {
  const workout: Workout = {
    id,
    name: query(document, ".workout-name").textContent?.trim() ?? "",
    date: new Date(),
    duration: Number(query(document, ".workout-duration").dataset["value"]),
    isComplete: true,
    activeSetId: null,
    activeExerciseId: null,
    exercises: [],
  };

  for (const $exercise of document.querySelectorAll<HTMLElement>(".exercise")) {
    const exercise: Exercise = {
      id: $exercise.dataset["id"] ?? "",
      name: query($exercise, ".exercise-name").textContent?.trim() ?? "",
      type: $exercise.dataset["type"],
      sets: [],
    };

    for (const $set of $exercise.querySelectorAll<HTMLElement>(
      ".set-display",
    )) {
      const set: WorkoutSet = {
        id: $set.dataset["id"] ?? "",
        defaultDurationTime: Number(
          $set.querySelector<HTMLElement>(".time .value")?.dataset["value"],
        ),
        defaultReps: Number(query($set, ".reps .value").dataset["value"]),
        defaultWeight: Number(query($set, ".weight .value").dataset["value"]),
        defaultRestTime: Number(query($set, ".rest .value").dataset["value"]),
        stage: SetStage.Complete,
      };
      exercise.sets.push(set);
    }

    exercise.rpe =
      Number($exercise.querySelector<HTMLInputElement>(".rpe")?.value) || 5;
    workout.exercises.push(exercise);
  }

  return workout;
}

export function serializeWorkout(id: string): string {
  return JSON.stringify(getWorkout(id));
}
