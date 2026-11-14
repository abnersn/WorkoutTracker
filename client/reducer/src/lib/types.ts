// Domain types for the workout reducer.
export enum SetStage {
  Idle = "IDLE",
  Active = "ACTIVE",
  Resting = "RESTING",
  Complete = "COMPLETE",
}

export interface WorkoutSet {
  id: string;
  stage: SetStage;
}

export interface Exercise {
  id: string;
  name: string;
  type?: string;
  sets: WorkoutSet[];
}

export interface Workout {
  exercises: Exercise[];
  activeSetId: string | null;
  activeExerciseId?: string | null;
  isComplete?: boolean;
}

export type WorkoutAction =
  | { type: "SET_WORKOUT"; payload: Workout }
  | { type: "ADD_SET"; payload: { exerciseId: string } }
  | { type: "REMOVE_SET"; payload: { exerciseId: string } }
  | {
      type: "UPDATE_ACTIVE_SET";
      payload: { setId: string; exerciseId: string };
    }
  | { type: "UPDATE_SET_STAGE" }
  | {
      type: "UPDATE_EXERCISE_TYPE";
      payload: { exerciseId: string; type: string };
    }
  | { type: "COMPLETE_EXERCISE" }
  | { type: "ADD_EXERCISE"; payload: { name: string } }
  | { type: "COMPLETE_WORKOUT" }
  | { type: "MOVE_EXERCISE"; payload: { exerciseId: string; factor: number } }
  | { type: "REMOVE_EXERCISE"; payload: { exerciseId: string } };
