import { useState } from "react";
import {
  AddItemForm,
  Button,
  Dialog,
  EmptyMessage,
  SectionHeading,
} from "@workout-tracker/ui";
import { formatDistanceToNow } from "@workout-tracker/utils";
import { SavedWorkoutCard } from "./saved-workout-card";

export interface SavedWorkout {
  id: string;
  name: string;
  /** When the workout was last finished, if ever. */
  lastRun?: Date;
}

export interface WorkoutListProps {
  workouts: SavedWorkout[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  navigate?: (to: string) => void;
}

/** The saved workouts: open one to start it, add a new one, or delete one. */
export function WorkoutList({
  workouts,
  onAdd,
  onRemove,
  navigate,
}: WorkoutListProps) {
  const [pendingRemoval, setPendingRemoval] = useState<SavedWorkout | null>(
    null,
  );

  return (
    <section aria-labelledby="workouts-heading" data-testid="workout-list">
      <SectionHeading id="workouts-heading">Workouts list</SectionHeading>
      {workouts.length > 0 ? (
        <ul className="flex flex-col gap-inset p-4">
          {workouts.map((workout) => (
            <li key={workout.id}>
              <SavedWorkoutCard
                name={workout.name}
                href={`/workouts/new?id=${workout.id}`}
                meta={
                  workout.lastRun &&
                  `Last run: ${formatDistanceToNow(workout.lastRun)}`
                }
                navigate={navigate}
                onRemove={() => setPendingRemoval(workout)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyMessage className="p-4">No workout</EmptyMessage>
      )}
      <AddItemForm
        label="Add workout"
        placeholder="Workout name"
        onSubmit={onAdd}
      />
      <Dialog
        open={pendingRemoval !== null}
        title="Are you sure you want to delete this workout?"
        onClose={() => setPendingRemoval(null)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setPendingRemoval(null)}>
              Cancel
            </Button>
            <Button
              tone="danger"
              onClick={() => {
                if (pendingRemoval) onRemove(pendingRemoval.id);
                setPendingRemoval(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        {pendingRemoval?.name}
      </Dialog>
    </section>
  );
}
