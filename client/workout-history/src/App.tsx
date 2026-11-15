// Exposed by the federation plugin as 'workoutHistory/App'.
// Consumers render it lazily via `lazyProvider('workoutHistory', 'App')`.
import { useEffect, useState } from "react";
import { usePersistence } from "@workout-tracker/hooks";
import { HistoryList, type HistoryEntry } from "./components/history-list";
import "./styles.css";

export interface AppProps {
  navigate?: (to: string) => void;
}

export function App({ navigate }: AppProps): React.JSX.Element {
  const db = usePersistence();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    if (!db) {
      return;
    }
    let cancelled = false;
    db.getAllLogs().then((logs) => {
      if (cancelled) {
        return;
      }
      setEntries(
        logs.map((log) => ({
          key: log.persistenceKey,
          name: log.name,
          date: new Date(log.date),
        })),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [db]);

  const remove = async (key: number): Promise<void> => {
    await db?.eraseLogEntry(key);
    setEntries((current) => (current ?? []).filter((e) => e.key !== key));
  };

  return (
    <HistoryList entries={entries} onRemove={remove} navigate={navigate} />
  );
}

export default App;
