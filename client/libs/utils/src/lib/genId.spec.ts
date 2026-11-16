import { genId } from "./genId";

describe("genId", () => {
  it("returns a UUID", () => {
    expect(genId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("returns a new id each call", () => {
    expect(genId()).not.toBe(genId());
  });
});
