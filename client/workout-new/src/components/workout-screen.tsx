import { useReducer, useState } from "react";
import {
  Bell,
  ChevronLeft,
  Play,
  RotateCcw,
  Save,
  Star,
  Timer,
  Trophy,
} from "lucide-react";
import { SetStage, type Workout } from "@workout-tracker/types";
import { reducer } from "@workout-tracker/reducer";
import { useNotification, useTimer } from "@workout-tracker/hooks";
import {
  formatDate,
  hasIncompleteExercises,
  hasIncompleteSets,
  linkClickHandler,
  timeFormat,
} from "@workout-tracker/utils";
import {
  AddItemForm,
  Badge,
  Button,
  Dialog,
  EmptyMessage,
  SectionHeading,
} from "@workout-tracker/ui";
import { buildLog, normalizeExercises } from "../lib/build-log";
import { ActionBar } from "./action-bar";
import { ExerciseItem } from "./exercise-item";

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
export function WorkoutScreen({
  workout: initial,
  mode = "new",
  reuseHref,
  onFinish,
  onSaveTemplate,
  navigate,
}: WorkoutScreenProps) {
  const isView = mode === "view";
  const [workout, dispatch] = useReducer(reducer, initial);
  const timer = useTimer("mainTimer", initial.duration);
  const { requestNotificationPermission, hasAskedPermission } =
    useNotification();
  const [confirmingFinish, setConfirmingFinish] = useState(false);

  const readOnly = isView || workout.isComplete;
  const activeExercise = workout.exercises.find(
    (e) => e.id === workout.activeExerciseId,
  );
  const activeSet = activeExercise?.sets.find(
    (s) => s.id === workout.activeSetId,
  );
  const hasSets = workout.exercises[0]?.sets.length > 0;

  const startWorkout = () => {
    timer.play();
    dispatch({
      type: "UPDATE_ACTIVE_SET",
      payload: {
        exerciseId: workout.exercises[0]?.id,
        setId: workout.exercises[0]?.sets[0]?.id,
      },
    });
    dispatch({ type: "UPDATE_SET_STAGE" });
  };

  const finish = async () => {
    setConfirmingFinish(false);
    timer.pause();
    dispatch({ type: "COMPLETE_WORKOUT" });
    await onFinish?.(buildLog(workout, timer.value));
  };

  const stageButton = () => {
    if (!activeSet) return null;
    const stages = {
      [SetStage.Idle]: { label: "Start", icon: <Play size={20} /> },
      [SetStage.Active]: { label: "Rest", icon: <Timer size={20} /> },
      [SetStage.Resting]: { label: "Complete", icon: <Star size={20} /> },
      [SetStage.Complete]: { label: "Reset", icon: <RotateCcw size={20} /> },
    };
    const { label, icon } = stages[activeSet.stage];
    return (
      <Button
        tone={activeSet.stage === SetStage.Complete ? "primary" : "neutral"}
        icon={icon}
        onClick={() => dispatch({ type: "UPDATE_SET_STAGE" })}
      >
        {label}
      </Button>
    );
  };

  const finishButton = () => {
    if (!hasIncompleteExercises(workout)) {
      return (
        <Button
          tone="success"
          icon={<Trophy size={20} />}
          onClick={() => setConfirmingFinish(true)}
        >
          Complete
        </Button>
      );
    }
    if (activeExercise && !hasIncompleteSets(activeExercise)) {
      return (
        <Button
          tone="success"
          icon={<Star size={20} />}
          onClick={() => dispatch({ type: "COMPLETE_EXERCISE" })}
        >
          Finish exercise
        </Button>
      );
    }
    return null;
  };

  const actions = () => {
    if (isView) {
      return reuseHref ? (
        <Button
          icon={<Play size={20} />}
          tone="primary"
          onClick={(event) => {
            const handler = linkClickHandler(reuseHref, navigate);
            if (handler) handler(event);
            else window.location.assign(reuseHref);
          }}
        >
          Use workout
        </Button>
      ) : null;
    }
    if (workout.isComplete) return null;
    if (timer.isRunning) {
      return (
        <>
          {stageButton()}
          {finishButton()}
        </>
      );
    }
    if (workout.exercises.length > 0 && hasSets) {
      return (
        <Button tone="primary" icon={<Play size={20} />} onClick={startWorkout}>
          Start workout
        </Button>
      );
    }
    return null;
  };

  const backHref = "/";
  return (
    <section
      data-testid={isView ? "workout-view" : "workout-new"}
      className="flex flex-1 flex-col"
    >
      <header className="flex items-center gap-2 px-4 pt-6">
        <a
          href={backHref}
          onClick={linkClickHandler(backHref, navigate)}
          aria-label="Back"
          className="tone-neutral -ml-2 inline-flex size-11 items-center justify-center rounded-control text-tone-700 hover:bg-tone-50"
        >
          <ChevronLeft size={24} />
        </a>
        <SectionHeading className="min-w-0 flex-1 p-0">
          {workout.name}
        </SectionHeading>
        {!isView && !hasAskedPermission && (
          <Button
            variant="ghost"
            aria-label="Enable notifications"
            title="Enable notifications"
            onClick={requestNotificationPermission}
          >
            <Bell size={20} />
          </Button>
        )}
        {!isView &&
          !timer.isRunning &&
          !workout.isComplete &&
          onSaveTemplate && (
            <Button
              variant="ghost"
              aria-label="Save as template"
              title="Save as template"
              onClick={() => onSaveTemplate(normalizeExercises(workout))}
            >
              <Save size={20} />
            </Button>
          )}
      </header>
      <main className="flex flex-1 flex-col gap-inset p-4">
        {workout.exercises.length > 0 ? (
          <ul className="flex flex-col gap-inset">
            {workout.exercises.map((exercise, i) => (
              <li key={exercise.id}>
                <ExerciseItem
                  exercise={exercise}
                  isFirst={i === 0}
                  isLast={i === workout.exercises.length - 1}
                  isActive={!isView && exercise.id === workout.activeExerciseId}
                  activeSetId={workout.activeSetId}
                  readOnly={readOnly}
                  dispatch={dispatch}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyMessage>No exercises to list.</EmptyMessage>
        )}
        {!readOnly && (
          <AddItemForm
            label="Add exercise"
            placeholder="Exercise name"
            className="m-0"
            onSubmit={(name) =>
              dispatch({ type: "ADD_EXERCISE", payload: { name } })
            }
          />
        )}
      </main>
      <ActionBar>
        <Badge
          tone={workout.isComplete || isView ? "success" : "neutral"}
          icon={<Timer size={20} />}
          caption={formatDate(workout.date ?? new Date())}
          className="mr-auto"
        >
          <time dateTime={`PT${timer.value}S`}>{timeFormat(timer.value)}</time>
        </Badge>
        {actions()}
      </ActionBar>
      <Dialog
        open={confirmingFinish}
        title="Would you like to save your progress?"
        onClose={() => setConfirmingFinish(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirmingFinish(false)}>
              Cancel
            </Button>
            <Button tone="success" onClick={finish}>
              Complete
            </Button>
          </>
        }
      />
    </section>
  );
}
