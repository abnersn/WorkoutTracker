import { cn, toneClass } from "./tone";

describe("cn", () => {
  it("joins truthy parts and skips the rest", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("toneClass", () => {
  it("has a class for every tone", () => {
    expect(Object.keys(toneClass).sort()).toEqual([
      "danger",
      "highlight",
      "neutral",
      "primary",
      "success",
    ]);
  });
});
