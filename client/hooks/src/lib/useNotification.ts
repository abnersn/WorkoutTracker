import { useCallback, useState } from "react";

const TITLE = "Workout tracker";

export interface UseNotificationResult {
  hasAskedPermission: boolean;
  hasNotificationPermission: boolean;
  notify: (message: string) => void;
  requestNotificationPermission: () => Promise<void>;
}

export interface NotificationState {
  hasAskedPermission: boolean;
  hasNotificationPermission: boolean;
}

/**
 * Derives the permission flags. Where notifications are unsupported, behave as if
 * permission was asked and denied, so the UI never offers to request it.
 */
export function getNotificationState(
  supported: boolean,
  permission: NotificationPermission,
): NotificationState {
  if (!supported) {
    return { hasAskedPermission: true, hasNotificationPermission: false };
  }
  return {
    hasAskedPermission: permission !== "default",
    hasNotificationPermission: permission === "granted",
  };
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function useNotification(): UseNotificationResult {
  const supported = isNotificationSupported();
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    supported ? Notification.permission : "denied",
  );

  const requestNotificationPermission = useCallback(async () => {
    if (!isNotificationSupported()) {
      return;
    }
    setPermission(await Notification.requestPermission());
  }, []);

  const notify = useCallback((message: string) => {
    if (!isNotificationSupported() || Notification.permission !== "granted") {
      return;
    }
    new Notification(TITLE, { body: message });
  }, []);

  return {
    ...getNotificationState(supported, permission),
    notify,
    requestNotificationPermission,
  };
}
