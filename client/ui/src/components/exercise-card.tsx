import { Activity, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import { Children, type ReactNode } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { EmptyMessage } from "./empty-message";
import { cn, focusRing } from "./tone";

export interface ExerciseCardProps {
  name: string;
  type?: "weight" | "cardio";
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  /** Hides every editing control: finished workouts and history. */
  readOnly?: boolean;
  /** Show "Remove set" next to "Add set", for when a set is selected. */
  canRemoveSet?: boolean;
  onToggleType?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddSet?: () => void;
  onRemoveSet?: () => void;
  onRemoveExercise?: () => void;
  /** SetRows, then the RpeScale once the exercise is complete. */
  children?: ReactNode;
}

const typeIcon = {
  weight: <Dumbbell size={20} />,
  cardio: <Activity size={20} />,
} as const;

// Header controls are white chips sitting on the card's inset, so their control
// radius is concentric with the card corner they share.
const chip =
  "tone-neutral shrink-0 rounded-control border border-tone-200 bg-white text-indigo-700";
// The pair is clipped to its chip, so the focus ring is drawn inside the button.
const iconButton = cn(
  "inline-flex size-11 items-center justify-center enabled:hover:bg-tone-100 enabled:active:bg-tone-200 disabled:text-indigo-300",
  focusRing,
  "focus-visible:-outline-offset-2",
);

/** An exercise: its name, its sets, and the controls to reorder, add and remove. */
export function ExerciseCard({
  name,
  type = "weight",
  isActive = false,
  isFirst = false,
  isLast = false,
  readOnly = false,
  canRemoveSet = false,
  onToggleType,
  onMoveUp,
  onMoveDown,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  children,
}: ExerciseCardProps) {
  const typeLabel = type === "cardio" ? "Cardio" : "Weight";
  const otherType = type === "cardio" ? "weight" : "cardio";
  const icon = (
    <span className="flex h-[1lh] shrink-0 items-center text-indigo-600">
      {typeIcon[type]}
    </span>
  );

  return (
    <section aria-label={name} data-type={type}>
      <Card isActive={isActive} className="flex flex-col gap-inset">
        <div className="flex items-start gap-3">
          {readOnly || !onToggleType ? (
            icon
          ) : (
            <button
              type="button"
              onClick={onToggleType}
              aria-label={`${typeLabel} exercise. Switch to ${otherType}.`}
              title={`${typeLabel} exercise. Switch to ${otherType}.`}
              className={cn(chip, iconButton, "text-indigo-600")}
            >
              {typeIcon[type]}
            </button>
          )}
          <h3
            className={cn(
              "min-w-0 flex-1 text-lg font-semibold break-words text-indigo-800",
              // Centre a one-line name on the 44px chips beside it.
              !readOnly && "py-2",
            )}
          >
            {name}
          </h3>
          {!readOnly && (
            <div
              className={cn(
                chip,
                "flex divide-x divide-tone-200 overflow-hidden",
              )}
            >
              <button
                type="button"
                disabled={isLast}
                onClick={onMoveDown}
                aria-label={`Move ${name} down`}
                className={iconButton}
              >
                <ChevronDown size={20} />
              </button>
              <button
                type="button"
                disabled={isFirst}
                onClick={onMoveUp}
                aria-label={`Move ${name} up`}
                className={iconButton}
              >
                <ChevronUp size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-inset">
          {Children.count(children) > 0 ? (
            children
          ) : (
            <EmptyMessage>No sets yet. Add one to start logging.</EmptyMessage>
          )}
        </div>
      </Card>
      {!readOnly && (
        // px-1 + the ghost buttons' px-3 puts their labels on the card's inset.
        <div className="mt-3 flex items-center justify-end gap-1 px-1">
          <Button
            variant="ghost"
            tone="danger"
            onClick={onRemoveExercise}
            className="mr-auto"
          >
            Remove exercise
          </Button>
          {isActive && canRemoveSet && (
            <Button variant="ghost" onClick={onRemoveSet}>
              Remove set
            </Button>
          )}
          <Button variant="ghost" onClick={onAddSet}>
            Add set
          </Button>
        </div>
      )}
    </section>
  );
}
