export interface SavedWorkout {
    id: string;
    name: string;
    /** When the workout was last finished, if ever. */
    lastRun?: Date;
}
export interface WorkoutListProps {
    workouts: SavedWorkout[];
    onAdd: (name: string) => void;
    onRemove: (id: string) => void;
    navigate?: (to: string) => void;
}
/** The saved workouts: open one to start it, add a new one, or delete one. */
export declare function WorkoutList({ workouts, onAdd, onRemove, navigate, }: WorkoutListProps): import("react").JSX.Element;
