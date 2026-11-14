/**
 * Weights are stored in kilograms, always. The lifter's unit only changes how a
 * weight is shown and typed, never what is saved.
 */
export type WeightUnit = "kg" | "lb";

export const LB_PER_KG = 2.20462;

function round(value: number, decimals: number): number {
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

/** Pounds where they're the norm (US, Liberia, Myanmar), kilograms elsewhere. */
export function defaultWeightUnit(locale?: string): WeightUnit {
  const region = (locale ?? navigator.language).split("-")[1]?.toUpperCase();
  return region === "US" || region === "LR" || region === "MM" ? "lb" : "kg";
}

/**
 * A stored kilogram weight as shown in `unit`. Rounded for reading: lb to 0.1,
 * kg to 0.01. The stored value itself is never rounded here.
 */
export function toDisplayWeight(kg: number, unit: WeightUnit): number {
  return unit === "kg" ? round(kg, 2) : round(kg * LB_PER_KG, 1);
}

/**
 * A weight typed or stepped in `unit`, converted to kilograms for storage. Kept
 * to 3 decimals so a pound entry reads back as the same pound figure.
 */
export function fromDisplayWeight(value: number, unit: WeightUnit): number {
  return unit === "kg" ? round(value, 3) : round(value / LB_PER_KG, 3);
}
