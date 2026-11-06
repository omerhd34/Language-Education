export type AppNotificationType = "quiz_ready" | "learn_missed_day";

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
};

const STORAGE_KEY = "pylmor-notifications";
const DISMISSED_KEY = "pylmor-notifications-dismissed";
export const NOTIFICATIONS_CHANGED_EVENT = "pylmor:notifications-changed";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function emitNotificationsChanged(): void {
  if (!canUseStorage()) {
    return;
  }
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export function readNotifications(): AppNotification[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isAppNotification);
  } catch {
    return [];
  }
}

function isAppNotification(value: unknown): value is AppNotification {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    (item.type === "quiz_ready" || item.type === "learn_missed_day") &&
    typeof item.title === "string" &&
    typeof item.body === "string" &&
    typeof item.href === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.read === "boolean"
  );
}

export function writeNotifications(notifications: AppNotification[]): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  emitNotificationsChanged();
}

function readDismissedIds(): string[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function rememberDismissedId(id: string): void {
  if (!canUseStorage()) {
    return;
  }

  const ids = readDismissedIds().filter((item) => item !== id);
  ids.push(id);
  window.localStorage.setItem(
    DISMISSED_KEY,
    JSON.stringify(ids.slice(-200)),
  );
}

export function ensureNotification(
  notification: AppNotification,
): AppNotification[] {
  const current = readNotifications();
  if (
    current.some((item) => item.id === notification.id) ||
    readDismissedIds().includes(notification.id)
  ) {
    return current;
  }

  const next = [notification, ...current];
  writeNotifications(next);
  return next;
}

export function upsertNotification(
  notification: AppNotification,
): AppNotification[] {
  const current = readNotifications();
  const index = current.findIndex((item) => item.id === notification.id);
  const next =
    index >= 0
      ? current.map((item, i) =>
          i === index ? { ...item, ...notification } : item,
        )
      : [notification, ...current];

  writeNotifications(next);
  return next;
}

export function dismissNotification(id: string): AppNotification[] {
  rememberDismissedId(id);
  const next = readNotifications().filter((item) => item.id !== id);
  writeNotifications(next);
  return next;
}

export function markNotificationRead(id: string): AppNotification[] {
  const next = readNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  writeNotifications(next);
  return next;
}

export function markAllNotificationsRead(): AppNotification[] {
  const next = readNotifications().map((item) => ({ ...item, read: true }));
  writeNotifications(next);
  return next;
}
