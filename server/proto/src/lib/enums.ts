import { SetStage } from "../generated/workouts/v1/workouts";

/** A wire value this build doesn't know, e.g. a newer client or server sent it. */
export class UnrecognizedEnumError extends Error {
  constructor(
    readonly enumName: string,
    readonly value: string,
  ) {
    super(`Unrecognized ${enumName} value: ${value}`);
    this.name = "UnrecognizedEnumError";
  }
}

/** The stages a client SetStage can hold: everything but UNRECOGNIZED. */
export type KnownSetStage = Exclude<SetStage, SetStage.UNRECOGNIZED>;

/**
 * Narrows a SetStage read off the wire to the four the client understands.
 * Throws instead of letting UNRECOGNIZED reach code that would treat it as a stage.
 */
export function requireKnownSetStage(stage: SetStage): KnownSetStage {
  if (stage === SetStage.UNRECOGNIZED) {
    throw new UnrecognizedEnumError("SetStage", stage);
  }
  return stage;
}
