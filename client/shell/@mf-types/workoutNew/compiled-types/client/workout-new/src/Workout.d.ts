import "./styles.css";
export interface WorkoutProps {
    /** Template id (new), or the numeric log key as a string when `fromLogs`/`mode="view"`. */
    id: string;
    mode?: "new" | "view";
    /** In new mode: `id` is a history entry to repeat rather than a saved workout. */
    fromLogs?: boolean;
    navigate?: (to: string) => void;
}
/** Loads a workout from IndexedDB and shows it. Exposed to other remotes. */
export declare function Workout({ id, mode, fromLogs, navigate, }: WorkoutProps): import("react").JSX.Element | null;
