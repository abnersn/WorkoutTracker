import { validateEnv } from "./env";

const secret = "x".repeat(32);
const required = {
  APP_ENV: "development",
  JWT_SECRET: secret,
  USERS_GRPC_URL: "users:50052",
  WORKOUTS_GRPC_URL: "workouts:50051",
  CORS_ORIGINS: "http://localhost:8100",
};

describe("validateEnv", () => {
  it("applies defaults when only the required vars are set", () => {
    expect(validateEnv(required)).toEqual({
      ...required,
      PORT: 3000,
      GRPC_AUTH: "none",
      CORS_ORIGINS: ["http://localhost:8100"],
    });
  });

  it("coerces PORT from a string", () => {
    expect(validateEnv({ ...required, PORT: "4000" }).PORT).toBe(4000);
  });

  it.each(["development", "staging", "production"])(
    "accepts APP_ENV=%s",
    (appEnv) => {
      expect(validateEnv({ ...required, APP_ENV: appEnv }).APP_ENV).toBe(
        appEnv,
      );
    },
  );

  it.each([
    ["missing", undefined],
    ["unknown", "prod"],
  ])("rejects an APP_ENV that is %s", (_, appEnv) => {
    expect(() => validateEnv({ ...required, APP_ENV: appEnv })).toThrow(
      /APP_ENV/,
    );
  });

  it("rejects a short JWT_SECRET", () => {
    expect(() => validateEnv({ ...required, JWT_SECRET: "short" })).toThrow(
      /JWT_SECRET: must be at least 32 characters/,
    );
  });

  it("rejects a missing JWT_SECRET", () => {
    expect(() => validateEnv({ ...required, JWT_SECRET: undefined })).toThrow(
      /Invalid environment:[\s\S]*JWT_SECRET/,
    );
  });

  it.each(["USERS_GRPC_URL", "WORKOUTS_GRPC_URL"])(
    "rejects a missing %s instead of defaulting to localhost",
    (key) => {
      expect(() => validateEnv({ ...required, [key]: undefined })).toThrow(
        new RegExp(key),
      );
    },
  );

  it("accepts GRPC_AUTH=google-id-token", () => {
    expect(
      validateEnv({ ...required, GRPC_AUTH: "google-id-token" }).GRPC_AUTH,
    ).toBe("google-id-token");
  });

  it("rejects an unknown GRPC_AUTH", () => {
    expect(() => validateEnv({ ...required, GRPC_AUTH: "tls" })).toThrow(
      /GRPC_AUTH/,
    );
  });

  describe("CORS_ORIGINS", () => {
    it("splits a comma-separated list and trims each origin", () => {
      expect(
        validateEnv({
          ...required,
          CORS_ORIGINS: " https://app.example.com , http://localhost:8100,",
        }).CORS_ORIGINS,
      ).toEqual(["https://app.example.com", "http://localhost:8100"]);
    });

    it.each([
      ["missing", undefined],
      ["empty", " , "],
    ])("rejects a %s list", (_, origins) => {
      expect(() => validateEnv({ ...required, CORS_ORIGINS: origins })).toThrow(
        /CORS_ORIGINS/,
      );
    });

    it.each([
      ["not a URL", "localhost:8100"],
      ["not http(s)", "ftp://example.com"],
      ["a URL with a path", "https://app.example.com/shell"],
      ["a URL with a trailing slash", "https://app.example.com/"],
    ])("rejects an origin that is %s", (_, origin) => {
      expect(() => validateEnv({ ...required, CORS_ORIGINS: origin })).toThrow(
        /CORS_ORIGINS/,
      );
    });
  });
});
