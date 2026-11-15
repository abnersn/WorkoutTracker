// Exposed by the federation plugin as 'workoutList/App'.
// Consumers render it lazily via `lazyProvider('workoutList', 'App')`.
import { useEffect, useState } from "react";
import { usePersistence } from "@workout-tracker/hooks";
import { genId, loadActiveSession, sessionHref } from "@workout-tracker/utils";
import { WorkoutList, type SavedWorkout } from "./components/workout-list";
import "./styles.css";

export interface AppProps {
  navigate?: (to: string) => void;
}

export function App({ navigate }: AppProps): React.JSX.Element {
  const db = usePersistence();
  const [workouts, setWorkouts] = useState<SavedWorkout[] | null>(null);
  // Read once: a workout left running (refresh, Back, phone locked) is offered back first.
  const [session] = useState(loadActiveSession);

  useEffect(() => {
    if (!db) {
      return;
    }
    let cancelled = false;
    (async () => {
      const [saved, logs] = await Promise.all([
        db.getAllWorkouts(),
        db.getAllLogs(),
      ]);
      if (cancelled) {
        return;
      }
      setWorkouts(
        saved.map((workout) => {
          const dates = logs
            .filter((log) => log.workoutId === workout.id)
            .map((log) => new Date(log.date));
          const lastRun = dates.sort((a, b) => b.getTime() - a.getTime())[0];
          return { id: workout.id, name: workout.name, lastRun };
        }),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [db]);

  const add = async (name: string): Promise<void> => {
    const workout = { id: genId(), name, exercises: [] };
    await db?.saveWorkout({
      ...workout,
      date: new Date(),
      duration: 0,
      isComplete: false,
      activeSetId: null,
    });
    setWorkouts((current) => [...(current ?? []), { id: workout.id, name }]);
  };

  const remove = async (id: string): Promise<void> => {
    await db?.eraseWorkout(id);
    setWorkouts((current) => (current ?? []).filter((w) => w.id !== id));
  };

  return (
    <WorkoutList
      workouts={workouts}
      inProgress={
        session && {
          name: session.workout.name,
          href: sessionHref(session),
          startedAt: session.startedAt,
        }
      }
      onAdd={add}
      onRemove={remove}
      navigate={navigate}
    />
  );
}

export default App;
