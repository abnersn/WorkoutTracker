import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  BellRing,
  Check,
  ChevronLeft,
  Flag,
  Pencil,
  Play,
  RotateCcw,
  Save,
  SkipForward,
  Timer,
} from "lucide-react";
import {
  SetStage,
  type LogEntry,
  type Workout,
  type WorkoutAction,
} from "@workout-tracker/types";
import { reducer } from "@workout-tracker/reducer";
import { useNotification, useTimer } from "@workout-tracker/hooks";
import {
  formatDate,
  linkClickHandler,
  secondsSince,
  timeFormat,
} from "@workout-tracker/utils";
import { AddItemForm } from "./add-item-form";
import { Badge } from "./badge";
import { Button } from "./button";
import { cn, focusRing } from "./tone";
import { Dialog } from "./dialog";
import { EmptyMessage } from "./empty-message";
import { SectionHeading } from "./section-heading";
import { buildLog, normalizeExercises, tallyWorkout } from "../lib/build-log";
import { ActionBar } from "./action-bar";
import { ExerciseItem } from "./exercise-item";
import { UndoNotice } from "./undo-notice";
import { WorkoutSummary } from "./workout-summary";

export interface WorkoutScreenProps {
  workout: Workout;
  /** `view` shows a finished log without any editing controls. */
  mode?: "new" | "view";
  /** In view mode: the link that starts a new workout from this log. */
  reuseHref?: string;
  /** Epoch ms the workout clock started: an unfinished run being picked back up. */
  startedAt?: number;
  /** Another workout is still in progress; starting this one ends it. */
  replacing?: { name: string; href: string } | null;
  /** Called after every change while the workout runs, so a reload loses nothing. */
  onProgress?: (workout: Workout, startedAt: number) => void;
  /** The person threw this run away. */
  onDiscard?: () => void;
  /** Saves the history entry; resolves to its key so the summary can open. */
  onFinish?: (log: LogEntry) => Promise<number | void>;
  onSaveTemplate?: (exercises: Workout["exercises"]) => Promise<void>;
  /** View mode, opened straight after finishing: celebrate, then "Done". */
  finished?: boolean;
  /** The previous run of this workout, for "vs last time". */
  previous?: Workout | null;
  /** View mode: an exercise was rated after the fact; save the entry. */
  onRated?: (workout: Workout) => Promise<void>;
  /** Client-side navigation supplied by the host. */
  navigate?: (to: string) => void;
}

type Undo = { message: string; previous: Workout };

/** Taps on the main button closer together than this are one tap. */
const STAGE_TAP_GUARD_MS = 600;

