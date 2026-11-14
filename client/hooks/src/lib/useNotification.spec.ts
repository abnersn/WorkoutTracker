import { getNotificationState } from "./useNotification";

describe("getNotificationState", () => {
  it("treats unsupported browsers as asked and denied", () => {
    expect(getNotificationState(false, "default")).toEqual({
      hasAskedPermission: true,
      hasNotificationPermission: false,
    });
  });

  it("has not asked while permission is default", () => {
    expect(getNotificationState(true, "default")).toEqual({
      hasAskedPermission: false,
      hasNotificationPermission: false,
    });
  });

  it("has asked and is granted", () => {
    expect(getNotificationState(true, "granted")).toEqual({
      hasAskedPermission: true,
      hasNotificationPermission: true,
    });
  });

  it("has asked and was denied", () => {
    expect(getNotificationState(true, "denied")).toEqual({
      hasAskedPermission: true,
      hasNotificationPermission: false,
    });
  });
});
