import { ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import { Children, type ReactNode } from "react";
import { Button, Card, EmptyMessage, cn, focusRing } from "@workout-tracker/ui";

export interface ExerciseCardProps {
  name: string;
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  /** Hides every editing control: finished workouts and history. */
  readOnly?: boolean;
  /** Show "Remove set" next to "Add set", for when a set is selected. */
  canRemoveSet?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddSet?: () => void;
  onRemoveSet?: () => void;
  onRemoveExercise?: () => void;
  /** SetRows, then the RpeScale once the exercise is complete. */
  children?: ReactNode;
}

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
  isActive = false,
  isFirst = false,
  isLast = false,
  readOnly = false,
  canRemoveSet = false,
  onMoveUp,
  onMoveDown,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  children,
}: ExerciseCardProps) {
  return (
    <section aria-label={name}>
      <Card isActive={isActive} className="flex flex-col gap-inset">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center text-indigo-600",
              // Centre the icon on the name, which is padded for the chips beside it.
              readOnly ? "h-[1lh]" : "h-11",
            )}
          >
            <Dumbbell size={20} />
          </span>
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
