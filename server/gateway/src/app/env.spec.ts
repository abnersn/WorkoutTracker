import { validateEnv } from "./env";

const secret = "x".repeat(32);

describe("validateEnv", () => {
  it("applies defaults", () => {
    expect(
      validateEnv({ JWT_SECRET: secret, INTERNAL_SECRET: secret }),
    ).toEqual({
      PORT: 3000,
      JWT_SECRET: secret,
      USERS_GRPC_URL: "localhost:50052",
      WORKOUTS_GRPC_URL: "localhost:50051",
      INTERNAL_SECRET: secret,
    });
  });

  it("coerces PORT from a string", () => {
    expect(
      validateEnv({
        JWT_SECRET: secret,
        PORT: "4000",
        INTERNAL_SECRET: secret,
      }).PORT,
    ).toBe(4000);
  });

  it("rejects a short JWT_SECRET", () => {
    expect(() =>
      validateEnv({ JWT_SECRET: "short", INTERNAL_SECRET: secret }),
    ).toThrow(/JWT_SECRET: must be at least 32 characters/);
  });

  it("rejects a missing JWT_SECRET", () => {
    expect(() =>
      validateEnv({
        INTERNAL_SECRET: secret,
      }),
    ).toThrow(/Invalid environment/);
  });

  it("rejects a missing INTERNAL_SECRET", () => {
    expect(() =>
      validateEnv({
        JWT_SECRET: secret,
      }),
    ).toThrow(/Invalid environment/);
  });
});
