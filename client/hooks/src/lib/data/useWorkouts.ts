import { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { evict } from "./cache";
import {
  CreateWorkoutMutation,
  DeleteWorkoutMutation,
  WorkoutsQuery,
} from "./documents";
import { toDataError, type DataError } from "./errors";

export interface WorkoutSummary {
  id: string;
  name: string;
  /** When the workout was last finished, if ever. */
  lastRun?: Date;
}

export interface UseWorkouts {
  /** `null` while loading. */
  workouts: WorkoutSummary[] | null;
  error: DataError | null;
  createWorkout: (name: string) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
}

/** The saved workouts, with ways to add and delete them. */
export function useWorkouts(): UseWorkouts {
  // Shown from cache at once, then refreshed: a run finished elsewhere
  // changes lastRunAt.
  const { data, error } = useQuery(WorkoutsQuery, {
    fetchPolicy: "cache-and-network",
  });
  const [create] = useMutation(CreateWorkoutMutation, {
    update(cache, { data: created }) {
      if (!created) {
        return;
      }
      cache.updateQuery({ query: WorkoutsQuery }, (current) =>
        current
          ? { workouts: [...current.workouts, created.createWorkout] }
          : current,
      );
    },
  });
  const [remove] = useMutation(DeleteWorkoutMutation);

  const workouts = useMemo(
    () =>
      data?.workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        lastRun: workout.lastRunAt ? new Date(workout.lastRunAt) : undefined,
      })) ?? null,
    [data],
  );

  return {
    workouts,
    error: workouts ? null : toDataError(error),
    createWorkout: async (name) => {
      await create({ variables: { input: { name, exercises: [] } } });
    },
    deleteWorkout: async (id) => {
      await remove({
        variables: { id },
        update: (cache) => evict(cache, "Workout", id),
      });
    },
  };
}
