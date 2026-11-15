import { act, renderHook } from "@testing-library/react";
import { useNotification } from "./useNotification";

class MockNotification {
  static permission: NotificationPermission = "default";
  static requestPermission = jest.fn<Promise<NotificationPermission>, []>();
  static instances: { title: string; options?: NotificationOptions }[] = [];

  constructor(title: string, options?: NotificationOptions) {
    MockNotification.instances.push({ title, options });
  }
}

function installNotification(): void {
  Object.defineProperty(window, "Notification", {
    value: MockNotification,
    configurable: true,
    writable: true,
  });
}

function removeNotification(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).Notification;
}

describe("useNotification", () => {
  beforeEach(() => {
    installNotification();
    MockNotification.permission = "default";
    MockNotification.instances = [];
    MockNotification.requestPermission.mockReset();
  });

  afterEach(() => {
    removeNotification();
  });

  it("reports asked and denied when the API is unsupported", () => {
    removeNotification();
    const { result } = renderHook(() => useNotification());
    expect(result.current.hasAskedPermission).toBe(true);
    expect(result.current.hasNotificationPermission).toBe(false);
    expect(() => result.current.notify("hi")).not.toThrow();
    expect(MockNotification.instances).toHaveLength(0);
  });

  it("has not asked while permission is default", () => {
    const { result } = renderHook(() => useNotification());
    expect(result.current.hasAskedPermission).toBe(false);
    expect(result.current.hasNotificationPermission).toBe(false);
  });

  it("reflects a permission granted before mount", () => {
    MockNotification.permission = "granted";
    const { result } = renderHook(() => useNotification());
    expect(result.current.hasAskedPermission).toBe(true);
    expect(result.current.hasNotificationPermission).toBe(true);
  });

  it("requests permission and updates the flags", async () => {
    MockNotification.requestPermission.mockResolvedValue("granted");
    const { result } = renderHook(() => useNotification());

    await act(async () => {
      await result.current.requestNotificationPermission();
    });

    expect(MockNotification.requestPermission).toHaveBeenCalledTimes(1);
    expect(result.current.hasAskedPermission).toBe(true);
    expect(result.current.hasNotificationPermission).toBe(true);
  });

  it("records a denial after requesting permission", async () => {
    MockNotification.requestPermission.mockResolvedValue("denied");
    const { result } = renderHook(() => useNotification());

    await act(async () => {
      await result.current.requestNotificationPermission();
    });

    expect(result.current.hasAskedPermission).toBe(true);
    expect(result.current.hasNotificationPermission).toBe(false);
  });

  it("shows a notification when permission is granted", () => {
    MockNotification.permission = "granted";
    const { result } = renderHook(() => useNotification());

    act(() => result.current.notify("Rest is over"));

    expect(MockNotification.instances).toEqual([
      { title: "Workout tracker", options: { body: "Rest is over" } },
    ]);
  });

  it("does not show a notification without permission", () => {
    const { result } = renderHook(() => useNotification());

    act(() => result.current.notify("Rest is over"));

    expect(MockNotification.instances).toHaveLength(0);
  });
});
