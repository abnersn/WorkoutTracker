import { validateEnv } from "./env";

describe("validateEnv", () => {
  const MONGODB_URI = "mongodb://localhost:27017/users";

  it("applies defaults when only MONGODB_URI is set", () => {
    expect(validateEnv({ MONGODB_URI })).toEqual({
      MONGODB_URI,
      MONGODB_MAX_POOL_SIZE: 10,
      GRPC_URL: "0.0.0.0:50052",
    });
  });

  it("coerces MONGODB_MAX_POOL_SIZE from a string", () => {
    expect(
      validateEnv({ MONGODB_URI, MONGODB_MAX_POOL_SIZE: "25" })
        .MONGODB_MAX_POOL_SIZE,
    ).toBe(25);
  });

  it("accepts mongodb+srv URIs", () => {
    const uri = "mongodb+srv://cluster.example.net/users";
    expect(validateEnv({ MONGODB_URI: uri }).MONGODB_URI).toBe(uri);
  });

  it("rejects a missing MONGODB_URI", () => {
    expect(() => validateEnv({})).toThrow(/Invalid environment:[\s\S]*MONGODB_URI/);
  });

  it("rejects a non-MongoDB URI", () => {
    expect(() => validateEnv({ MONGODB_URI: "postgres://x" })).toThrow(
      "must be a MongoDB connection string",
    );
  });

  it.each(["0", "-1", "1.5", "abc"])(
    "rejects MONGODB_MAX_POOL_SIZE=%s",
    (size) => {
      expect(() =>
        validateEnv({ MONGODB_URI, MONGODB_MAX_POOL_SIZE: size }),
      ).toThrow(/MONGODB_MAX_POOL_SIZE/);
    },
  );
});
