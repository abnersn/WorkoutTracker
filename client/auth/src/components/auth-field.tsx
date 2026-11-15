import { useId, type InputHTMLAttributes } from "react";
import { TextLabel } from "@workout-tracker/ui";

export interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  /** Shown under the input and announced with it. */
  hint?: string;
}

export function AuthField({
  label,
  hint,
  ...inputProps
}: AuthFieldProps): React.JSX.Element {
  const hintId = useId();
  return (
    <label className="flex flex-col gap-1">
      <TextLabel as="span" className="text-tone-700">
        {label}
      </TextLabel>
      <input
        required
        aria-describedby={hint ? hintId : undefined}
        className="min-h-11 rounded-control border border-tone-200 bg-white px-3 text-tone-800 focus-visible:border-tone-400 focus-visible:ring-2 focus-visible:ring-tone-200 focus-visible:outline-none"
        {...inputProps}
      />
      {hint && (
        <span id={hintId} className="text-sm text-slate-600">
          {hint}
        </span>
      )}
    </label>
  );
}

// Limits match SignUpInput/SignInInput in server/gateway/src/auth/auth.types.ts.

export function EmailField(): React.JSX.Element {
  return (
    <AuthField
      name="email"
      type="email"
      label="Email"
      maxLength={254}
      autoComplete="email"
    />
  );
}

export function PasswordField({
  isNew = false,
}: {
  /** A password being chosen (sign-up) rather than entered (sign-in). */
  isNew?: boolean;
}): React.JSX.Element {
  return (
    <AuthField
      name="password"
      type="password"
      label="Password"
      maxLength={128}
      {...(isNew
        ? {
            minLength: 8,
            autoComplete: "new-password",
            hint: "8 or more characters",
          }
        : { autoComplete: "current-password" })}
    />
  );
}
