// Exposed by the federation plugin as 'workoutView/App'.
// Consumers render it lazily via `lazyProvider('workoutView', 'App')`.
import { lazy, Suspense } from "react";
import "./styles.css";

// A finished workout is shown with the same screen the workout-new remote runs,
// in read-only mode, so the exercise and set components exist in one place only.
const Workout = lazy(async () => {
  const mod = await import("workoutNew/Workout");
  return { default: mod.Workout };
});

export interface AppProps {
  /** Key of the history entry to show. */
  id?: string;
  navigate?: (to: string) => void;
}

export function App({ id = "", navigate }: AppProps) {
  return (
    <Suspense fallback={null}>
      <Workout id={id} mode="view" navigate={navigate} />
    </Suspense>
  );
}

export default App;
