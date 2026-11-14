import { formatDistanceToNow } from "./format";

describe("formatDistanceToNow", () => {
  const now = new Date("2026-11-14T12:00:00Z");

  it("describes days in the past", () => {
    expect(
      formatDistanceToNow(new Date("2026-11-11T12:00:00Z"), now, "en"),
    ).toBe("3 days ago");
  });

  it("falls back to minutes for very recent dates", () => {
    expect(formatDistanceToNow(now, now, "en")).toBe("this minute");
  });
});
