import { useEffect, useId, useRef, useState } from "react";
import {
  cssToken,
  easingToken,
  msToken,
  prefersReducedMotion,
} from "../motion";
import { cn, toneClass, type Tone } from "./tone";
import { TextLabel } from "./text-label";

export interface SetFieldProps {
  label: string;
  value: number;
  tone?: Tone;
  /** How the value reads when the field is not being edited, e.g. 90 -> 1:30. */
  format?: (value: number) => string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  /** Fires when editing starts and stops, so the row can become the active set. */
  onEditingChange?: (isEditing: boolean) => void;
  /** The one value to read at a glance: set larger and bolder. */
  prominent?: boolean;
  /** The current set: the value is set in a heavier weight. */
  strong?: boolean;
  /** A set that is waiting its turn: lighter text and no white well. */
  quiet?: boolean;
  /**
   * Slide a changed value in from the side it moved toward (up for more, down for
   * less). Turn it off for a running clock, which changes every second.
   */
  tick?: boolean;
}

/**
 * A number that reads as formatted text and turns into an input on focus.
 * It is always a real input, so keyboards and screen readers get a form field.
 */
export function SetField({
  label,
  value,
  tone = "neutral",
  format = String,
  readOnly = false,
  onChange,
  onEditingChange,
  prominent = false,
  strong = false,
  quiet = false,
  tick = true,
}: SetFieldProps) {
  const id = useId();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previous = useRef(value);

  // A stepper press: the new number slides in from the direction it moved.
  // Typed values are left alone; the person is already looking at them.
  useEffect(() => {
    const before = previous.current;
    previous.current = value;
    const el = inputRef.current;
    if (!el || !tick || isEditing || before === value || !el.animate) return;
    if (prefersReducedMotion()) {
      el.animate([{ opacity: 0.35 }, { opacity: 1 }], {
        duration: msToken("--duration-quick"),
        easing: "ease-out",
      });
      return;
    }
    const distance = cssToken("--distance-value-slide");
    const from = value > before ? distance : `-${distance}`;
    el.animate(
      [
        { transform: `translateY(${from})`, opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      {
        duration: msToken("--duration-base"),
        easing: easingToken("--ease-settle"),
      },
    );
    // isEditing is read, not reacted to: only a value change starts the tick.
  }, [value]);

  return (
    <div className={cn(toneClass[tone], "min-w-0 text-tone-800")}>
      <TextLabel
        as="label"
        htmlFor={id}
        className={cn("mb-1 block truncate", quiet && "text-slate-600")}
      >
        {label}
      </TextLabel>
      {/* The well is the wrapper, so the number can move inside it while the border
          stays put; tone changes (done, overrun) ease in rather than snap. */}
      <div
        className={cn(
          "tabular flex items-center overflow-hidden rounded-control border border-tone-200 text-tone-800 shadow-sm",
          "transition-[color,background-color,border-color,box-shadow] duration-(--duration-slow) ease-out",
          quiet
            ? "bg-transparent text-slate-600 shadow-none"
            : tone === "neutral"
              ? "bg-white"
              : "bg-tone-50",
          prominent
            ? "min-h-16 text-4xl font-semibold"
            : cn("min-h-11 text-lg", strong && "font-semibold"),
          "focus-within:border-tone-400 focus-within:ring-2 focus-within:ring-tone-200",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          readOnly={readOnly}
          value={isEditing ? String(value) : format(value)}
          onFocus={(ev) => {
            if (readOnly) return;
            setIsEditing(true);
            onEditingChange?.(true);
            ev.currentTarget.select();
          }}
          onBlur={() => {
            if (!isEditing) return;
            setIsEditing(false);
            onEditingChange?.(false);
          }}
          onChange={(ev) => {
            const digits = ev.target.value.replace(/\D/g, "");
            onChange?.(digits === "" ? 0 : Number(digits));
          }}
          className={cn(
            "block w-full min-w-0 self-stretch bg-transparent outline-none",
            prominent ? "px-3" : "px-2",
            readOnly && "cursor-default",
          )}
        />
      </div>
    </div>
  );
}
