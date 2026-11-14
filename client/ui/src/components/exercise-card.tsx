import { ChevronDown, ChevronUp, Dumbbell, Trash2 } from "lucide-react";
import { Children, useId, useState, type ReactNode } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { EmptyMessage } from "./empty-message";
import { cn, focusRing } from "./tone";

export interface ExerciseCardProps {
  name: string;
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  /** Hides every editing control: finished workouts and history. */
  readOnly?: boolean;
  /**
   * Reorder and remove controls are shown. Off while a workout runs, so the
   * screen holds only what logging needs; "Edit" turns them back on.
   */
  editing?: boolean;
  /** Offer "Add set" even when not editing: the current exercise mid-workout. */
  canAddSet?: boolean;
  /** Show "Remove set N" next to "Add set", for when a set is selected. */
  canRemoveSet?: boolean;
  /** 1-based number of the selected set, named on the remove button. */
  selectedSetNumber?: number;
  /**
   * Shows only the name and progress, e.g. "2 of 4 sets done", with a toggle
   * to open it: the exercises the lifter isn't on right now.
   */
  collapsed?: boolean;
  /** One line under the name, such as the set progress. */
  summary?: string;
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
// The group is clipped to its chip, so the focus ring is drawn inside the button.
const iconButton = cn(
  "inline-flex size-11 items-center justify-center enabled:hover:bg-tone-100 enabled:active:bg-tone-200 disabled:text-indigo-300",
  focusRing,
  "focus-visible:-outline-offset-2",
);

/** An exercise: its name, its sets, and, when editing, the controls to reorder, add and remove. */
export function ExerciseCard({
  name,
  isActive = false,
  isFirst = false,
  isLast = false,
  readOnly = false,
  editing = true,
  canAddSet = false,
  canRemoveSet = false,
  selectedSetNumber,
  collapsed = false,
  summary,
  onMoveUp,
  onMoveDown,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
  children,
}: ExerciseCardProps) {
  const [opened, setOpened] = useState(false);
  const bodyId = useId();
  const showEditing = !readOnly && editing;
  const showBody = !collapsed || opened || showEditing;
  const showAddSet = !readOnly && (editing || canAddSet);

  return (
    <section aria-label={name}>
      <Card isActive={isActive} className="flex flex-col gap-inset">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center text-indigo-600",
              // Centre the icon on the name, which is padded for the chips beside it.
              showEditing || collapsed ? "h-11" : "h-[1lh]",
            )}
          >
            <Dumbbell size={20} />
          </span>
          <div
            className={cn(
              "min-w-0 flex-1",
              // Centre a one-line name on the 44px chips beside it.
              (showEditing || collapsed) && !summary && "py-2",
            )}
          >
            <h3 className="text-lg font-semibold break-words text-indigo-800">
              {name}
            </h3>
            {summary && (
              <p className="tabular text-sm text-indigo-700">{summary}</p>
            )}
          </div>
          {showEditing && (
            <div
              className={cn(
                chip,
                "flex divide-x divide-tone-200 overflow-hidden",
              )}
            >
              <button
                type="button"
                disabled={isFirst}
                onClick={onMoveUp}
                aria-label={`Move ${name} up`}
                className={iconButton}
              >
                <ChevronUp size={20} />
              </button>
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
                onClick={onRemoveExercise}
                aria-label={`Remove ${name}`}
                className={cn(iconButton, "text-red-700")}
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
          {collapsed && !showEditing && (
            <button
              type="button"
              aria-expanded={opened}
              aria-controls={bodyId}
              onClick={() => setOpened(!opened)}
              className={cn(chip, iconButton)}
              aria-label={opened ? `Hide ${name} sets` : `Show ${name} sets`}
            >
              <ChevronDown
                size={20}
                className={cn(
                  "transition-transform duration-(--duration-base) ease-out motion-reduce:transition-none",
                  opened && "rotate-180",
                )}
              />
            </button>
          )}
        </div>
        {showBody && (
          <div id={bodyId} className="flex flex-col gap-inset">
            {Children.count(children) > 0 ? (
              children
            ) : (
              <EmptyMessage>
                No sets yet. Add one to start logging.
              </EmptyMessage>
            )}
          </div>
        )}
      </Card>
      {showAddSet && showBody && (
        // px-1 + the ghost buttons' px-3 puts their labels on the card's inset.
        <div className="mt-3 flex items-center justify-end gap-1 px-1">
          {showEditing && isActive && canRemoveSet && (
            <Button variant="ghost" onClick={onRemoveSet} className="mr-auto">
              {selectedSetNumber
                ? `Remove set ${selectedSetNumber}`
                : "Remove set"}
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
