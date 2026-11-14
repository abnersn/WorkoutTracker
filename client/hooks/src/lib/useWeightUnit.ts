import { useCallback, useEffect, useState } from "react";

export type WeightUnit = "kg" | "lb";

const KEY = "workoutTracker.weightUnit";
const EVENT = "workoutTracker:weightUnit";

/** Pounds where they're the norm (US, Liberia, Myanmar), kilograms elsewhere. */
export function defaultWeightUnit(locale?: string): WeightUnit {
  const region = (locale ?? navigator.language).split("-")[1]?.toUpperCase();
  return region === "US" || region === "LR" || region === "MM" ? "lb" : "kg";
}

function readUnit(): WeightUnit {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "kg" || stored === "lb") return stored;
  } catch {
    // Storage blocked: fall through to the locale's unit.
  }
  return defaultWeightUnit();
}

/** The smallest plate jump people actually load: 2.5 kg or 5 lb. */
export function weightStepFor(unit: WeightUnit): number {
  return unit === "kg" ? 2.5 : 5;
}

/**
 * The lifter's weight unit, shared by every remote on the page (they share an
 * origin, so one localStorage key) and kept in sync when it changes.
 */
export function useWeightUnit(): [WeightUnit, (unit: WeightUnit) => void] {
  const [unit, setUnitState] = useState<WeightUnit>(readUnit);

  useEffect(() => {
    const sync = () => setUnitState(readUnit());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setUnit = useCallback((next: WeightUnit) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Not remembered, but still applied for this page.
    }
    setUnitState(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [unit, setUnit];
}
