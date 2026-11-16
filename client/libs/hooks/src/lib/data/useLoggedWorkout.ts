import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import type { LogEntry } from "@workout-tracker/types";
import { LogQuery, PreviousRunQuery } from "./documents";
import { toDataError, type DataError } from "./errors";
import { asFinished, toLogEntry } from "./mappers";

export interface LoggedWorkout {
  /** `null` while loading or on error. */
  workout: LogEntry | null;
  /** The run of the same workout just before, for "vs last time". */
  previous: LogEntry | null;
  error: DataError | null;
}

/** A finished workout from the history, with the run before it. */
export function useLoggedWorkout(
  id: string,
  { skip = false }: { skip?: boolean } = {},
): LoggedWorkout {
  const log = useQuery(LogQuery, { variables: { id }, skip: skip || !id });
  // Optional extra: if it fails, the summary just has no comparison.
  const previousRun = useQuery(PreviousRunQuery, {
    variables: { logId: id },
    skip: skip || !id,
  });

  const workout = useMemo(
    () => (log.data ? asFinished(toLogEntry(log.data.log)) : null),
    [log.data],
  );
  const previous = useMemo(
    () =>
      previousRun.data?.previousRun
        ? toLogEntry(previousRun.data.previousRun)
        : null,
    [previousRun.data],
  );

  return {
    workout,
    previous,
    error: workout ? null : toDataError(log.error),
  };
}
