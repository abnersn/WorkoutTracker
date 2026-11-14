import { Info } from "lucide-react";
import { useId, useState, type CSSProperties } from "react";
import { Card, cn, focusRing } from "@workout-tracker/ui";

export const RPE_LEVELS: readonly { title: string; description: string }[] = [
  {
    title: "Very light activity",
    description:
      "Hardly any exertion, but more than sleeping, watching TV, etc.",
  },
  {
    title: "Light activity",
    description:
      "Could maintain for hours. Easy to breathe and carry a conversation.",
  },
  {
    title: "Light activity",
    description:
      "Could maintain for hours. Easy to breathe and carry a conversation.",
  },
  {
    title: "Moderate activity",
    description:
      "Breathing heavily, can maintain a conversation, but more challenging.",
  },
  {
    title: "Moderate activity",
    description:
      "Breathing heavily, can maintain a conversation, but more challenging.",
  },
  {
    title: "Moderate activity",
    description:
      "Breathing heavily, can maintain a conversation, but more challenging.",
  },
  {
    title: "Vigorous activity",
    description: "Almost uncomfortable, short of breath, can speak a sentence.",
  },
  {
    title: "Vigorous activity",
    description: "Almost uncomfortable, short of breath, can speak a sentence.",
  },
  {
    title: "Very hard activity",
    description:
      "Very difficult to maintain, can barely breathe, can speak a few words.",
  },
  {
    title: "Max effort activity",
    description:
      "Almost impossible to keep going. Out of breath, unable to talk.",
  },
];

export interface RpeScaleProps {
  /** 1 to 10. */
  value: number;
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
  const level = RPE_LEVELS[Math.min(10, Math.max(1, value)) - 1];
  const color = `var(--color-rpe-${Math.min(10, Math.max(1, value))})`;

  return (
    <Card variant="item">
      <div className="flex items-start justify-between gap-3">
        <span
          id={`${panelId}-label`}
          className="text-sm tracking-wider text-indigo-700 uppercase"
        >
          Rate of perceived exertion
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label="Explain RPE levels"
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
        value={value}
        disabled={readOnly}
        aria-labelledby={`${panelId}-label`}
        aria-valuetext={`${value} of 10, ${level.title}`}
        onChange={(ev) => onChange?.(Number(ev.target.value))}
        className="rpe-range"
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
              i + 1 === value && "font-semibold",
            )}
          >
            {i + 1}
          </li>
        ))}
      </ul>
      <div
        id={panelId}
        hidden={!expanded}
        aria-live="polite"
        className="mt-inset border-t border-indigo-200 pt-inset"
      >
        <h4 className="text-sm font-semibold text-indigo-800">
          <span className="tabular">RPE {value}</span> · {level.title}
        </h4>
        <p className="text-sm text-indigo-700">{level.description}</p>
      </div>
    </Card>
  );
}
