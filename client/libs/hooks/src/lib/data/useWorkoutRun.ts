import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import type { Workout } from "@workout-tracker/types";
import { LogQuery, WorkoutQuery } from "./documents";
import { toDataError, type DataError } from "./errors";
import { startRun, toLogEntry, toWorkout } from "./mappers";

export interface WorkoutLoad {
  /** `null` while loading or on error. */
  workout: Workout | null;
  error: DataError | null;
}

export interface UseWorkoutRunOptions {
  /** `id` is a past log to repeat rather than a saved workout. */
  fromLogs?: boolean;
  /** Load nothing, e.g. when an unfinished run is being picked back up. */
  skip?: boolean;
}

/** A fresh run of a saved workout, or of a past log when `fromLogs`. */
export function useWorkoutRun(
  id: string,
  { fromLogs = false, skip = false }: UseWorkoutRunOptions = {},
): WorkoutLoad {
  // Always fetched: the plan may have been edited since it was last cached.
  const saved = useQuery(WorkoutQuery, {
    variables: { id },
    skip: skip || !id || fromLogs,
    fetchPolicy: "network-only",
  });
  const logged = useQuery(LogQuery, {
    variables: { id },
    skip: skip || !id || !fromLogs,
  });

  const source = fromLogs ? logged : saved;
  const workout = useMemo(() => {
    if (fromLogs) {
      return logged.data ? startRun(toLogEntry(logged.data.log)) : null;
    }
    return saved.data ? startRun(toWorkout(saved.data.workout)) : null;
  }, [fromLogs, logged.data, saved.data]);

  return { workout, error: workout ? null : toDataError(source.error) };
}
