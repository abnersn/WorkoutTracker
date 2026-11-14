import { useEffect, useState } from "react";
import type { Workout as WorkoutData } from "@workout-tracker/types";
import { usePersistenceState } from "@workout-tracker/hooks";
import {
  clearActiveSession,
  isSessionFor,
  loadActiveSession,
  saveActiveSession,
  sessionHref,
  type ActiveSession,
} from "@workout-tracker/utils";
import { WorkoutScreenSkeleton } from "@workout-tracker/ui";
import { StatusMessage } from "./components/status-message";
import { WorkoutScreen } from "./components/workout-screen";
import "./styles.css";

export interface WorkoutProps {
  /** Template id (new), or the numeric log key as a string when `fromLogs`/`mode="view"`. */
  id: string;
  mode?: "new" | "view";
  /** In new mode: `id` is a history entry to repeat rather than a saved workout. */
  fromLogs?: boolean;
  /** View mode, straight after finishing. */
  finished?: boolean;
  navigate?: (to: string) => void;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      workout: WorkoutData;
      /** Set when an unfinished run of this workout was picked back up. */
      startedAt?: number;
    };

/** Loads a workout from IndexedDB and shows it. Exposed to other remotes. */
export function Workout({
  id,
  mode = "new",
  fromLogs = false,
  finished = false,
  navigate,
}: WorkoutProps) {
  const { db, error: dbError } = usePersistenceState();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  // A different workout left running: offered back instead of silently replaced.
  const [otherSession, setOtherSession] = useState<ActiveSession | null>(null);
  // The previous run of the same workout, for "vs last time" on the summary.
  const [previous, setPrevious] = useState<WorkoutData | null>(null);
  const isView = mode === "view";

  useEffect(() => {
    if (!id || !db) return;
    let cancelled = false;

    if (!isView) {
      const session = loadActiveSession();
      if (isSessionFor(session, id, fromLogs)) {
        setState({
          status: "ready",
          workout: session.workout,
          startedAt: session.startedAt,
        });
        return;
      }
      setOtherSession(session);
    }

    db.loadWorkoutLogById(id, !isView, fromLogs)
      .then(async (workout) => {
        if (cancelled) return;
        setState({ status: "ready", workout });
        if (!isView) return;
        const logs = await db.getAllLogs();
        const before = logs
          .filter(
            (log) =>
              log.id === workout.id &&
              new Date(log.date).getTime() < workout.date.getTime(),
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )[0];
        if (!cancelled && before) {
          setPrevious({ ...before, date: new Date(before.date) });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          status: "error",
          message: isView
            ? "This workout isn't in your history any more. It may have been deleted."
            : "This workout couldn't be found. It may have been deleted.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [db, id, isView, fromLogs]);

  if (!id) {
    return (
      <StatusMessage
        title="No workout chosen"
        navigate={navigate}
        action={{ label: "Choose a workout", href: "/" }}
      >
        Pick a saved workout, or repeat one from your history.
      </StatusMessage>
    );
  }
  if (dbError) {
    return (
      <StatusMessage
        title="Your workouts couldn't be opened"
        navigate={navigate}
        action={{ label: "Back to workouts", href: "/" }}
      >
        {dbError}
      </StatusMessage>
    );
  }
  if (state.status === "error") {
    return (
      <StatusMessage
        title="Workout not found"
        navigate={navigate}
        action={{ label: "Back to workouts", href: "/" }}
      >
        {state.message}
      </StatusMessage>
    );
  }
  if (state.status === "loading") {
    return <WorkoutScreenSkeleton label="Loading workout" />;
  }

  return (
    <WorkoutScreen
      // A different workout must start from clean timers and reducer state.
      key={`${mode}:${id}:${fromLogs}`}
      workout={state.workout}
      mode={mode}
      navigate={navigate}
      startedAt={state.startedAt}
      replacing={
        otherSession && {
          name: otherSession.workout.name,
          href: sessionHref(otherSession),
        }
      }
      reuseHref={`/workouts/new?id=${id}&fromLogs=true`}
      finished={finished}
      previous={previous}
      onRated={async (workout) => {
        if (!db) throw new Error("Workouts aren't open yet.");
        await db.updateLogEntry(Number(id), workout);
      }}
      onProgress={(workout, startedAt) =>
        saveActiveSession({ sourceId: id, fromLogs, startedAt, workout })
      }
      onDiscard={clearActiveSession}
      onFinish={async (log) => {
        if (!db) throw new Error("Workouts aren't open yet.");
        const key = await db.saveLogEntry(log);
        clearActiveSession();
        return key;
      }}
      onSaveTemplate={async (exercises) => {
        if (!db) throw new Error("Workouts aren't open yet.");
        await db.saveWorkoutTemplate(state.workout.id, exercises);
      }}
    />
  );
}
