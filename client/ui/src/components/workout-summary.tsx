import { Check, TrendingDown, TrendingUp } from "lucide-react";
import type { Workout } from "@workout-tracker/types";
import { useWeightUnit } from "@workout-tracker/hooks";
import { formatDate, formatDateTime, timeFormat } from "@workout-tracker/utils";
import { tallyWorkout } from "../lib/build-log";

export interface WorkoutSummaryProps {
  workout: Workout;
  /** The previous run of the same workout, for the comparison line. */
  previous?: Workout | null;
  /** Opened straight after finishing: lead with the confirmation. */
  finished?: boolean;
}

// English UI, English numbers: "1,940", never "1.940".
const number = new Intl.NumberFormat("en");

/** The finished session in three numbers, and how it compares with last time. */
export function WorkoutSummary({
  workout,
  previous,
  finished = false,
}: WorkoutSummaryProps) {
  const { logged, volume } = tallyWorkout(workout);
  const [unit] = useWeightUnit();
  const stats = [
    { label: "Time", value: timeFormat(workout.duration) },
    { label: logged === 1 ? "Set" : "Sets", value: number.format(logged) },
    { label: `Volume (${unit})`, value: number.format(volume) },
  ];

  const before = previous ? tallyWorkout(previous).volume : null;
  const delta = before === null ? null : volume - before;

  return (
    <section
      aria-label="Session summary"
      className="tone-success flex flex-col gap-3 rounded-card border border-green-200 bg-green-50 p-inset"
    >
      {finished ? (
        <p
          role="status"
          className="flex items-center gap-2 text-lg font-semibold text-green-900"
        >
          <Check size={22} aria-hidden="true" />
          Saved to your history
        </p>
      ) : (
        <p className="text-base font-medium text-green-900">
          {formatDateTime(workout.date)}
        </p>
      )}
      {/* Left-aligned like every other list and card; the rules mark the columns. */}
      <dl className="grid grid-cols-3 divide-x divide-green-200">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-0.5 px-3 first:pl-0"
          >
            <dt className="text-sm text-green-800">{stat.label}</dt>
            <dd className="tabular text-2xl font-semibold text-green-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {previous && delta !== null && (
        <p className="flex items-center gap-2 border-t border-green-200 pt-3 text-base text-green-900">
          {delta >= 0 ? (
            <TrendingUp size={20} aria-hidden="true" className="shrink-0" />
          ) : (
            <TrendingDown size={20} aria-hidden="true" className="shrink-0" />
          )}
          <span>
            {delta === 0
              ? "Same volume as"
              : `${number.format(Math.abs(delta))} ${unit} ${delta > 0 ? "more" : "less"} than`}{" "}
            last time ({formatDate(previous.date)})
          </span>
        </p>
      )}
    </section>
  );
}
