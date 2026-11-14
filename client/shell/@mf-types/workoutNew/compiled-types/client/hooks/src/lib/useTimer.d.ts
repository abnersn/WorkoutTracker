import type { Dispatch, SetStateAction } from "react";
export interface UseTimerResult {
    play: () => void;
    pause: () => void;
    value: number;
    isRunning: boolean;
    set: Dispatch<SetStateAction<number>>;
}
/** Applies a delta to the timer, never letting it drop below zero. */
export declare function advanceTimer(value: number, delta: number): number;
/** Whole ticks of `increment` seconds that fit in the time between `startedAt` and `now` (ms). */
export declare function elapsedTicks(startedAt: number, now: number, increment: number): number;
export declare function isPageHidden(): boolean;
/**
 * A ticking timer that moves by `increment` seconds every second while running.
 * It pauses while the page is hidden and, on return, catches up on the time that passed.
 */
export declare function useTimer(timerId?: string, initialTimer?: number, increment?: number): UseTimerResult;
