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
export declare function getNotificationState(supported: boolean, permission: NotificationPermission): NotificationState;
export declare function isNotificationSupported(): boolean;
export declare function useNotification(): UseNotificationResult;
