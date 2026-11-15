import { LinkCard, type LinkCardProps } from "@workout-tracker/ui";

export type WorkoutSummaryCardProps = LinkCardProps;

/** A finished workout in the history: open it, or delete it. */
export function WorkoutSummaryCard({
  tone = "primary",
  ...props
}: WorkoutSummaryCardProps): React.JSX.Element {
  return <LinkCard tone={tone} {...props} />;
}
