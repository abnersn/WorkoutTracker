import type { Workout } from "@workout-tracker/types";

/**
 * The workout being run, kept in localStorage after every change so a refresh,
 * a tab the phone evicted, or a stray Back costs nothing. There is only ever
 * one: starting another workout replaces it.
 */
export interface ActiveSession {
  /** What was opened: the saved workout id, or the history key when `fromLogs`. */
  sourceId: string;
  fromLogs: boolean;
  /** Epoch ms when the workout clock started; elapsed time is derived from it. */
  startedAt: number;
  /** Epoch ms when the resting set began its rest, if one is resting. */
  restStartedAt?: number;
  workout: Workout;
}

const KEY = "workoutTracker.activeSession";

// Storage can throw in private windows or with blocked site data. The workout
// still runs; it just cannot survive a reload.
export function loadActiveSession(): ActiveSession | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as ActiveSession;
    if (!session?.workout || typeof session.startedAt !== "number") {
      return null;
    }
    session.workout.date = new Date(session.workout.date);
    return session;
  } catch {
    return null;
  }
}

export function saveActiveSession(session: ActiveSession): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Ignored: see loadActiveSession.
  }
}

export function clearActiveSession(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Ignored: see loadActiveSession.
  }
}

/** The session belongs to the workout at this route. */
export function isSessionFor(
  session: ActiveSession | null,
  sourceId: string,
  fromLogs: boolean,
): session is ActiveSession {
  return (
    !!session && session.sourceId === sourceId && session.fromLogs === fromLogs
  );
}

/** Whole seconds between `startedAt` and `now`. */
export function secondsSince(startedAt: number, now = Date.now()): number {
  return Math.max(0, Math.floor((now - startedAt) / 1000));
}

/** The route that reopens a session. */
export function sessionHref(session: ActiveSession): string {
  const params = new URLSearchParams({ id: session.sourceId });
  if (session.fromLogs) params.set("fromLogs", "true");
  return `/workouts/new?${params}`;
}

/** Converts the running workout's weights too when the unit switches. */
export function convertActiveSessionWeights(factor: number): void {
  const session = loadActiveSession();
  if (!session) return;
  for (const exercise of session.workout.exercises) {
    for (const set of exercise.sets) {
      if (set.defaultWeight !== undefined) {
        set.defaultWeight = Math.round(set.defaultWeight * factor * 10) / 10;
      }
    }
  }
  saveActiveSession(session);
}
