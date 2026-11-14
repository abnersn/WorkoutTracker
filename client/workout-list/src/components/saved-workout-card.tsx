import { LinkCard, type LinkCardProps } from "@workout-tracker/ui";

export type SavedWorkoutCardProps = Omit<LinkCardProps, "tone">;

/** A saved workout: open it to start, or delete it. */
export function SavedWorkoutCard(props: SavedWorkoutCardProps) {
  return <LinkCard tone="neutral" {...props} />;
}
