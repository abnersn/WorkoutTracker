import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface UseTimerResult {
  play: () => void;
  pause: () => void;
  value: number;
  isRunning: boolean;
  set: Dispatch<SetStateAction<number>>;
}

/** Applies a delta to the timer, never letting it drop below zero. */
export function advanceTimer(value: number, delta: number): number {
  return Math.max(value + delta, 0);
}

/** Whole ticks of `increment` seconds that fit in the time between `startedAt` and `now` (ms). */
export function elapsedTicks(
  startedAt: number,
  now: number,
  increment: number,
): number {
  return Math.floor((now - startedAt) / 1000) * increment;
}

export function isPageHidden(): boolean {
  return document.visibilityState !== "visible";
}

// sessionStorage can throw in private windows or with blocked site data.
// The timer still works without it; it just cannot account for time spent in the background.
function readStartedAt(key: string): number | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

function writeStartedAt(key: string, now: number): void {
  try {
    window.sessionStorage.setItem(key, String(now));
  } catch {
    // Ignored: see readStartedAt.
  }
}

function clearStartedAt(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignored: see readStartedAt.
  }
}

/**
 * A ticking timer that moves by `increment` seconds every second while running.
 * It pauses while the page is hidden and, on return, catches up on the time that passed.
 */
export function useTimer(
  timerId = "timer",
  initialTimer = 0,
  increment = 1,
): UseTimerResult {
  const [value, setValue] = useState(initialTimer);
  const [isRunning, setIsRunning] = useState(false);
  const [isBackground, setIsBackground] = useState(isPageHidden);

  const play = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  useEffect(() => {
    if (!isRunning || isBackground) {
      return;
    }
    const interval = setInterval(() => {
      setValue((t) => advanceTimer(t, increment));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBackground, increment]);

  useEffect(() => {
    const onVisibilityChange = () => setIsBackground(isPageHidden());
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (isBackground) {
      writeStartedAt(timerId, Date.now());
      return;
    }
    const startedAt = readStartedAt(timerId);
    clearStartedAt(timerId);
    if (isRunning && startedAt) {
      setValue((t) =>
        advanceTimer(t, elapsedTicks(startedAt, Date.now(), increment)),
      );
    }
    // Only react to visibility changes; the other values are read as they were at that moment.
  }, [isBackground]);

  return { play, pause, value, isRunning, set: setValue };
}
