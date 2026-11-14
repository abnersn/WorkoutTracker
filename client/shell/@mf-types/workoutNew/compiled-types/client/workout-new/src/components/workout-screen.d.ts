import { type Workout } from "@workout-tracker/types";
export interface WorkoutScreenProps {
    workout: Workout;
    /** `view` shows a finished log without any editing controls. */
    mode?: "new" | "view";
    /** In view mode: the link that starts a new workout from this log. */
    reuseHref?: string;
    /** Called with the history entry when the person confirms finishing. */
    onFinish?: (log: Workout) => void | Promise<void>;
    onSaveTemplate?: (exercises: Workout["exercises"]) => void | Promise<void>;
    /** Client-side navigation supplied by the host. */
    navigate?: (to: string) => void;
}
/** A workout being run (`new`) or reviewed (`view`). Persistence is the caller's. */
export declare function WorkoutScreen({ workout: initial, mode, reuseHref, onFinish, onSaveTemplate, navigate, }: WorkoutScreenProps): import("react").JSX.Element;
