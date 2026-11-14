import { useEffect, useState } from "react";
import type { Workout as WorkoutData } from "@workout-tracker/types";
import { usePersistence } from "@workout-tracker/hooks";
import { EmptyMessage } from "@workout-tracker/ui";
import { WorkoutScreen } from "./components/workout-screen";
import "./styles.css";

export interface WorkoutProps {
  /** Template id (new), or the numeric log key as a string when `fromLogs`/`mode="view"`. */
  id: string;
  mode?: "new" | "view";
  /** In new mode: `id` is a history entry to repeat rather than a saved workout. */
  fromLogs?: boolean;
  navigate?: (to: string) => void;
}

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; workout: WorkoutData };

/** Loads a workout from IndexedDB and shows it. Exposed to other remotes. */
export function Workout({
  id,
  mode = "new",
  fromLogs = false,
  navigate,
}: WorkoutProps) {
  const db = usePersistence();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const isView = mode === "view";

  useEffect(() => {
    if (!db || !id) return;
    let cancelled = false;
    db.loadWorkoutLogById(id, !isView, fromLogs)
      .then((workout) => {
        if (!cancelled) setState({ status: "ready", workout });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [db, id, isView, fromLogs]);

  if (state.status === "error") {
    return (
      <EmptyMessage className="p-4">
        This workout could not be found.
      </EmptyMessage>
    );
  }
  if (state.status === "loading") return null;

  return (
    <WorkoutScreen
      // A different workout must start from clean timers and reducer state.
      key={`${mode}:${id}:${fromLogs}`}
      workout={state.workout}
      mode={mode}
      navigate={navigate}
      reuseHref={`/workouts/new?id=${id}&fromLogs=true`}
      onFinish={(log) => db?.saveLogEntry(log)}
      onSaveTemplate={(exercises) =>
        db?.saveWorkoutTemplate(state.workout.id, exercises)
      }
    />
  );
}
