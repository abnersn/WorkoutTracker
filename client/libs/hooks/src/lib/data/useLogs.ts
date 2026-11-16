import { useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { evict } from "./cache";
import { DeleteLogMutation, LogsQuery, WorkoutsQuery } from "./documents";
import { toDataError, type DataError } from "./errors";

export interface LogSummary {
  id: string;
  name: string;
  date: Date;
}

export interface UseLogs {
  /** Newest first; `null` while loading. */
  logs: LogSummary[] | null;
  error: DataError | null;
  deleteLog: (id: string) => Promise<void>;
}

/** The finished workouts, with a way to delete one. */
export function useLogs(): UseLogs {
  const { data, error } = useQuery(LogsQuery, {
    fetchPolicy: "cache-and-network",
  });
  const [remove] = useMutation(DeleteLogMutation, {
    // Deleting a run can change its workout's "last run" date.
    refetchQueries: [WorkoutsQuery],
  });

  const logs = useMemo(
    () =>
      data?.logs.map((log) => ({
        id: log.id,
        name: log.name,
        date: new Date(log.date),
      })) ?? null,
    [data],
  );

  return {
    logs,
    error: logs ? null : toDataError(error),
    deleteLog: async (id) => {
      await remove({
        variables: { id },
        update: (cache) => evict(cache, "LogEntry", id),
      });
    },
  };
}
