// Types for the component workoutNew exposes (see its rspack.config.ts).
declare module "workoutNew/Workout" {
  export interface WorkoutProps {
    id: string;
    mode?: "new" | "view";
    fromLogs?: boolean;
    finished?: boolean;
    navigate?: (to: string) => void;
  }
  export function Workout(props: WorkoutProps): JSX.Element | null;
}
