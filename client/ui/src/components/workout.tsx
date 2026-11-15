import { useState } from "react";
import {
  useLoggedWorkout,
  useWorkoutActions,
  useWorkoutRun,
  type DataError,
} from "@workout-tracker/hooks";
import {
  clearActiveSession,
  isSessionFor,
  loadActiveSession,
  saveActiveSession,
  secondsSince,
  sessionHref,
  type ActiveSession,
} from "@workout-tracker/utils";
import { buildLog, tallyWorkout } from "../lib/build-log";
import { WorkoutScreenSkeleton } from "./skeleton";
import { StatusMessage } from "./status-message";
import { WorkoutScreen } from "./workout-screen";

export interface WorkoutProps {
  /** Saved workout id (new), or a log id when `fromLogs`/`mode="view"`. */
  id: string;
  mode?: "new" | "view";
  /** In new mode: `id` is a history entry to repeat rather than a saved workout. */
  fromLogs?: boolean;
  /** View mode, straight after finishing. */
  finished?: boolean;
  navigate?: (to: string) => void;
}

/** Loads a workout and shows it. Used by workout-new and workout-view. */
export function Workout({
  id,
  mode = "new",
  fromLogs = false,
  finished = false,
  navigate,
}: WorkoutProps): React.JSX.Element {
  const isView = mode === "view";
  // Read once on mount. An unfinished run of this workout is picked back up;
  // a different one is offered back instead of silently replaced.
  const [session] = useState(() => (isView ? null : loadActiveSession()));
  const resumed = isSessionFor(session, id, fromLogs) ? session : null;
  const otherSession: ActiveSession | null = resumed ? null : session;

  const run = useWorkoutRun(id, {
    fromLogs,
    skip: isView || resumed !== null,
  });
  const logged = useLoggedWorkout(id, { skip: !isView });
  const { finishWorkout, rateWorkout, saveTemplate } = useWorkoutActions();

  const workout = resumed?.workout ?? (isView ? logged.workout : run.workout);
  const error = isView ? logged.error : run.error;

  // Saves the run this one replaces to the history, as if it had been
  // finished when it was last touched.
  const saveOtherSession = async (): Promise<void> => {
    if (!otherSession) {
      return;
    }
    const { workout: other, startedAt, updatedAt = Date.now() } = otherSession;
    await finishWorkout(
      buildLog(other, secondsSince(startedAt, updatedAt), new Date(updatedAt)),
    );
    clearActiveSession();
  };

  if (!id) {
    return (
      <StatusMessage
        title="No workout chosen"
        navigate={navigate}
        action={{ label: "Choose a workout", href: "/" }}
      >
        Pick a saved workout, or repeat one from your history.
      </StatusMessage>
    );
  }
  if (error) {
    return (
      <StatusMessage
        title={
          error.kind === "not-found"
            ? "Workout not found"
            : "Your workouts couldn't be opened"
        }
        navigate={navigate}
        action={{ label: "Back to workouts", href: "/" }}
      >
        {notFoundMessage(error, isView)}
      </StatusMessage>
    );
  }
  if (!workout) {
    return <WorkoutScreenSkeleton label="Loading workout" />;
  }

  return (
    <WorkoutScreen
      // A different workout must start from clean timers and reducer state.
      key={`${mode}:${id}:${fromLogs}`}
      workout={workout}
      mode={mode}
      navigate={navigate}
      startedAt={resumed?.startedAt}
      replacing={
        otherSession && {
          name: otherSession.workout.name,
          href: sessionHref(otherSession),
          logged: tallyWorkout(otherSession.workout).logged,
        }
      }
      onSaveReplaced={saveOtherSession}
      reuseHref={`/workouts/new?id=${id}&fromLogs=true`}
      finished={finished}
      previous={logged.previous}
      onRated={(rated) => rateWorkout(id, rated)}
      onProgress={(progress, startedAt) =>
        saveActiveSession({
          sourceId: id,
          fromLogs,
          startedAt,
          updatedAt: Date.now(),
          workout: progress,
        })
      }
      onDiscard={clearActiveSession}
      onFinish={async (log) => {
        const logId = await finishWorkout(log);
        clearActiveSession();
        return logId;
      }}
      onSaveTemplate={(exercises) => saveTemplate(workout.id, exercises)}
    />
  );
}

function notFoundMessage(error: DataError, isView: boolean): string {
  if (error.kind === "unavailable") {
    return error.message;
  }
  return isView
    ? "This workout isn't in your history any more. It may have been deleted."
    : "This workout couldn't be found. It may have been deleted.";
}
