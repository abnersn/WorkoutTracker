// Exposed by the federation plugin as 'workoutView/App'.
// Consumers render it lazily via `lazyProvider('workoutView', 'App')`.
import { Workout } from "@workout-tracker/ui";
import "./styles.css";

// A finished workout is shown with the same screen workout-new runs, in read-only
// mode. The screen lives in the ui library, so both remotes bundle it at build time.

export interface AppProps {
  /** Key of the history entry to show. */
  id?: string;
  /** Opened straight after finishing: celebrate and allow a late RPE. */
  finished?: boolean;
  navigate?: (to: string) => void;
}

export function App({ id = "", finished = false, navigate }: AppProps) {
  return (
    <Workout id={id} mode="view" finished={finished} navigate={navigate} />
  );
}

export default App;
