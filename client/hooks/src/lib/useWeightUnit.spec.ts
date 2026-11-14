import { defaultWeightUnit, weightStepFor } from "./useWeightUnit";

describe("defaultWeightUnit", () => {
  it("uses pounds in the US", () => {
    expect(defaultWeightUnit("en-US")).toBe("lb");
  });

  it("uses kilograms elsewhere, and for a bare language", () => {
    expect(defaultWeightUnit("pt-BR")).toBe("kg");
    expect(defaultWeightUnit("en")).toBe("kg");
  });
});

describe("weightStepFor", () => {
  it("steps by the smallest common plate pair", () => {
    expect(weightStepFor("kg")).toBe(2.5);
    expect(weightStepFor("lb")).toBe(5);
  });
});
