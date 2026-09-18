/**
 * Web polyfill for expo-notifications.
 * Fully self-contained — no imports from expo-notifications (even import type)
 * because Metro's dependency extractor scans import statements BEFORE Babel
 * strips type imports, pulling in the native module and triggering the
 * _interopNamespace "Cannot set property default" crash.
 */
import { toast } from 'sonner-native';

// --- Inline types (no external import needed) ---
type NotificationContent = {
  title?: string | null;
  body?: string | null;
  data?: Record<string, unknown>;
  sound?: string | null;
};
type NotificationRequest = {
  identifier?: string;
  content: NotificationContent;
  trigger: unknown;
};
type PermissionResponse = {
  status: string;
  expires: 'never' | number;
  granted: boolean;
  canAskAgain: boolean;
};
type NotificationHandler = {
  handleNotification: (n: unknown) => Promise<{
    shouldShowAlert: boolean;
    shouldPlaySound: boolean;
    shouldSetBadge: boolean;
  }>;
};
type NotificationSubscription = { remove: () => void };

// --- PermissionStatus enum ---
export const PermissionStatus = {
  GRANTED: 'granted',
  DENIED: 'denied',
  UNDETERMINED: 'undetermined',
} as const;

// --- AndroidImportance stub (used by usePushNotifications) ---
export const AndroidImportance = {
  DEFAULT: 3,
  HIGH: 4,
  LOW: 2,
  MAX: 5,
  MIN: 1,
  NONE: 0,
  UNKNOWN: -1,
} as const;

// --- Scheduled notification store ---
const scheduledNotifications = new Map<
  string,
  { timeoutId: ReturnType<typeof setTimeout>; request: NotificationRequest }
>();

// --- Active subscription stubs ---
const _listeners: Array<() => void> = [];

export const setNotificationHandler = (_handler: NotificationHandler | null): void => {
  // no-op on web
};

export const requestPermissionsAsync = async (): Promise<PermissionResponse> => {
  return { status: 'granted', expires: 'never', granted: true, canAskAgain: true };
};

export const getPermissionsAsync = async (): Promise<PermissionResponse> => {
  return { status: 'granted', expires: 'never', granted: true, canAskAgain: true };
};

export const getExpoPushTokenAsync = async (): Promise<{ data: string }> => {
  return { data: '' };
};

export const scheduleNotificationAsync = async (
  notificationRequest: NotificationRequest
): Promise<string> => {
  const { content } = notificationRequest;
  const { title, body } = content;

  let message = '';
  if (title && body) {
    message = `${title}\n${body}`;
  } else if (title) {
    message = title;
  } else if (body) {
    message = body;
  } else {
    return '';
  }

  const identifier = Math.random().toString(36).substr(2, 9);
  const timeoutId = setTimeout(() => {
    toast(message);
    scheduledNotifications.delete(identifier);
  }, 1000);
  scheduledNotifications.set(identifier, { timeoutId, request: notificationRequest });
  return identifier;
};

export const cancelAllScheduledNotificationsAsync = async (): Promise<void> => {
  for (const { timeoutId } of scheduledNotifications.values()) {
    clearTimeout(timeoutId);
  }
  scheduledNotifications.clear();
};

export const cancelScheduledNotificationAsync = async (identifier: string): Promise<void> => {
  const n = scheduledNotifications.get(identifier);
  if (n) {
    clearTimeout(n.timeoutId);
    scheduledNotifications.delete(identifier);
  }
};

export const getAllScheduledNotificationsAsync = async (): Promise<NotificationRequest[]> => {
  return Array.from(scheduledNotifications.values()).map(({ request }) => request);
};

export const addNotificationReceivedListener = (
  _listener: (notification: unknown) => void
): NotificationSubscription => {
  return { remove: () => {} };
};

export const addNotificationResponseReceivedListener = (
  _listener: (response: unknown) => void
): NotificationSubscription => {
  return { remove: () => {} };
};

export const removeNotificationSubscription = (_subscription: NotificationSubscription): void => {
  // no-op on web
};

export const setNotificationChannelAsync = async (
  _channelId: string,
  _channel: unknown
): Promise<void> => {
  // no-op on web
};

export const getBadgeCountAsync = async (): Promise<number> => 0;
export const setBadgeCountAsync = async (_count: number): Promise<void> => {};
export const dismissAllNotificationsAsync = async (): Promise<void> => {};
export const getPresentedNotificationsAsync = async (): Promise<unknown[]> => [];
