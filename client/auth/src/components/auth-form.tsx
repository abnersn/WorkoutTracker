import type { FormEvent, ReactNode } from "react";
import {
  authPath,
  useAuth,
  type AuthScreen,
} from "@workout-tracker/auth-state";
import { Button, SectionHeading, cn, toneClass } from "@workout-tracker/ui";
import { linkClickHandler } from "@workout-tracker/utils";

/** What the shell hands every auth screen. */
export interface AuthScreenProps {
  navigate: (to: string) => void;
  /** Where to go once signed in. */
  redirectTo: string;
}

export interface AuthFormProps extends AuthScreenProps {
  title: string;
  submitLabel: string;
  pendingLabel: string;
  loading: boolean;
  error?: { message: string };
  /** Sends the form and resolves to the session token, if one came back. */
  submit: (form: FormData) => Promise<string | undefined>;
  /** The link to the other screen, e.g. "No account yet? Sign up". */
  alternative: { prompt: string; label: string; screen: AuthScreen };
  children: ReactNode;
}

/** A form field's text, trimmed unless it's a password. */
export function readText(form: FormData, name: string, trim = true): string {
  const value = String(form.get(name) ?? "");
  return trim ? value.trim() : value;
}

export function AuthForm({
  title,
  submitLabel,
  pendingLabel,
  loading,
  error,
  submit,
  alternative,
  navigate,
  redirectTo,
  children,
}: AuthFormProps): React.JSX.Element {
  const { signIn } = useAuth();
  const alternativeHref = authPath(alternative.screen);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      const token = await submit(new FormData(event.currentTarget));
      if (!token) {
        return;
      }
      signIn(token);
      navigate(redirectTo);
    } catch {
      // the mutation's error holds the message shown below
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(toneClass.neutral, "flex flex-col gap-4 px-4 py-6")}
    >
      <SectionHeading level={1} flush>
        {title}
      </SectionHeading>
      {children}
      {error && (
        <p role="alert" className="text-red-700">
          {error.message}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? pendingLabel : submitLabel}
      </Button>
      <p className="text-tone-700">
        {alternative.prompt}{" "}
        <a
          href={alternativeHref}
          onClick={linkClickHandler(alternativeHref, navigate)}
          className="font-semibold underline"
        >
          {alternative.label}
        </a>
      </p>
    </form>
  );
}
