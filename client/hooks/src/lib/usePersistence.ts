import { useEffect, useState } from "react";
import { Database } from "@workout-tracker/utils";
import { readUnit } from "./useWeightUnit";

export interface PersistenceState {
  /** `null` until the database has finished opening, or when it failed to. */
  db: Database | null;
  /** Why the database could not be opened, in words a person can act on. */
  error: string | null;
}

/**
 * Opens the IndexedDB workout database once on mount, and reports a failure
 * instead of leaving the screen loading forever.
 *
 * @deprecated IndexedDB persistence is being replaced. Do not use in new code.
 */
export function usePersistenceState(): PersistenceState {
  const [state, setState] = useState<PersistenceState>({
    db: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const database = new Database();
    // The unit weights were saved in before version 2 (see Database.init).
    database
      .init(readUnit())
      .then(() => {
        if (!cancelled) setState({ db: database, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          db: null,
          error:
            error instanceof Error && error.message
              ? error.message
              : "Your workouts couldn't be opened. Reload the page to try again.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Opens the IndexedDB workout database once on mount.
 * Returns `null` until the database has finished initializing.
 *
 * @deprecated IndexedDB persistence is being replaced. Do not use in new code.
 */
export function usePersistence(): Database | null {
  return usePersistenceState().db;
}
