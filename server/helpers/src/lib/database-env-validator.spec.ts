import { validateEnv } from "./database-env-validator";

describe("validateEnv", () => {
  const MONGODB_URI = "mongodb://localhost:27017/users";
  const GRPC_URL = "0.0.0.0:50051";
  const required = { MONGODB_URI, GRPC_URL };

  it("applies defaults when only the required vars are set", () => {
    expect(validateEnv(required)).toEqual({
      MONGODB_URI,
      MONGODB_MAX_POOL_SIZE: 10,
      GRPC_URL,
    });
  });

  it("coerces MONGODB_MAX_POOL_SIZE from a string", () => {
    expect(
      validateEnv({ ...required, MONGODB_MAX_POOL_SIZE: "25" })
        .MONGODB_MAX_POOL_SIZE,
    ).toBe(25);
  });

  it("accepts mongodb+srv URIs", () => {
    const uri = "mongodb+srv://cluster.example.net/users";
    expect(validateEnv({ ...required, MONGODB_URI: uri }).MONGODB_URI).toBe(uri);
  });

  it("rejects a missing MONGODB_URI", () => {
    expect(() => validateEnv({ GRPC_URL })).toThrow(
      /Invalid environment:[\s\S]*MONGODB_URI/,
    );
  });

  it("rejects a non-MongoDB URI", () => {
    expect(() =>
      validateEnv({ ...required, MONGODB_URI: "postgres://x" }),
    ).toThrow(
      "must be a MongoDB connection string",
    );
  });

  it.each([
    ["missing", {}],
    ["empty", { GRPC_URL: "  " }],
  ])("rejects a %s GRPC_URL", (_, env) => {
    expect(() => validateEnv({ MONGODB_URI, ...env })).toThrow(/GRPC_URL/);
  });

  it.each(["0", "-1", "1.5", "abc"])(
    "rejects MONGODB_MAX_POOL_SIZE=%s",
    (size) => {
      expect(() =>
        validateEnv({ ...required, MONGODB_MAX_POOL_SIZE: size }),
      ).toThrow(/MONGODB_MAX_POOL_SIZE/);
    },
  );
});
