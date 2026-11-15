import { useEffect, useRef, type Dispatch } from "react";
import {
  SetStage,
  type WorkoutAction,
  type WorkoutSet,
} from "@workout-tracker/types";
import {
  useNotification,
  useTimer,
  useWeightUnit,
  weightStepFor,
} from "@workout-tracker/hooks";
import {
  fromDisplayWeight,
  secondsSince,
  timeFormat,
  toDisplayWeight,
} from "@workout-tracker/utils";
import { SET_DEFAULTS } from "../lib/build-log";
import { SetRow, type SetFieldName } from "./set-row";

export interface SetItemProps {
  exerciseId: string;
  /** 1-based position in its exercise. */
  number: number;
  /** The set up after the one currently resting: labelled "Next set". */
  isNext?: boolean;
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
  number,
  isNext,
  set,
  isActive,
  isOnly,
  readOnly,
  dispatch,
}: SetItemProps): React.JSX.Element {
  const { notify } = useNotification();
  const [weightUnit] = useWeightUnit();
  const { stage } = set;

  const restValue = set.defaultRestTime ?? SET_DEFAULTS.defaultRestTime;
  const reps = set.defaultReps ?? SET_DEFAULTS.defaultReps;
  // Stored in kg; shown in the lifter's unit.
  const weight = toDisplayWeight(
    set.defaultWeight ?? SET_DEFAULTS.defaultWeight,
    weightUnit,
  );

  // A rest picked back up after a reload continues from where the clock is now.
  const restTimer = useTimer(
    `restTimer:${set.id}`,
    stage === SetStage.Resting && set.restStartedAt
      ? restValue - secondsSince(set.restStartedAt)
      : restValue,
    -1,
    -Infinity,
  );
  // A rest resumed after a reload still owes its alert if it hasn't run out.
  const notified = useRef(!(stage === SetStage.Resting && restTimer.value > 0));
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
      // <= 0: a tab that slept through zero catches up past it.
      restTimer.value <= 0 &&
      !notified.current
    ) {
      notified.current = true;
      notify("Rest's over. Time for your next set.");
      // A buzz reaches a phone on the bench face-down, where a banner can't.
      navigator.vibrate?.([200, 100, 200]);
    }
  }, [stage, restTimer.value, notify]);

  const activate = (): void =>
    dispatch({
      type: "UPDATE_ACTIVE_SET",
      payload: { exerciseId, setId: set.id },
    });

  const onChange = (field: SetFieldName, value: number): void => {
    if (field === "rest" && stage === SetStage.Resting) {
      // Mid-rest, ±15s changes this rest only. The planned rest stays as it was;
      // the start stamp shifts so a reload still lands on the adjusted countdown.
      restTimer.set(value);
      if (set.restStartedAt !== undefined) {
        dispatch({
          type: "UPDATE_SET",
          payload: {
            exerciseId,
            setId: set.id,
            changes: {
              restStartedAt:
                set.restStartedAt + (value - restTimer.value) * 1000,
            },
          },
        });
      }
      if (value > 0) {
        notified.current = false;
      }
      return;
    }
    if (field === "rest") {
      restTimer.set(value);
    }
    // Weights come in as the lifter's unit and are stored in kg.
    const stored =
      field === "weight" ? fromDisplayWeight(value, weightUnit) : value;
    dispatch({
      type: "UPDATE_SET",
      payload: {
        exerciseId,
        setId: set.id,
        changes: { [FIELD_TO_KEY[field]]: stored },
      },
    });
  };

  return (
    <SetRow
      number={number}
      isNext={isNext}
      stage={stage}
      reps={reps}
      weight={weight}
      // Only a resting set shows the live countdown; otherwise the planned rest.
      rest={stage === SetStage.Resting ? restTimer.value : restValue}
      isActive={isActive}
      isOnly={isOnly}
      readOnly={readOnly}
      weightUnit={weightUnit}
      weightStep={weightStepFor(weightUnit)}
      formatTime={timeFormat}
      onChange={onChange}
      onActivate={activate}
    />
  );
}
