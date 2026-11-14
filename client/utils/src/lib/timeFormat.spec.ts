import { timeFormat } from "./timeFormat";

describe("timeFormat", () => {
  it("formats seconds as a clock", () => {
    expect(timeFormat(39)).toBe("0:39");
    expect(timeFormat(0)).toBe("0:00");
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
