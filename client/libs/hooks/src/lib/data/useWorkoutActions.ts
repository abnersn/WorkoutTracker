import { useMutation } from "@apollo/client/react";
import type { Exercise, LogEntry, Workout } from "@workout-tracker/types";
import {
  CreateLogMutation,
  LogsQuery,
  UpdateLogMutation,
  UpdateWorkoutMutation,
  WorkoutsQuery,
} from "./documents";
import { toCreateLogInput, toExerciseInputs } from "./mappers";

export interface WorkoutActions {
  /** Adds a finished run to the history; resolves to its id. */
  finishWorkout: (log: LogEntry) => Promise<string>;
  /** Saves a finished run's effort ratings. */
  rateWorkout: (logId: string, workout: Workout) => Promise<void>;
  /** Makes these exercises the saved workout's plan. */
  saveTemplate: (workoutId: string, exercises: Exercise[]) => Promise<void>;
}

/** Writes made while running or reviewing a workout. Each rejects on failure. */
export function useWorkoutActions(): WorkoutActions {
  const [createLog] = useMutation(CreateLogMutation, {
    // A new history entry, and a new "last run" date on its workout.
    refetchQueries: [LogsQuery, WorkoutsQuery],
  });
  // Both return the updated object, which Apollo merges into its cache.
  const [updateLog] = useMutation(UpdateLogMutation);
  const [updateWorkout] = useMutation(UpdateWorkoutMutation);

  return {
    finishWorkout: async (log) => {
      const { data } = await createLog({
        variables: { input: toCreateLogInput(log) },
      });
      if (!data) {
        throw new Error("The finished workout wasn't saved.");
      }
      return data.createLog.id;
    },
    rateWorkout: async (logId, workout) => {
      await updateLog({
        variables: {
          input: { id: logId, exercises: toExerciseInputs(workout.exercises) },
        },
      });
    },
    saveTemplate: async (workoutId, exercises) => {
      await updateWorkout({
        variables: {
          input: { id: workoutId, exercises: toExerciseInputs(exercises) },
        },
      });
    },
  };
}