/** A workout being run (`new`) or reviewed (`view`). Persistence is the caller's. */
export function WorkoutScreen({
  workout: initial,
  mode = "new",
  reuseHref,
  startedAt: resumedAt,
  replacing,
  onProgress,
  onDiscard,
  onFinish,
  onSaveTemplate,
  finished = false,
  previous,
  onRated,
  navigate,
}: WorkoutScreenProps) {
  const isView = mode === "view";
  const [workout, rawDispatch] = useReducer(reducer, initial);
  const timer = useTimer(
    "mainTimer",
    resumedAt ? secondsSince(resumedAt) : initial.duration,
  );
  const startedAt = useRef(resumedAt ?? 0);
  const lastStageTap = useRef(0);
  const { requestNotificationPermission, hasAskedPermission } =
    useNotification();
  const [dialog, setDialog] = useState<"finish" | "discard" | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [undo, setUndo] = useState<Undo | null>(null);
  const [alertsDismissed, setAlertsDismissed] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  // Mid-workout, reordering and removing hide behind "Edit" so they can't be hit by accident.
  const [editing, setEditing] = useState(false);

  // The tab names the workout, so a lifter switching apps finds it again.
  useEffect(() => {
    const previous = document.title;
    document.title = `${workout.name} · Workout Tracker`;
    return () => {
      document.title = previous;
    };
  }, [workout.name]);

  // A rating given on the summary is saved straight into the history entry.
  const onRatedRef = useRef(onRated);
  onRatedRef.current = onRated;
  useEffect(() => {
    if (isView && workout !== initial) void onRatedRef.current?.(workout);
  }, [workout, initial, isView]);

  // A resumed workout picks its clock straight back up.
  useEffect(() => {
    if (resumedAt && !initial.isComplete) timer.play();
    // Mount only: the timer object changes every render.
  }, []);

  // Every change while running is written through, so nothing depends on the tab surviving.
  // Read through a ref: the callback is usually inline, and the clock re-renders every second.
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  useEffect(() => {
    if (!isView && timer.isRunning && !workout.isComplete) {
      onProgressRef.current?.(workout, startedAt.current);
    }
  }, [workout, timer.isRunning, isView]);

  const readOnly = isView || workout.isComplete;
  const activeExercise = workout.exercises.find(
    (e) => e.id === workout.activeExerciseId,
  );
  const activeSet = activeExercise?.sets.find(
    (s) => s.id === workout.activeSetId,
  );
  const activeSetNumber = activeExercise
    ? activeExercise.sets.findIndex((s) => s.id === workout.activeSetId) + 1
    : 0;
  const firstWithSets = workout.exercises.find((e) => e.sets.length > 0);

  // Removes happen at once and can be taken back; everything else goes straight through.
  const dispatch = useCallback(
    (action: WorkoutAction) => {
      if (action.type === "REMOVE_EXERCISE" || action.type === "REMOVE_SET") {
        const exercise = workout.exercises.find(
          (e) => e.id === action.payload.exerciseId,
        );
        setUndo({
          previous: workout,
          message:
            action.type === "REMOVE_EXERCISE"
              ? `Removed ${exercise?.name ?? "exercise"}`
              : `Removed a set from ${exercise?.name ?? "the exercise"}`,
        });
      }
      rawDispatch(action);
    },
    [workout],
  );
  const dismissUndo = useCallback(() => setUndo(null), []);

  // Screen readers hear each step of the set the main button is driving.
  useEffect(() => {
    if (!activeSet || !activeExercise || !timer.isRunning) return;
    const where = `${activeExercise.name}, set ${activeSetNumber}`;
    const what = {
      [SetStage.Idle]: "up next",
      [SetStage.Active]: "lifting",
      [SetStage.Resting]: "resting",
      [SetStage.Complete]: "done",
    }[activeSet.stage];
    setAnnouncement(`${where}: ${what}`);
  }, [activeSet?.id, activeSet?.stage, timer.isRunning]);

  const startWorkout = () => {
    if (!firstWithSets) return;
    startedAt.current = Date.now();
    timer.play();
    rawDispatch({
      type: "UPDATE_ACTIVE_SET",
      payload: {
        exerciseId: firstWithSets.id,
        setId: firstWithSets.sets[0].id,
      },
    });
    rawDispatch({ type: "UPDATE_SET_STAGE", payload: { now: Date.now() } });
  };

  const finish = async () => {
    setIsFinishing(true);
    setFinishError(null);
    try {
      const key = await onFinish?.(buildLog(workout, timer.value));
      timer.pause();
      rawDispatch({ type: "COMPLETE_WORKOUT" });
      setDialog(null);
      if (typeof key === "number") navigate?.(`/workouts/${key}?finished=true`);
    } catch {
      // The run stays exactly as it was; nothing is lost by trying again.
      setFinishError(
        "Couldn't save to your history. Your workout is still here; try again.",
      );
    } finally {
      setIsFinishing(false);
    }
  };

  const discard = () => {
    timer.pause();
    onDiscard?.();
    setDialog(null);
    navigate?.("/");
  };

  const saveTemplate = async () => {
    if (!onSaveTemplate) return;
    try {
      await onSaveTemplate(normalizeExercises(workout));
      setTemplateStatus("Saved. Next time starts from this plan.");
    } catch {
      setTemplateStatus("Couldn't save the plan. Try again.");
    }
  };

  // The main button names the set it moves on and what happens next, so a glance
  // between sets is enough; the active card's ring says which exercise.
  const stageButton = () => {
    if (!activeSet || !activeExercise) return null;
    const n = activeSetNumber;
    const stages = {
      [SetStage.Idle]: {
        label: `Start set ${n}`,
        aria: `Start ${activeExercise.name} set ${n}`,
        icon: <Play size={20} />,
      },
      [SetStage.Active]: {
        label: "Set done",
        aria: `${activeExercise.name} set ${n} done, start rest`,
        icon: <Timer size={20} />,
      },
      [SetStage.Resting]: {
        label: "End rest",
        aria: `End rest after ${activeExercise.name} set ${n}`,
        icon: <SkipForward size={20} />,
      },
      [SetStage.Complete]: {
        label: `Redo set ${n}`,
        aria: `Redo ${activeExercise.name} set ${n}`,
        icon: <RotateCcw size={20} />,
      },
    };
    const { label, aria, icon } = stages[activeSet.stage];
    return (
      <Button
        tone={activeSet.stage === SetStage.Complete ? "neutral" : "primary"}
        variant={activeSet.stage === SetStage.Complete ? "ghost" : "solid"}
        icon={icon}
        aria-label={aria}
        className="min-w-0 py-1.5 text-left"
        onClick={() => {
          // The button changes meaning where the thumb already is; a sweaty
          // double tap must not turn "Set done" into "End rest" as well.
          const now = Date.now();
          if (now - lastStageTap.current < STAGE_TAP_GUARD_MS) return;
          lastStageTap.current = now;
          rawDispatch({ type: "UPDATE_SET_STAGE", payload: { now } });
        }}
      >
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="max-w-[9rem] truncate text-xs font-normal opacity-85">
            {activeExercise.name}
          </span>
          <span>{label}</span>
        </span>
      </Button>
    );
  };

  const actions = () => {
    if (isView) {
      const again = reuseHref && (
        <Button
          icon={<Play size={20} />}
          tone={finished ? "neutral" : "primary"}
          variant={finished ? "ghost" : "solid"}
          onClick={(event) => {
            const handler = linkClickHandler(reuseHref, navigate);
            if (handler) handler(event);
            else window.location.assign(reuseHref);
          }}
        >
          Do this again
        </Button>
      );
      // Straight after finishing, the natural next step is leaving.
      return finished ? (
        <>
          {again}
          <Button
            tone="success"
            icon={<Check size={20} />}
            onClick={() => {
              if (navigate) navigate("/");
              else window.location.assign("/");
            }}
          >
            Done
          </Button>
        </>
      ) : (
        again || null
      );
    }
    if (workout.isComplete) return null;
    if (timer.isRunning) {
      return (
        <>
          {/* Always reachable, so stopping early never means abandoning the run;
              the main action once every set is done. */}
          <Button
            variant={activeSet ? "ghost" : "solid"}
            tone={activeSet ? "neutral" : "success"}
            icon={<Flag size={20} />}
            onClick={() => setDialog("finish")}
          >
            {activeSet ? "Finish" : "Finish workout"}
          </Button>
          {stageButton()}
        </>
      );
    }
    if (firstWithSets) {
      return (
        <Button tone="primary" icon={<Play size={20} />} onClick={startWorkout}>
          Start workout
        </Button>
      );
    }
    return null;
  };

  const tally = tallyWorkout(workout);
  const backHref = "/";
  return (
    <section
      data-testid={isView ? "workout-view" : "workout-new"}
      className="flex flex-1 flex-col w-full max-w-2xl mx-auto"
    >
      <header className="flex items-center gap-2 px-4 pt-6">
        <a
          href={backHref}
          onClick={linkClickHandler(backHref, navigate)}
          aria-label="Back"
          className={cn(
            "tone-neutral -ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-control text-tone-700 hover:bg-tone-50 active:bg-tone-100",
            focusRing,
          )}
        >
          <ChevronLeft size={24} />
        </a>
        <SectionHeading level={1} flush className="min-w-0 flex-1 break-words">
          {workout.name}
        </SectionHeading>
        {!isView && timer.isRunning && !workout.isComplete && (
          <Button
            variant="ghost"
            aria-pressed={editing}
            icon={editing ? <Check size={20} /> : <Pencil size={20} />}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Done editing" : "Edit"}
          </Button>
        )}
        {!isView &&
          !timer.isRunning &&
          !workout.isComplete &&
          onSaveTemplate && (
            <Button
              variant="ghost"
              icon={<Save size={20} />}
              onClick={saveTemplate}
            >
              Save plan
            </Button>
          )}
      </header>
      {templateStatus && (
        <p role="status" className="px-4 pt-2 text-sm text-indigo-700">
          {templateStatus}
        </p>
      )}
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {/* The shell owns the page's <main>; this is the screen's body. */}
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-inset p-4">
        {isView && (
          <WorkoutSummary
            workout={workout}
            previous={previous}
            finished={finished}
          />
        )}
        {replacing && !timer.isRunning && !isView && (
          <p className="rounded-card border border-amber-200 bg-amber-50 p-inset text-base text-amber-900">
            {replacing.name} is still in progress. Starting this workout ends it
            without saving.{" "}
            <a
              href={replacing.href}
              onClick={linkClickHandler(replacing.href, navigate)}
              className="font-semibold underline underline-offset-2"
            >
              Resume {replacing.name}
            </a>
          </p>
        )}
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
                  canRate={isView && !!onRated}
                  running={timer.isRunning}
                  editing={editing}
                  dispatch={dispatch}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyMessage className="text-base px-4">
            {isView
              ? "No sets were logged in this session."
              : "No exercises yet. Add the first one below."}
          </EmptyMessage>
        )}
        {!readOnly && (!timer.isRunning || editing) && (
          <AddItemForm
            label="Add exercise"
            placeholder="Exercise name"
            className="m-0"
            onSubmit={(name) =>
              dispatch({ type: "ADD_EXERCISE", payload: { name } })
            }
          />
        )}
      </div>
      <ActionBar
        notice={
          // Asked at the first rest, when "tell me when rest ends" is obviously useful.
          !undo &&
          activeSet?.stage === SetStage.Resting &&
          !hasAskedPermission &&
          !alertsDismissed ? (
            <div className="tone-neutral flex items-center gap-2 border-b border-indigo-100 bg-indigo-50 py-1 pr-1 pl-4 text-base text-indigo-800">
              <BellRing size={20} className="shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1">Alert me when rest ends?</span>
              <Button variant="ghost" onClick={() => setAlertsDismissed(true)}>
                No
              </Button>
              <Button
                variant="ghost"
                className="font-semibold"
                onClick={requestNotificationPermission}
              >
                Turn on
              </Button>
            </div>
          ) : (
            undo && (
              <UndoNotice
                message={undo.message}
                onDismiss={dismissUndo}
                onUndo={() => {
                  rawDispatch({ type: "SET_WORKOUT", payload: undo.previous });
                  setUndo(null);
                }}
              />
            )
          )
        }
      >
        {/* A clock at 0:00 with nothing to start reads as broken; it appears once there's a workout to time. */}
        {/* In review the summary already shows time and date; the bar keeps the actions. */}
        {!isView &&
          (timer.isRunning || workout.isComplete || firstWithSets) && (
            <Badge
              tone={workout.isComplete || isView ? "success" : "neutral"}
              icon={<Timer size={20} />}
              // The date matters when looking back, not while lifting.
              caption={
                isView || workout.isComplete
                  ? formatDate(workout.date ?? new Date())
                  : undefined
              }
              className="mr-auto"
            >
              <time dateTime={`PT${timer.value}S`}>
                {timeFormat(timer.value)}
              </time>
            </Badge>
          )}
        {actions()}
      </ActionBar>
      <Dialog
        open={dialog === "finish"}
        title="Finish workout?"
        onClose={() => setDialog(null)}
        actions={
          <>
            <Button
              variant="ghost"
              tone="danger"
              className="mr-auto"
              onClick={() => setDialog("discard")}
            >
              Discard
            </Button>
            <Button
              variant="ghost"
              data-autofocus={tally.logged === 0 || undefined}
              onClick={() => setDialog(null)}
            >
              Keep going
            </Button>
            {/* An empty session isn't history: with nothing logged, the way out is Discard. */}
            <Button
              tone="success"
              data-autofocus={tally.logged > 0 || undefined}
              disabled={isFinishing || tally.logged === 0}
              onClick={finish}
            >
              {isFinishing ? "Saving…" : "Finish"}
            </Button>
          </>
        }
      >
        <p>
          {tally.logged === 0
            ? "No sets logged yet. Finish a set to save this workout, or discard it."
            : `${timeFormat(timer.value)} · ${tally.logged} ${tally.logged === 1 ? "set" : "sets"} logged`}
        </p>
        {tally.logged > 0 && tally.unlogged > 0 && (
          <p className="mt-1">
            {tally.unlogged}{" "}
            {tally.unlogged === 1 ? "set wasn't" : "sets weren't"} done and
            won't be saved to your history.
          </p>
        )}
        {finishError && (
          <p role="alert" className="mt-2 font-medium text-red-700">
            {finishError}
          </p>
        )}
      </Dialog>
      <Dialog
        open={dialog === "discard"}
        title="Discard this workout?"
        onClose={() => setDialog("finish")}
        actions={
          <>
            <Button
              variant="ghost"
              data-autofocus
              onClick={() => setDialog("finish")}
            >
              Keep it
            </Button>
            <Button tone="danger" onClick={discard}>
              Discard workout
            </Button>
          </>
        }
      >
        Nothing from this session will be saved. This can't be undone.
      </Dialog>
    </section>
  );
}
