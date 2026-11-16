import { useState } from "react";
import {
  Button,
  CardListSkeleton,
  Dialog,
  EmptyMessage,
  SectionHeading,
} from "@workout-tracker/ui";
import { formatDateTime } from "@workout-tracker/utils";
import { WorkoutSummaryCard } from "./workout-summary-card";

export interface HistoryEntry {
  /** The log's id. */
  id: string;
  name: string;
  date: Date;
}

export interface HistoryListProps {
  /** `null` while the history is still loading. */
  entries: HistoryEntry[] | null;
  onRemove?: (id: string) => void;
  navigate?: (to: string) => void;
}

/** Finished workouts, newest first. */
export function HistoryList({
  entries,
  onRemove,
  navigate,
}: HistoryListProps): React.JSX.Element {
  const [pendingRemoval, setPendingRemoval] = useState<HistoryEntry | null>(
    null,
  );
  const sorted = [...(entries ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section aria-labelledby="history-heading" data-testid="workout-history">
      <SectionHeading id="history-heading" tone="primary">
        History
      </SectionHeading>
      {entries === null ? (
        <CardListSkeleton label="Loading your history" tone="primary" />
      ) : sorted.length === 0 ? (
        <EmptyMessage className="p-4 text-base">
          Finished workouts show up here, with their time, sets and volume.
        </EmptyMessage>
      ) : (
        <ul className="flex flex-col gap-inset p-4">
          {sorted.map((entry) => (
            <li key={entry.id}>
              <WorkoutSummaryCard
                name={entry.name}
                href={`/workouts/${entry.id}`}
                meta={formatDateTime(new Date(entry.date))}
                navigate={navigate}
                onRemove={onRemove && (() => setPendingRemoval(entry))}
              />
            </li>
          ))}
        </ul>
      )}
      <Dialog
        open={pendingRemoval !== null}
        title={`Delete this ${pendingRemoval?.name ?? "workout"} session?`}
        onClose={() => setPendingRemoval(null)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setPendingRemoval(null)}>
              Cancel
            </Button>
            <Button
              tone="danger"
              onClick={() => {
                if (pendingRemoval) {
                  onRemove?.(pendingRemoval.id);
                }
                setPendingRemoval(null);
              }}
            >
              Delete session
            </Button>
          </>
        }
      >
        {pendingRemoval &&
          `${formatDateTime(new Date(pendingRemoval.date))}. Its sets are removed from your history for good.`}
      </Dialog>
    </section>
  );
}
