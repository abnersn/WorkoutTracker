// Exposed by the federation plugin as 'workoutHistory/App'.
// Consumers render it lazily via `lazyProvider('workoutHistory', 'App')`.
import { useLogs } from "@workout-tracker/hooks";
import { HistoryList } from "./components/history-list";
import "./styles.css";

export interface AppProps {
  navigate?: (to: string) => void;
}

export function App({ navigate }: AppProps): React.JSX.Element {
  const { logs, deleteLog } = useLogs();
  return (
    <HistoryList entries={logs} onRemove={deleteLog} navigate={navigate} />
  );
}

export default App;
