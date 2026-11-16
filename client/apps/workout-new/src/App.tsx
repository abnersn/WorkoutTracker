// Exposed by the federation plugin as 'workoutNew/App'.
// Consumers render it lazily via `lazyProvider('workoutNew', 'App')`.
import { Workout } from "@workout-tracker/ui";
import "./styles.css";

export interface AppProps {
  /** Saved workout to start, or the history entry to repeat when `fromLogs`. */
  id?: string;
  fromLogs?: boolean;
  navigate?: (to: string) => void;
  /** The host's account actions, placed beside the page title. */
  titleAction?: React.ReactNode;
}

export function App({
  id = "",
  fromLogs = false,
  navigate,
  titleAction,
}: AppProps): React.JSX.Element {
  return (
    <Workout
      id={id}
      fromLogs={fromLogs}
      navigate={navigate}
      titleAction={titleAction}
    />
  );
}

export default App;
