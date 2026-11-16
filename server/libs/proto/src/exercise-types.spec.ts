import { SetStage } from "./generated/workouts/v1/workouts";
import { requireKnownSetStage, UnrecognizedEnumError } from "./exercise-types";

describe("requireKnownSetStage", () => {
  it.each([
    SetStage.IDLE,
    SetStage.ACTIVE,
    SetStage.RESTING,
    SetStage.COMPLETE,
  ])("passes %s through", (stage) => {
    expect(requireKnownSetStage(stage)).toBe(stage);
  });

  it("rejects UNRECOGNIZED with a typed error", () => {
    expect(() => requireKnownSetStage(SetStage.UNRECOGNIZED)).toThrow(
      UnrecognizedEnumError,
    );
    expect(() => requireKnownSetStage(SetStage.UNRECOGNIZED)).toThrow(
      "Unrecognized SetStage value: UNRECOGNIZED",
    );
  });
});
