import { advanceTimer, elapsedTicks } from "./useTimer";

describe("advanceTimer", () => {
  it("adds the delta", () => {
    expect(advanceTimer(10, 1)).toBe(11);
  });

  it("never goes below zero", () => {
    expect(advanceTimer(1, -5)).toBe(0);
  });

  it("runs past zero when the floor allows it", () => {
    expect(advanceTimer(1, -5, -Infinity)).toBe(-4);
  });
});

describe("elapsedTicks", () => {
  it("counts whole seconds since the start", () => {
    expect(elapsedTicks(0, 3999, 1)).toBe(3);
  });

  it("applies the increment sign to a countdown", () => {
    expect(elapsedTicks(0, 3000, -1)).toBe(-3);
  });

  it("is zero when no full second has passed", () => {
    expect(elapsedTicks(1000, 1500, 1)).toBe(0);
  });
});
