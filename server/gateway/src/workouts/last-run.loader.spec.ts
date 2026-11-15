import type { LastRun } from "@workout-tracker/proto";
import { LastRunLoaders, MAX_LAST_RUNS_BATCH } from "./last-run.loader";
import type { WorkoutsClient } from "./workouts.client";

const USER_ID = "64b000000000000000000001";
const ran = { seconds: 1_767_225_600, nanos: 0 };

describe("LastRunLoaders", () => {
  let getLastRuns: jest.Mock<Promise<LastRun[]>, [string[], string]>;
  let loaders: LastRunLoaders;

  beforeEach(() => {
    getLastRuns = jest.fn(async (ids: string[], _userId: string) =>
      ids
        .filter((id) => id !== "never")
        .map((workoutId) => ({
          workoutId,
          lastRunAt: ran,
        })),
    );
    loaders = new LastRunLoaders({ getLastRuns } as unknown as WorkoutsClient);
  });

  it("answers one request's loads with one call", async () => {
    const loader = loaders.for({}, USER_ID);
    const dates = await Promise.all(
      ["a", "never", "b", "a"].map((id) => loader.load(id)),
    );
    expect(getLastRuns).toHaveBeenCalledTimes(1);
    expect(getLastRuns).toHaveBeenCalledWith(["a", "never", "b"], USER_ID);
    expect(dates).toEqual([
      new Date("2026-01-01T00:00:00Z"),
      null,
      new Date("2026-01-01T00:00:00Z"),
      new Date("2026-01-01T00:00:00Z"),
    ]);
  });

  it("splits batches at the service's limit", async () => {
    const loader = loaders.for({}, USER_ID);
    const ids = Array.from(
      { length: MAX_LAST_RUNS_BATCH + 1 },
      (_, i) => `w${i}`,
    );
    await loader.loadMany(ids);
    expect(getLastRuns).toHaveBeenCalledTimes(2);
    expect(getLastRuns.mock.calls[0][0]).toHaveLength(MAX_LAST_RUNS_BATCH);
  });

  it("reuses the loader within a request and not across requests", async () => {
    const request = {};
    expect(loaders.for(request, USER_ID)).toBe(loaders.for(request, USER_ID));
    await loaders.for(request, USER_ID).load("a");
    await loaders.for({}, "64b000000000000000000002").load("a");
    expect(getLastRuns).toHaveBeenNthCalledWith(
      2,
      ["a"],
      "64b000000000000000000002",
    );
  });

  it("rejects every load in a batch that failed", async () => {
    const failure = Object.assign(new Error("14 UNAVAILABLE"), { code: 14 });
    getLastRuns.mockRejectedValue(failure);
    const loader = loaders.for({}, USER_ID);
    await expect(
      Promise.all([loader.load("a"), loader.load("b")]),
    ).rejects.toBe(failure);
  });
});
