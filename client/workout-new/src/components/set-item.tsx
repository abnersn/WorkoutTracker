import { useEffect, useRef, type Dispatch } from "react";
import {
  SetStage,
  type WorkoutAction,
  type WorkoutSet,
} from "@workout-tracker/types";
import { useNotification, useTimer } from "@workout-tracker/hooks";
import { timeFormat } from "@workout-tracker/utils";
import { SET_DEFAULTS } from "../lib/build-log";
import { SetRow, type SetFieldName } from "./set-row";

export interface SetItemProps {
  exerciseId: string;
  set: WorkoutSet;
  isActive: boolean;
  isOnly: boolean;
  readOnly: boolean;
  dispatch: Dispatch<WorkoutAction>;
}

const FIELD_TO_KEY = {
  reps: "defaultReps",
  weight: "defaultWeight",
  rest: "defaultRestTime",
} as const;

/**
 * One set wired to the workout: its values live in the reducer, while the
 * rest countdown ticks locally while the set is resting.
 */
export function SetItem({
  exerciseId,
  set,
  isActive,
  isOnly,
  readOnly,
  dispatch,
}: SetItemProps) {
  const { notify } = useNotification();
  const { stage } = set;

  const restValue = set.defaultRestTime ?? SET_DEFAULTS.defaultRestTime;
  const reps = set.defaultReps ?? SET_DEFAULTS.defaultReps;
  const weight = set.defaultWeight ?? SET_DEFAULTS.defaultWeight;

  const restTimer = useTimer("restTimer", restValue, -1);
  const notified = useRef(true);
  const previousStage = useRef(stage);

  useEffect(() => {
    if (stage === SetStage.Resting) {
      restTimer.play();
    } else {
      restTimer.pause();
    }
    // The timer object is recreated every render; only the stage drives this.
  }, [stage]);

  // A set that is started again begins from its configured values.
  useEffect(() => {
    if (stage === SetStage.Idle && previousStage.current !== SetStage.Idle) {
      restTimer.set(restValue);
    }
    if (stage === SetStage.Active) {
      notified.current = false;
    }
    previousStage.current = stage;
  }, [stage]);

  useEffect(() => {
    if (
      stage === SetStage.Resting &&
      restTimer.value === 0 &&
      !notified.current
    ) {
      notified.current = true;
      notify("Rest time's up!");
    }
  }, [stage, restTimer.value, notify]);

  const activate = () =>
    dispatch({
      type: "UPDATE_ACTIVE_SET",
      payload: { exerciseId, setId: set.id },
    });

  const onChange = (field: SetFieldName, value: number) => {
    if (field === "rest") restTimer.set(value);
    dispatch({
      type: "UPDATE_SET",
      payload: {
        exerciseId,
        setId: set.id,
        changes: { [FIELD_TO_KEY[field]]: value },
      },
    });
  };

  return (
    <SetRow
      stage={stage}
      reps={reps}
      weight={weight}
      rest={restTimer.value}
      isActive={isActive}
      isOnly={isOnly}
      readOnly={readOnly}
      formatTime={timeFormat}
      onChange={onChange}
      onActivate={activate}
    />
  );
}
