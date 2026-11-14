import { Dumbbell, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn, focusRing, toneClass } from "@workout-tracker/ui";
import { linkClickHandler } from "@workout-tracker/utils";

export interface SavedWorkoutCardProps {
  name: string;
  /** Last run or completion date, already formatted. */
  meta?: ReactNode;
  /** Where the card goes when opened. */
  href: string;
  /** Name of the workout, used to label the delete button. */
  onRemove?: () => void;
  /** Client-side navigation supplied by the host; plain links are used without it. */
  navigate?: (to: string) => void;
  className?: string;
}

/** A saved workout: open it to start, or delete it. */
export function SavedWorkoutCard({
  name,
  meta,
  href,
  onRemove,
  navigate,
  className,
}: SavedWorkoutCardProps) {
  return (
    <div
      className={cn(
        toneClass.neutral,
        "relative rounded-card border border-tone-200 bg-tone-50 focus-within:ring-2 focus-within:ring-tone-200",
        className,
      )}
    >
      <a
        href={href}
        onClick={linkClickHandler(href, navigate)}
        className={cn(
          "flex flex-col justify-center rounded-card p-inset",
          // Leave room for the delete chip: its width plus a gap, and its full height.
          onRemove &&
            "min-h-[calc(2.75rem+2*var(--spacing-inset))] pr-[calc(2.75rem+var(--spacing-inset)+0.75rem)]",
          focusRing,
        )}
      >
        <span className="flex items-start gap-2 text-tone-700">
          <span className="flex h-[1lh] shrink-0 items-center">
            <Dumbbell size={20} />
          </span>
          <span className="min-w-0 break-words font-medium">{name}</span>
        </span>
        {meta && (
          <span className="mt-1.5 block text-sm text-tone-800">{meta}</span>
        )}
      </a>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete ${name}`}
          className={cn(
            // Sits on the inset at the top-right, concentric with the card corner.
            "absolute top-inset right-inset inline-flex size-11 items-center justify-center rounded-control border border-tone-200 bg-white text-tone-700 hover:bg-tone-100 active:bg-tone-200",
            focusRing,
          )}
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
}
