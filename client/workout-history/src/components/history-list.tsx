import { SectionHeading } from "@workout-tracker/ui";
import { formatDateTime } from "@workout-tracker/utils";
import { WorkoutSummaryCard } from "./workout-summary-card";

export interface HistoryEntry {
  /** Key of the log in the database. */
  key: number;
  name: string;
  date: Date;
}

export interface HistoryListProps {
  entries: HistoryEntry[];
  onRemove?: (key: number) => void;
  navigate?: (to: string) => void;
}

/** Finished workouts, newest first. Renders nothing when there are none. */
export function HistoryList({ entries, onRemove, navigate }: HistoryListProps) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section aria-labelledby="history-heading" data-testid="workout-history">
      <SectionHeading id="history-heading" tone="primary">
        History
      </SectionHeading>
      <ul className="flex flex-col gap-inset p-4">
        {sorted.map((entry) => (
          <li key={entry.key}>
            <WorkoutSummaryCard
              name={entry.name}
              href={`/workouts/${entry.key}`}
              meta={formatDateTime(new Date(entry.date))}
              navigate={navigate}
              onRemove={onRemove && (() => onRemove(entry.key))}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
