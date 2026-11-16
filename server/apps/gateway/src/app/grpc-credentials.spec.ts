import { audienceFor, cachedIdToken } from "./grpc-credentials";

// A JWT whose payload only carries exp (seconds since the epoch).
const tokenExpiringAt = (ms: number): string =>
  [
    "header",
    Buffer.from(JSON.stringify({ exp: ms / 1000 })).toString("base64url"),
    "signature",
  ].join(".");

describe("audienceFor", () => {
  it("drops the port and adds https", () => {
    expect(audienceFor("users-svc-abc-ew.a.run.app:443")).toBe(
      "https://users-svc-abc-ew.a.run.app",
    );
  });
});

describe("cachedIdToken", () => {
  const HOUR = 60 * 60_000;
  let clock: number;
  const now = (): number => clock;

  beforeEach(() => {
    clock = 1_000_000_000_000;
  });

  it("asks for a token for the given audience", async () => {
    const fetch = jest.fn().mockResolvedValue(tokenExpiringAt(clock + HOUR));

    await cachedIdToken("https://svc", fetch, now)();

    expect(fetch).toHaveBeenCalledWith("https://svc");
  });

  it("reuses a token until shortly before it expires", async () => {
    const first = tokenExpiringAt(clock + HOUR);
    const second = tokenExpiringAt(clock + 2 * HOUR);
    const fetch = jest
      .fn()
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);
    const token = cachedIdToken("https://svc", fetch, now);

    await expect(token()).resolves.toBe(first);
    clock += HOUR - 6 * 60_000;
    await expect(token()).resolves.toBe(first);
    clock += 2 * 60_000;
    await expect(token()).resolves.toBe(second);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("shares one fetch between concurrent calls", async () => {
    const fetch = jest.fn().mockResolvedValue(tokenExpiringAt(clock + HOUR));
    const token = cachedIdToken("https://svc", fetch, now);

    await Promise.all([token(), token(), token()]);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries after a failed fetch", async () => {
    const fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error("metadata server down"))
      .mockResolvedValueOnce(tokenExpiringAt(clock + HOUR));
    const token = cachedIdToken("https://svc", fetch, now);

    await expect(token()).rejects.toThrow("metadata server down");
    await expect(token()).resolves.toEqual(expect.any(String));
  });
});
