import { SetStage } from "@workout-tracker/types/lib/types";

describe("SetStage", () => {
  it("uses the legacy stage strings", () => {
    expect(Object.values(SetStage)).toEqual([
      "IDLE",
      "ACTIVE",
      "RESTING",
      "COMPLETE",
    ]);
  });
});
