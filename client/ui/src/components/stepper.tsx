import { cn, focusRing, toneClass } from "./tone";

export interface StepperProps {
  /** What the buttons change, e.g. "reps". Used in the accessible names. */
  label: string;
  /** How much one press changes the value. Shown on the buttons. */
  step: number;
  /** Unit shown after the step, e.g. "s". */
  unit?: string;
  onDecrement: () => void;
  onIncrement: () => void;
  disableDecrement?: boolean;
  className?: string;
}

const button = cn(
  "tabular inline-flex min-h-11 flex-1 items-center justify-center text-sm font-medium text-tone-800",
  "enabled:hover:bg-tone-100 enabled:active:bg-tone-100 disabled:opacity-40",
  focusRing,
);

// Visible steps stay short ("+15s"); screen readers hear the unit in full.
const spokenUnit: Record<string, string> = { s: " seconds" };

/**
 * One tinted control with a minus and a plus half. Each half says its own
 * step (-5 / +5), so reps, weight and rest steppers differ at a glance.
 */
export function Stepper({
  label,
  step,
  unit = "",
  onDecrement,
  onIncrement,
  disableDecrement = false,
  className,
}: StepperProps): React.JSX.Element {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        toneClass.neutral,
        "flex divide-x divide-tone-400 overflow-hidden rounded-control border border-tone-400 bg-tone-200",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disableDecrement}
        aria-label={`Decrease ${label} by ${step}${spokenUnit[unit] ?? unit}`}
        className={button}
      >
        {`−${step}${unit}`}
      </button>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase ${label} by ${step}${spokenUnit[unit] ?? unit}`}
        className={button}
      >
        {`+${step}${unit}`}
      </button>
    </div>
  );
}
