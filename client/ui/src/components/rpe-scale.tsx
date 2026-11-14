import { Info } from "lucide-react";
import { useId, useState, type CSSProperties } from "react";
import { cn, focusRing } from "./tone";

// Lifting RPE: effort read as reps left in the tank at the end of the set.
export const RPE_LEVELS: readonly { title: string; description: string }[] = [
  { title: "Warm-up", description: "No real effort. Warm-up weight." },
  {
    title: "Very easy",
    description: "Could do many more reps without trying.",
  },
  { title: "Easy", description: "Light work. The bar moved fast every rep." },
  { title: "Light", description: "Comfortable. 6 or more reps left." },
  { title: "Moderate", description: "Some effort. 5 reps left." },
  {
    title: "Working",
    description: "Steady effort, bar still quick. 4 reps left.",
  },
  { title: "Hard", description: "Real effort, bar slowing. 3 reps left." },
  { title: "Very hard", description: "Grinding. 2 reps left." },
  { title: "Near max", description: "Only 1 more rep was possible." },
  { title: "Max", description: "Nothing left. No more reps possible." },
];

export interface RpeScaleProps {
  /** 1 to 10; left out until the lifter rates the exercise. */
  value?: number;
  onChange?: (value: number) => void;
  /** Shows the saved rating without letting it change. */
  readOnly?: boolean;
  /** Start with the level explanation open. */
  defaultExpanded?: boolean;
}

/** Rate of perceived exertion, asked once an exercise is done. */
export function RpeScale({
  value,
  onChange,
  readOnly = false,
  defaultExpanded = false,
}: RpeScaleProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const panelId = useId();
  const rated = value !== undefined;
  // Unrated, the thumb waits mid-track in grey; nothing is saved until it's moved.
  const shown = Math.min(10, Math.max(1, value ?? 5));
  const level = RPE_LEVELS[shown - 1];
  const color = rated ? `var(--color-rpe-${shown})` : "var(--color-slate-400)";

  return (
    // Part of the exercise card, set off by a rule rather than a card of its own.
    <div className="border-t border-indigo-200 pt-inset">
      <div className="flex items-start justify-between gap-3">
        <span
          id={`${panelId}-label`}
          className="text-base font-medium text-indigo-800"
        >
          How hard was it? (RPE)
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label="What the RPE numbers mean"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            // Tucked into the corner so the glyph lands on the inset; the 44px box
            // collapses to the label's line height, and its radius nests in the corner.
            "tone-neutral -mt-3 -mr-3 -mb-3 inline-flex size-11 shrink-0 items-center justify-center rounded-corner text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100",
            focusRing,
          )}
        >
          <Info size={20} />
        </button>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={shown}
        disabled={readOnly}
        aria-labelledby={`${panelId}-label`}
        aria-valuetext={
          rated ? `${shown} of 10, ${level.title}` : "Not rated yet"
        }
        onChange={(ev) => onChange?.(Number(ev.target.value))}
        // A tap on the thumb itself fires no change; it still counts as a rating.
        onPointerUp={() => {
          if (!rated && !readOnly) onChange?.(shown);
        }}
        className={cn("rpe-range", !rated && "rpe-range-unrated")}
        style={{ "--rpe-color": color } as CSSProperties}
      />
      <ul
        aria-hidden="true"
        className="tabular -mt-1 flex justify-between text-sm text-indigo-700"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <li
            key={i}
            className={cn(
              "w-6 text-center",
              rated && i + 1 === value && "font-semibold",
            )}
          >
            {i + 1}
          </li>
        ))}
      </ul>
      {/* The rating in words is always on screen (and announced); the
          explanation of what the number means opens on request. */}
      <p aria-live="polite" className="mt-2 text-base text-indigo-800">
        {rated ? (
          <>
            <span className="tabular font-semibold">RPE {shown}</span> ·{" "}
            {level.title}
          </>
        ) : readOnly ? (
          "Not rated"
        ) : (
          "Not rated yet. Slide to rate."
        )}
      </p>
      <div
        id={panelId}
        hidden={!expanded}
        className="mt-inset border-t border-indigo-200 pt-inset"
      >
        {rated ? (
          <p className="text-sm text-indigo-700">{level.description}</p>
        ) : null}
        <p className={cn("text-sm text-indigo-700", rated && "mt-1")}>
          RPE is how hard the sets felt, counted as reps you had left: 10 means
          none, 8 means two more were possible.
        </p>
      </div>
    </div>
  );
}
