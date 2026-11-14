import { useRef, type Dispatch } from "react";
import {
  SetStage,
  type Exercise,
  type WorkoutAction,
} from "@workout-tracker/types";
import { hasIncompleteSets } from "@workout-tracker/utils";
import { nextSetValues } from "../lib/build-log";
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
  /** A finished entry whose missing effort rating can still be given. */
  canRate?: boolean;
  /** The workout clock is running: structure is locked unless `editing`. */
  running?: boolean;
  /** The lifter turned on "Edit" mid-workout. */
  editing?: boolean;
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
  canRate = false,
  running = false,
  editing = false,
  dispatch,
}: ExerciseItemProps) {
  const isComplete = exercise.sets.length > 0 && !hasIncompleteSets(exercise);
  // Unrated when the summary opened: stays adjustable after the first touch.
  const wasUnrated = useRef(exercise.rpe === undefined);
  const done = exercise.sets.filter(
    (s) => s.stage === SetStage.Complete,
  ).length;
  const total = exercise.sets.length;
  const payload = { exerciseId: exercise.id };

  // While one set rests, the first unfinished set after it is the one up next.
  const restingIndex = exercise.sets.findIndex(
    (s) => s.stage === SetStage.Resting,
  );
  const nextIndex =
    restingIndex === -1
      ? -1
      : exercise.sets.findIndex(
          (s, j) => j > restingIndex && s.stage !== SetStage.Complete,
        );

  const children = exercise.sets.map((set, i) => (
    <SetItem
      key={set.id}
      number={i + 1}
      isNext={i === nextIndex}
      exerciseId={exercise.id}
      set={set}
      isActive={set.id === activeSetId}
      isOnly={exercise.sets.length === 1}
      readOnly={readOnly}
      dispatch={dispatch}
    />
  ));
  // RPE is asked during the rest after the last set, while the effort is fresh,
  // and stays open on a finished exercise until it's rated.
  const onLastRest =
    total > 0 &&
    exercise.sets.every(
      (s) => s.stage === SetStage.Complete || s.stage === SetStage.Resting,
    ) &&
    exercise.sets.some((s) => s.stage === SetStage.Resting);
  const awaitingRating = running && isComplete && exercise.rpe === undefined;
  if (isComplete || onLastRest) {
    children.push(
      <RpeScale
        key="rpe"
        value={exercise.rpe}
        readOnly={readOnly && !(canRate && wasUnrated.current)}
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
      // Planning shows every control; a running workout only what logging needs.
      editing={!running || editing}
      canAddSet={running && isActive}
      collapsed={running && !isActive && !editing && !awaitingRating}
      summary={
        running && total > 0
          ? isComplete
            ? total === 1
              ? "Set done"
              : `All ${total} sets done`
            : `${done} of ${total} ${total === 1 ? "set" : "sets"} done`
          : undefined
      }
      canRemoveSet={exercise.sets.some((s) => s.id === activeSetId)}
      selectedSetNumber={
        exercise.sets.findIndex((s) => s.id === activeSetId) + 1 || undefined
      }
      onMoveUp={() =>
        dispatch({ type: "MOVE_EXERCISE", payload: { ...payload, factor: -1 } })
      }
      onMoveDown={() =>
        dispatch({ type: "MOVE_EXERCISE", payload: { ...payload, factor: 1 } })
      }
      onAddSet={() =>
        dispatch({
          type: "ADD_SET",
          payload: { ...payload, values: nextSetValues(exercise) },
        })
      }
      onRemoveSet={() => dispatch({ type: "REMOVE_SET", payload })}
      onRemoveExercise={() => dispatch({ type: "REMOVE_EXERCISE", payload })}
    >
      {children}
    </ExerciseCard>
  );
}
