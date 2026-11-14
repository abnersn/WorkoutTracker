import { SetStage } from "@workout-tracker/types";
import { Check, Play, Timer } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { SetField } from "./set-field";
import { Stepper } from "./stepper";
import { cn, toneClass, type Tone } from "./tone";
import {
  cssToken,
  easingToken,
  msToken,
  prefersReducedMotion,
} from "../motion";

export type SetFieldName = "duration" | "reps" | "weight" | "rest";

export interface SetRowProps {
  stage: SetStage;
  /** Cardio sets show a time and no weight; weight sets show no time. */
  exerciseType?: "weight" | "cardio";
  /** Seconds. A negative value means the countdown ran out and is counting up. */
  duration?: number;
  reps: number;
  /** Not used by cardio sets. */
  weight?: number;
  /** Seconds, negative once the rest is overrun. */
  rest: number;
  isActive?: boolean;
  /** The only set in its exercise: no divider lines around it. */
  isOnly?: boolean;
  readOnly?: boolean;
  /** How much the steppers change a value. */
  repsStep?: number;
  weightStep?: number;
  /** Seconds the rest and time steppers change a value by. */
  restStep?: number;
  durationStep?: number;
  /** Formats seconds for the time fields, e.g. 90 -> 1:30. */
  formatTime?: (seconds: number) => string;
  onChange?: (field: SetFieldName, value: number) => void;
  /** The row was clicked or one of its fields was focused. */
  onActivate?: () => void;
}

