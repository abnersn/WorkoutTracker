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
  exerciseType: "weight" | "cardio";
  set: WorkoutSet;
  isActive: boolean;
  isOnly: boolean;
  readOnly: boolean;
  dispatch: Dispatch<WorkoutAction>;
}

const FIELD_TO_KEY = {
  duration: "defaultDurationTime",
  reps: "defaultReps",
  weight: "defaultWeight",
  rest: "defaultRestTime",
} as const;

/**
 * One set wired to the workout: its values live in the reducer, while the
 * time and rest countdowns tick locally while the set is in the matching stage.
 */
export function SetItem({
  exerciseId,
  exerciseType,
  set,
  isActive,
  isOnly,
  readOnly,
  dispatch,
}: SetItemProps) {
  const { notify } = useNotification();
  const { stage } = set;

  const durationValue =
    set.defaultDurationTime ?? SET_DEFAULTS.defaultDurationTime;
  const restValue = set.defaultRestTime ?? SET_DEFAULTS.defaultRestTime;
  const reps = set.defaultReps ?? SET_DEFAULTS.defaultReps;
  const weight = set.defaultWeight ?? SET_DEFAULTS.defaultWeight;

  const durationTimer = useTimer("durationTimer", durationValue, -1);
  const restTimer = useTimer("restTimer", restValue, -1);
  const notified = useRef({ duration: true, rest: true });
  const previousStage = useRef(stage);

  const isCardio = exerciseType === "cardio";

  useEffect(() => {
    if (isCardio && stage === SetStage.Active) {
      durationTimer.play();
    } else {
      durationTimer.pause();
    }
    if (stage === SetStage.Resting) {
      restTimer.play();
    } else {
      restTimer.pause();
    }
    // The timer objects are recreated every render; only the stage drives this.
  }, [stage, isCardio]);

  // A set that is started again begins from its configured values.
  useEffect(() => {
    if (stage === SetStage.Idle && previousStage.current !== SetStage.Idle) {
      durationTimer.set(durationValue);
      restTimer.set(restValue);
    }
    if (stage === SetStage.Active) {
      notified.current = { duration: false, rest: false };
    }
    previousStage.current = stage;
  }, [stage]);

  useEffect(() => {
    if (
      stage === SetStage.Resting &&
      restTimer.value === 0 &&
      !notified.current.rest
    ) {
      notified.current.rest = true;
      notify("Rest time's up!");
    }
    if (
      stage === SetStage.Active &&
      isCardio &&
      durationTimer.value === 0 &&
      !notified.current.duration
    ) {
      notified.current.duration = true;
      notify("Exercise time's up!");
    }
  }, [stage, isCardio, restTimer.value, durationTimer.value, notify]);

  const activate = () =>
    dispatch({
      type: "UPDATE_ACTIVE_SET",
      payload: { exerciseId, setId: set.id },
    });

  const onChange = (field: SetFieldName, value: number) => {
    if (field === "rest") restTimer.set(value);
    if (field === "duration") durationTimer.set(value);
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
      exerciseType={exerciseType}
      duration={durationTimer.value}
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
