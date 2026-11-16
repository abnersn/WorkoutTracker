import { cn, toneClass, type Tone } from "./tone";

/** A quiet bar standing in for text or a control that has not arrived yet. */
export function Skeleton({
  tone = "neutral",
  className,
}: {
  tone?: Tone;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn(
        toneClass[tone],
        "animate-skeleton rounded-control bg-tone-200 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

interface PlaceholderProps {
  /** Announced once to screen readers; the bars themselves are hidden. */
  label: string;
  tone?: Tone;
  className?: string;
}

function Placeholder({
  label,
  className,
  children,
}: PlaceholderProps & { children: React.ReactNode }): React.JSX.Element {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

const WIDTHS = ["w-3/5", "w-2/5", "w-1/2"];

/**
 * The shape of a saved-workout or history list: the same card, inset and gap as
 * `LinkCard`, so the real list lands where the placeholder was.
 */
export function CardListSkeleton({
  label,
  tone = "neutral",
  rows = 3,
  withHeading = false,
}: PlaceholderProps & {
  rows?: number;
  /** Include the section heading; the remotes draw their own, the shell cannot. */
  withHeading?: boolean;
}): React.JSX.Element {
  return (
    <Placeholder label={label}>
      {withHeading && (
        <div aria-hidden="true" className="px-4 pt-6">
          <Skeleton tone={tone} className="h-8 w-44" />
        </div>
      )}
      <div aria-hidden="true" className="flex flex-col gap-inset p-4">
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className={cn(
              toneClass[tone],
              "flex h-21 flex-col justify-center gap-2 rounded-card border border-tone-200 bg-tone-50 p-inset",
            )}
          >
            <Skeleton
              tone={tone}
              // Uneven widths read as names of different lengths, not a pattern.
              className={cn("h-5", WIDTHS[i % WIDTHS.length])}
            />
            <Skeleton tone={tone} className="h-4 w-28" />
          </div>
        ))}
      </div>
    </Placeholder>
  );
}

/**
 * The workout screen: back button and title, then exercise cards with their set
 * rows. Shared by the shell's loading fallback and the screens' own data loading,
 * so the hand-off between the two is invisible.
 */
export function WorkoutScreenSkeleton({
  label,
}: {
  label: string;
}): React.JSX.Element {
  return (
    <Placeholder label={label} className="flex flex-1 flex-col">
      <div aria-hidden="true" className="flex items-center gap-2 px-4 pt-6">
        <Skeleton className="-ml-2 size-11 shrink-0" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div aria-hidden="true" className="flex flex-col gap-inset p-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="tone-neutral flex flex-col gap-2 rounded-card border border-tone-200 bg-tone-50 p-inset"
          >
            <Skeleton className="mb-1 h-6 w-2/5" />
            {[0, 1, 2].map((j) => (
              <Skeleton key={j} className="h-11 w-full bg-tone-100" />
            ))}
          </div>
        ))}
      </div>
    </Placeholder>
  );
}
