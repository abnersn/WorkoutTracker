import type { Dispatch } from "react";
import type { Exercise, WorkoutAction } from "@workout-tracker/types";
import { hasIncompleteSets } from "@workout-tracker/utils";
import { ExerciseCard } from "./exercise-card";
import { RpeScale } from "./rpe-scale";
import { SetItem } from "./set-item";

export interface ExerciseItemProps {
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
  activeSetId: string | null;
  /** The whole workout is finished, or it is being viewed from the history. */
  readOnly: boolean;
  dispatch: Dispatch<WorkoutAction>;
}

/** An exercise wired to the workout reducer. */
export function ExerciseItem({
  exercise,
  isFirst,
  isLast,
  isActive,
  activeSetId,
  readOnly,
  dispatch,
}: ExerciseItemProps) {
  const isComplete = exercise.sets.length > 0 && !hasIncompleteSets(exercise);
  const payload = { exerciseId: exercise.id };

  const children = exercise.sets.map((set) => (
    <SetItem
      key={set.id}
      exerciseId={exercise.id}
      set={set}
      isActive={set.id === activeSetId}
      isOnly={exercise.sets.length === 1}
      readOnly={readOnly}
      dispatch={dispatch}
    />
  ));
  if (isComplete) {
    children.push(
      <RpeScale
        key="rpe"
        value={exercise.rpe ?? 5}
        readOnly={readOnly}
        onChange={(rpe) =>
          dispatch({
            type: "UPDATE_EXERCISE_RPE",
            payload: { ...payload, rpe },
          })
        }
      />,
    );
  }

  return (
    <ExerciseCard
      name={exercise.name}
      isActive={isActive}
      isFirst={isFirst}
      isLast={isLast}
      readOnly={readOnly}
      canRemoveSet={activeSetId !== null}
      onMoveUp={() =>
        dispatch({ type: "MOVE_EXERCISE", payload: { ...payload, factor: -1 } })
      }
      onMoveDown={() =>
        dispatch({ type: "MOVE_EXERCISE", payload: { ...payload, factor: 1 } })
      }
      onAddSet={() => dispatch({ type: "ADD_SET", payload })}
      onRemoveSet={() => dispatch({ type: "REMOVE_SET", payload })}
      onRemoveExercise={() => dispatch({ type: "REMOVE_EXERCISE", payload })}
    >
      {children}
    </ExerciseCard>
  );
}
