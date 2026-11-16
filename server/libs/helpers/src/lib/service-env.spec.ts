import { validateEnv } from "./service-env";

describe("validateEnv", () => {
  const MONGODB_URI = "mongodb://localhost:27017/users";
  const GRPC_URL = "127.0.0.1:50051";
  const APP_ENV = "development";
  const required = { APP_ENV, MONGODB_URI, GRPC_URL };

  it("applies defaults when only the required vars are set", () => {
    expect(validateEnv(required)).toEqual({
      APP_ENV,
      MONGODB_URI,
      MONGODB_MAX_POOL_SIZE: 10,
      GRPC_URL,
    });
  });

  it.each([
    ["missing", undefined],
    ["unknown", "prod"],
  ])("rejects an APP_ENV that is %s", (_, appEnv) => {
    expect(() => validateEnv({ ...required, APP_ENV: appEnv })).toThrow(
      /APP_ENV: must be development, staging or production/,
    );
  });

  it("coerces MONGODB_MAX_POOL_SIZE from a string", () => {
    expect(
      validateEnv({ ...required, MONGODB_MAX_POOL_SIZE: "25" })
        .MONGODB_MAX_POOL_SIZE,
    ).toBe(25);
  });

  it("accepts mongodb+srv URIs", () => {
    const uri = "mongodb+srv://cluster.example.net/users";
    expect(validateEnv({ ...required, MONGODB_URI: uri }).MONGODB_URI).toBe(
      uri,
    );
  });

  it("rejects a missing MONGODB_URI", () => {
    expect(() => validateEnv({ ...required, MONGODB_URI: undefined })).toThrow(
      /Invalid environment:[\s\S]*MONGODB_URI/,
    );
  });

  it("rejects a non-MongoDB URI", () => {
    expect(() =>
      validateEnv({ ...required, MONGODB_URI: "postgres://x" }),
    ).toThrow("must be a MongoDB connection string");
  });

  describe("GRPC_URL", () => {
    it("listens on every interface at PORT when GRPC_URL is unset", () => {
      expect(
        validateEnv({ ...required, GRPC_URL: undefined, PORT: "8080" })
          .GRPC_URL,
      ).toBe("0.0.0.0:8080");
    });

    it("prefers an explicit GRPC_URL over PORT", () => {
      expect(validateEnv({ ...required, PORT: "8080" }).GRPC_URL).toBe(
        GRPC_URL,
      );
    });

    it("rejects neither GRPC_URL nor PORT being set", () => {
      expect(() => validateEnv({ ...required, GRPC_URL: undefined })).toThrow(
        /GRPC_URL: must be a host:port to listen on, or set PORT/,
      );
    });

    it("rejects an empty GRPC_URL", () => {
      expect(() => validateEnv({ ...required, GRPC_URL: "  " })).toThrow(
        /GRPC_URL/,
      );
    });

    it.each(["0", "70000", "abc"])("rejects PORT=%s", (port) => {
      expect(() =>
        validateEnv({ ...required, GRPC_URL: undefined, PORT: port }),
      ).toThrow(/PORT/);
    });
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
