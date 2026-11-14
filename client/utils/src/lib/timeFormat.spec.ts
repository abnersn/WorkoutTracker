import { timeFormat } from "./timeFormat";

describe("timeFormat", () => {
  it("formats seconds", () => {
    expect(timeFormat(39)).toBe("39");
  });

  it("formats minutes", () => {
    expect(timeFormat(98)).toBe("1:38");
  });

  it("formats hours", () => {
    expect(timeFormat(3722)).toBe("1:02:02");
  });

  it("formats negative times", () => {
    expect(timeFormat(-3722)).toBe("-1:02:02");
  });
});
