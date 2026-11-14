export declare enum SetStage {
    Idle = "IDLE",
    Active = "ACTIVE",
    Resting = "RESTING",
    Complete = "COMPLETE"
}
export interface WorkoutSet {
    id: string;
    stage: SetStage;
    defaultDurationTime?: number;
    defaultReps?: number;
    defaultWeight?: number;
    defaultRestTime?: number;
}
export interface Exercise {
    id: string;
    name: string;
    type?: string;
    rpe?: number;
    sets: WorkoutSet[];
}
export interface Workout {
    id: string;
    name: string;
    date: Date;
    duration: number;
    isComplete: boolean;
    activeSetId: string | null;
    activeExerciseId?: string | null;
    exercises: Exercise[];
}
export type LogEntry = Workout & {
    persistenceKey?: number;
};
/** @deprecated IndexedDB object stores of the "workoutTracker" database (version 1). Being replaced. */
export type StoreName = "workouts" | "logs";
export type WorkoutAction = {
    type: "SET_WORKOUT";
    payload: Workout;
} | {
    type: "ADD_SET";
    payload: {
        exerciseId: string;
    };
} | {
    type: "REMOVE_SET";
    payload: {
        exerciseId: string;
    };
} | {
    type: "UPDATE_ACTIVE_SET";
    payload: {
        setId: string;
        exerciseId: string;
    };
} | {
    type: "UPDATE_SET_STAGE";
} | {
    type: "UPDATE_EXERCISE_TYPE";
    payload: {
        exerciseId: string;
        type: string;
    };
} | {
    type: "COMPLETE_EXERCISE";
} | {
    type: "ADD_EXERCISE";
    payload: {
        name: string;
    };
} | {
    type: "COMPLETE_WORKOUT";
} | {
    type: "MOVE_EXERCISE";
    payload: {
        exerciseId: string;
        factor: number;
    };
} | {
    type: "REMOVE_EXERCISE";
    payload: {
        exerciseId: string;
    };
} | {
    type: "UPDATE_SET";
    payload: {
        exerciseId: string;
        setId: string;
        changes: Partial<Pick<WorkoutSet, "defaultDurationTime" | "defaultReps" | "defaultWeight" | "defaultRestTime">>;
    };
} | {
    type: "UPDATE_EXERCISE_RPE";
    payload: {
        exerciseId: string;
        rpe: number;
    };
};
