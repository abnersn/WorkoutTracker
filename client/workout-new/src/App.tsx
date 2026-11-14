// Exposed by the federation plugin as 'workoutNew/App'.
// Consumers render it lazily via `lazyProvider('workoutNew', 'App')`.
import { Workout } from "@workout-tracker/ui";
import "./styles.css";

export interface AppProps {
  /** Saved workout to start, or the history entry to repeat when `fromLogs`. */
  id?: string;
  fromLogs?: boolean;
  navigate?: (to: string) => void;
}

export function App({ id = "", fromLogs = false, navigate }: AppProps) {
  return <Workout id={id} fromLogs={fromLogs} navigate={navigate} />;
}

export default App;
