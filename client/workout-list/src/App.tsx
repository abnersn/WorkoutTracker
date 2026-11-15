// Exposed by the federation plugin as 'workoutList/App'.
// Consumers render it lazily via `lazyProvider('workoutList', 'App')`.
import { useState } from "react";
import { useWorkouts } from "@workout-tracker/hooks";
import { loadActiveSession, sessionHref } from "@workout-tracker/utils";
import { WorkoutList } from "./components/workout-list";
import "./styles.css";

export interface AppProps {
  navigate?: (to: string) => void;
  /** The host's account actions, placed beside the page title. */
  titleAction?: React.ReactNode;
}

export function App({ navigate, titleAction }: AppProps): React.JSX.Element {
  const { workouts, createWorkout, deleteWorkout } = useWorkouts();
  // Read once: a workout left running (refresh, Back, phone locked) is offered back first.
  const [session] = useState(loadActiveSession);

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
      onAdd={createWorkout}
      onRemove={deleteWorkout}
      navigate={navigate}
      titleAction={titleAction}
    />
  );
}

export default App;
