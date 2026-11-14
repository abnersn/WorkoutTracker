import { renderHook, waitFor } from "@testing-library/react";
import { Database } from "@workout-tracker/utils";
import { usePersistence } from "./usePersistence";

jest.mock("@workout-tracker/utils", () => ({
  Database: jest.fn(),
}));

const MockDatabase = Database as unknown as jest.Mock;

describe("usePersistence", () => {
  beforeEach(() => {
    MockDatabase.mockReset();
  });

  it("returns null until the database has initialized", async () => {
    let resolveInit: () => void = () => undefined;
    const init = jest.fn(
      () => new Promise<void>((resolve) => (resolveInit = resolve)),
    );
    MockDatabase.mockImplementation(() => ({ init }));

    const { result } = renderHook(() => usePersistence());
    expect(result.current).toBeNull();
    expect(init).toHaveBeenCalledTimes(1);

    resolveInit();
    await waitFor(() => expect(result.current).not.toBeNull());
    expect(result.current).toBeInstanceOf(Object);
  });

  it("returns the same database instance it initialized", async () => {
    const instance = { init: jest.fn().mockResolvedValue(undefined) };
    MockDatabase.mockImplementation(() => instance);

    const { result } = renderHook(() => usePersistence());
    await waitFor(() => expect(result.current).toBe(instance));
  });

  it("does not update state after unmounting", async () => {
    let resolveInit: () => void = () => undefined;
    const init = jest.fn(
      () => new Promise<void>((resolve) => (resolveInit = resolve)),
    );
    MockDatabase.mockImplementation(() => ({ init }));
    const consoleError = jest.spyOn(console, "error").mockImplementation();

    const { result, unmount } = renderHook(() => usePersistence());
    unmount();
    resolveInit();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(result.current).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
