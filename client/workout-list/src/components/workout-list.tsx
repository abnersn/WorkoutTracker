import { useState } from "react";
import { Play } from "lucide-react";
import {
  AddItemForm,
  Button,
  Dialog,
  EmptyMessage,
  SectionHeading,
  cn,
  focusRing,
  toneClass,
} from "@workout-tracker/ui";
import {
  convertActiveSessionWeights,
  formatClockTime,
  formatDistanceToNow,
  linkClickHandler,
} from "@workout-tracker/utils";
import { useWeightUnit, type WeightUnit } from "@workout-tracker/hooks";
import { SavedWorkoutCard } from "./saved-workout-card";

const LB_PER_KG = 2.20462;

/** kg or lb, set once and used by every set and summary. Switching converts saved weights. */
function UnitSwitch({
  onConvert,
}: {
  onConvert?: (factor: number) => Promise<void>;
}) {
  const [unit, setUnit] = useWeightUnit();
  const [status, setStatus] = useState<string | null>(null);
  const options: { value: WeightUnit; label: string }[] = [
    { value: "kg", label: "kg" },
    { value: "lb", label: "lb" },
  ];
  const choose = async (next: WeightUnit) => {
    if (next === unit) return;
    const factor = next === "lb" ? LB_PER_KG : 1 / LB_PER_KG;
    try {
      await onConvert?.(factor);
      convertActiveSessionWeights(factor);
      setUnit(next);
      setStatus(`Saved weights converted to ${next}.`);
    } catch {
      setStatus("Couldn't convert your saved weights. Nothing was changed.");
    }
  };
  return (
    <fieldset className="tone-neutral mx-4 mb-6 flex flex-wrap items-center gap-3">
      <legend className="sr-only">Weight unit</legend>
      <span aria-hidden="true" className="text-base text-indigo-700">
        Weights in
      </span>
      <div className="flex overflow-hidden rounded-control border border-tone-200">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "relative inline-flex min-h-11 min-w-12 cursor-pointer items-center justify-center px-3 text-base font-medium",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-indigo-600",
              unit === option.value
                ? "bg-tone-solid text-white"
                : "bg-white text-tone-700 hover:bg-tone-50",
            )}
          >
            <input
              type="radio"
              name="weight-unit"
              value={option.value}
              checked={unit === option.value}
              onChange={() => choose(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      <p role="status" className="w-full text-sm text-indigo-700 empty:hidden">
        {status}
      </p>
    </fieldset>
  );
}

export interface SavedWorkout {
  id: string;
  name: string;
  /** When the workout was last finished, if ever. */
  lastRun?: Date;
}

export interface InProgressWorkout {
  name: string;
  href: string;
  /** Epoch ms the workout clock started. */
  startedAt: number;
}

export interface WorkoutListProps {
  /** `null` while the saved workouts are still loading. */
  workouts: SavedWorkout[] | null;
  /** A workout that was left running. */
  inProgress?: InProgressWorkout | null;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  /** Multiplies every saved weight by `factor` when the unit switches. */
  onConvertWeights?: (factor: number) => Promise<void>;
  navigate?: (to: string) => void;
}

/** The saved workouts: open one to start it, add a new one, or delete one. */
export function WorkoutList({
  workouts,
  inProgress,
  onAdd,
  onRemove,
  onConvertWeights,
  navigate,
}: WorkoutListProps) {
  const [pendingRemoval, setPendingRemoval] = useState<SavedWorkout | null>(
    null,
  );

  return (
    <section aria-labelledby="workouts-heading" data-testid="workout-list">
      {inProgress && (
        <a
          href={inProgress.href}
          onClick={linkClickHandler(inProgress.href, navigate)}
          className={cn(
            toneClass.primary,
            focusRing,
            "mx-4 mt-6 flex items-center gap-3 rounded-card bg-tone-solid p-inset text-white hover:bg-tone-solid-hover active:bg-tone-solid-active",
          )}
        >
          <Play size={24} className="shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-lg font-semibold">
              Resume {inProgress.name}
            </span>
            <span className="text-sm text-white">
              Started at {formatClockTime(inProgress.startedAt)}
            </span>
          </span>
        </a>
      )}
      <SectionHeading id="workouts-heading" level={1}>
        Workout plans
      </SectionHeading>
      {workouts === null ? (
        <p role="status" className="p-4 text-base text-indigo-700">
          Loading your workouts…
        </p>
      ) : workouts.length > 0 ? (
        <ul className="flex flex-col gap-inset p-4">
          {workouts.map((workout) => (
            <li key={workout.id}>
              <SavedWorkoutCard
                name={workout.name}
                href={`/workouts/new?id=${workout.id}`}
                meta={
                  workout.lastRun
                    ? `Last done ${formatDistanceToNow(workout.lastRun)}`
                    : "Not done yet"
                }
                navigate={navigate}
                onRemove={() => setPendingRemoval(workout)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyMessage className="p-4 text-base">
          No workouts yet. Name your first one below, then add its exercises.
        </EmptyMessage>
      )}
      <AddItemForm
        label="Add workout"
        placeholder="Workout name"
        onSubmit={onAdd}
      />
      <UnitSwitch onConvert={onConvertWeights} />
      <Dialog
        open={pendingRemoval !== null}
        title={`Delete ${pendingRemoval?.name ?? "workout"}?`}
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
              Delete workout
            </Button>
          </>
        }
      >
        The plan is removed. Finished sessions stay in your history.
      </Dialog>
    </section>
  );
}
