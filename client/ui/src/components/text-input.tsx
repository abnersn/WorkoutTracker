import { useId, type InputHTMLAttributes } from "react";
import { cn, toneClass } from "./tone";

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Visible label. Omit it only when `aria-label` names the field. */
  label?: string;
  /** Names the problem and the way out. */
  error?: string;
}

export function TextInput({
  label,
  error,
  id,
  className,
  ...props
}: TextInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn(toneClass[error ? "danger" : "neutral"], "block")}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm tracking-wider text-tone-800 uppercase"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "min-h-11 w-full rounded-control border border-tone-200 bg-white px-3 text-tone-800 placeholder:text-slate-500",
          "focus-visible:border-tone-400 focus-visible:ring-2 focus-visible:ring-tone-200 focus-visible:outline-none",
          "disabled:opacity-50",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-tone-700">
          {error}
        </p>
      )}
    </div>
  );
}
