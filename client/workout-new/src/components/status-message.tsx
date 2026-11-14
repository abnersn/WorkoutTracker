import type { ReactNode } from "react";
import { cn, focusRing, toneClass } from "@workout-tracker/ui";
import { linkClickHandler } from "@workout-tracker/utils";

export interface StatusMessageProps {
  title: string;
  children?: ReactNode;
  /** The way out: every dead end gets one. */
  action?: { label: string; href: string };
  navigate?: (to: string) => void;
  /** Still loading: announced politely, no action. */
  busy?: boolean;
}

/** A whole-screen state (loading, not found, failed) that never strands the person. */
export function StatusMessage({
  title,
  children,
  action,
  navigate,
  busy = false,
}: StatusMessageProps) {
  return (
    <section
      role={busy ? "status" : "alert"}
      aria-busy={busy || undefined}
      className="flex flex-1 flex-col gap-2 px-4 pt-10 pb-6"
    >
      <h2
        className={cn(
          "text-xl font-semibold text-balance",
          busy ? "text-indigo-700" : "text-indigo-800",
        )}
      >
        {title}
      </h2>
      {children && (
        <p className="max-w-prose text-base text-indigo-700">{children}</p>
      )}
      {action && (
        <a
          href={action.href}
          onClick={linkClickHandler(action.href, navigate)}
          className={cn(
            toneClass.neutral,
            focusRing,
            "mt-4 inline-flex min-h-11 items-center self-start rounded-control bg-tone-solid px-4 text-sm font-medium text-white hover:bg-tone-solid-hover active:bg-tone-solid-active",
          )}
        >
          {action.label}
        </a>
      )}
    </section>
  );
}