function defaultFormatTime(seconds: number): string {
  const sign = seconds < 0 ? "-" : "";
  const s = Math.abs(Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${sign}${m}:${String(s % 60).padStart(2, "0")}`;
}

const stageLabel: Record<SetStage, { text: string; icon: ReactNode } | null> = {
  [SetStage.Idle]: null,
  [SetStage.Active]: { text: "In progress", icon: <Play size={14} /> },
  [SetStage.Resting]: { text: "Resting", icon: <Timer size={14} /> },
  [SetStage.Complete]: { text: "Done", icon: <Check size={14} /> },
};

// Long enough to cover lucide's check path ("M20 6 9 17l-5-5", about 22.6 units).
const CHECK_LENGTH = 24;

/**
 * When a set changes stage its label crossfades in, so the change is noticed
 * without looking for it. Landing on "Done" also draws the check, the one
 * authored moment in a set's life. Only real transitions play: a list of
 * finished sets renders still.
 */
function useStageTransition(stage: SetStage) {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const previous = useRef(stage);

  useEffect(() => {
    const before = previous.current;
    previous.current = stage;
    const el = labelRef.current;
    if (before === stage || !el?.animate) return;
    const reduced = prefersReducedMotion();

    el.animate(
      reduced
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [
            {
              opacity: 0,
              transform: `translateX(-${cssToken("--distance-label-slide")})`,
            },
            { opacity: 1, transform: "translateX(0)" },
          ],
      {
        duration: msToken("--duration-enter"),
        easing: easingToken("--ease-settle"),
      },
    );

    const path = stage === SetStage.Complete && el.querySelector("svg path");
    if (path instanceof SVGPathElement) {
      path.style.strokeDasharray = String(CHECK_LENGTH);
      path.animate(
        [{ strokeDashoffset: CHECK_LENGTH }, { strokeDashoffset: 0 }],
        {
          duration: reduced ? 0 : msToken("--duration-draw"),
          delay: reduced ? 0 : msToken("--delay-draw"),
          easing: easingToken("--ease-draw"),
          fill: "backwards",
        },
      );
    }
  }, [stage]);

  return labelRef;
}

/** One set: reps, weight and rest. Cardio swaps the weight for a time. */
export function SetRow({
  stage,
  exerciseType = "weight",
  duration = 0,
  reps,
  weight = 0,
  rest,
  isActive = false,
  isOnly = false,
  readOnly = false,
  repsStep = 1,
  weightStep = 5,
  restStep = 15,
  durationStep = 30,
  formatTime = defaultFormatTime,
  onChange,
  onActivate,
}: SetRowProps) {
  const baseTone: Tone = stage === SetStage.Complete ? "success" : "neutral";
  const timerTone = (value: number, runningStage: SetStage): Tone =>
    stage === runningStage ? (value < 0 ? "danger" : "highlight") : baseTone;

  // While a set runs, its countdown is the number to read; the rest steps back.
  const isCardio = exerciseType === "cardio";
  const leadsWithTime = isCardio && stage === SetStage.Active;
  const leadsWithRest = stage === SetStage.Resting;
  const restOverrun = stage === SetStage.Resting && rest < 0;
  // Colour alone must not carry the news that rest has run out.
  const label = restOverrun
    ? { text: "Rest over", icon: stageLabel[SetStage.Resting]?.icon }
    : stageLabel[stage];
  const labelRef = useStageTransition(stage);

  const showSteppers = isActive && !readOnly;
  // Sets that are neither done nor underway recede.
  const quiet = stage === SetStage.Idle && !isActive;

  // Each field stacks over its own stepper so the pair reads as one unit.
  const unit = (
    key: SetFieldName,
    labelText: string,
    value: number,
    step: number,
    options: {
      tone: Tone;
      prominent?: boolean;
      time?: boolean;
      unit?: string;
      abs?: boolean;
      /** A clock that is counting: it changes every second, so it does not tick. */
      running?: boolean;
    },
  ) => {
    const current = options.abs ? Math.abs(value) : value;
    // A clock past zero shows how far over it is; say so, or 0:15 reads as time left.
    const isOver = options.running && value < 0;
    return (
      <div key={key} className="flex min-w-0 flex-col gap-2">
        <SetField
          label={isOver ? "Over by" : labelText}
          value={current}
          format={options.time ? formatTime : undefined}
          tone={options.tone}
          prominent={options.prominent}
          strong={isActive}
          tick={!options.running}
          readOnly={readOnly}
          quiet={quiet}
          onChange={(v) => onChange?.(key, v)}
        />
        {showSteppers && (
          <Stepper
            label={labelText.toLowerCase()}
            step={step}
            unit={options.unit}
            disableDecrement={current <= 0}
            onDecrement={() => onChange?.(key, Math.max(0, current - step))}
            onIncrement={() => onChange?.(key, current + step)}
          />
        )}
      </div>
    );
  };

  const durationUnit = unit("duration", "Time", duration, durationStep, {
    tone: timerTone(duration, SetStage.Active),
    prominent: leadsWithTime,
    time: true,
    unit: "s",
    abs: true,
    running: stage === SetStage.Active,
  });
  const restUnit = unit("rest", "Rest", rest, restStep, {
    tone: timerTone(rest, SetStage.Resting),
    prominent: leadsWithRest,
    time: true,
    unit: "s",
    abs: true,
    running: stage === SetStage.Resting,
  });
  const columns = [
    ...(isCardio && !leadsWithTime ? [durationUnit] : []),
    unit("reps", "Reps", reps, repsStep, { tone: baseTone }),
    ...(isCardio
      ? []
      : [unit("weight", "Weight", weight, weightStep, { tone: baseTone })]),
    ...(!leadsWithRest ? [restUnit] : []),
  ];
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
  };

  return (
    <div
      data-set-row=""
      className={cn(
        "tone-neutral",
        // A divider only between two sets, centred in the inset: the card's column
        // gap sits above it and this padding below. Whatever follows the last set
        // (the RPE scale) gets the gap and no line.
        !isOnly &&
          "border-tone-200 [[data-set-row]+&]:border-t [[data-set-row]+&]:pt-inset",
      )}
    >
      <div
        onClick={onActivate}
        onFocus={readOnly ? undefined : onActivate}
        role="group"
        aria-label={`Set, ${label ? label.text.toLowerCase() : "not started"}${isActive ? ", current" : ""}`}
        aria-current={isActive || undefined}
        data-stage={stage}
        className="flex flex-col gap-3"
      >
        {label && (
          <p
            ref={labelRef}
            className={cn(
              toneClass[
                stage === SetStage.Complete
                  ? "success"
                  : restOverrun
                    ? "danger"
                    : "neutral"
              ],
              "flex items-center gap-1.5 text-xs font-medium tracking-wider text-tone-800 uppercase",
            )}
          >
            {label.icon}
            {label.text}
          </p>
        )}
        {leadsWithTime && durationUnit}
        {leadsWithRest && restUnit}
        <div className="grid gap-2" style={gridStyle}>
          {columns}
        </div>
      </div>
    </div>
  );
}
