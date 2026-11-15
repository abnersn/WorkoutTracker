import { act, renderHook } from "@testing-library/react";
import { useTimer } from "./useTimer";

function setVisibility(state: DocumentVisibilityState): void {
  Object.defineProperty(document, "visibilityState", {
    value: state,
    configurable: true,
  });
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

describe("useTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.sessionStorage.clear();
    setVisibility("visible");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts stopped at the initial value", () => {
    const { result } = renderHook(() => useTimer("t", 5));
    expect(result.current.value).toBe(5);
    expect(result.current.isRunning).toBe(false);
  });

  it("counts up by the increment every second while running", () => {
    const { result } = renderHook(() => useTimer("t", 0, 1));
    act(() => result.current.play());
    act(() => jest.advanceTimersByTime(3000));
    expect(result.current.value).toBe(3);
    expect(result.current.isRunning).toBe(true);
  });

  it("stops advancing when paused", () => {
    const { result } = renderHook(() => useTimer("t", 0, 1));
    act(() => result.current.play());
    act(() => jest.advanceTimersByTime(2000));
    act(() => result.current.pause());
    act(() => jest.advanceTimersByTime(5000));
    expect(result.current.value).toBe(2);
    expect(result.current.isRunning).toBe(false);
  });

  it("counts down with a negative increment and never goes below zero", () => {
    const { result } = renderHook(() => useTimer("t", 2, -1));
    act(() => result.current.play());
    act(() => jest.advanceTimersByTime(5000));
    expect(result.current.value).toBe(0);
  });

  it("lets the value be set directly", () => {
    const { result } = renderHook(() => useTimer("t", 0));
    act(() => result.current.set(42));
    expect(result.current.value).toBe(42);
  });

  it("pauses while the page is hidden and catches up on return", () => {
    const { result } = renderHook(() => useTimer("bg", 0, 1));
    act(() => result.current.play());
    act(() => jest.advanceTimersByTime(2000));

    setVisibility("hidden");
    act(() => jest.advanceTimersByTime(5000));
    expect(result.current.value).toBe(2);

    setVisibility("visible");
    expect(result.current.value).toBe(7);
  });

  it("does not catch up when it was not running while hidden", () => {
    const { result } = renderHook(() => useTimer("bg2", 0, 1));
    setVisibility("hidden");
    setVisibility("visible");
    expect(result.current.value).toBe(0);
  });

  it("still works when sessionStorage throws", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    const { result } = renderHook(() => useTimer("blocked", 0, 1));
    act(() => result.current.play());
    act(() => jest.advanceTimersByTime(2000));
    expect(result.current.value).toBe(2);

    setVisibility("hidden");
    setVisibility("visible");
    expect(result.current.value).toBe(2);

    jest.restoreAllMocks();
  });
});
