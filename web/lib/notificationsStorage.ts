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

const NOTIFICATION_HREF_BY_TYPE: Record<AppNotificationType, string> = {
  quiz_ready: "/panel/kelime/bugun-calisilan",
  learn_missed_day: "/panel#kelimeler",
};

export function resolveNotificationHref(
  type: AppNotificationType,
  href?: string,
): string {
  return NOTIFICATION_HREF_BY_TYPE[type] ?? href ?? "/panel";
}

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function emitNotificationsChanged(): void {
  if (!canUseStorage()) {
    return;
  }
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

function normalizeNotification(item: AppNotification): AppNotification {
  return {
    ...item,
    href: resolveNotificationHref(item.type, item.href),
  };
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
    return parsed.filter(isAppNotification).map(normalizeNotification);
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

function rememberDismissedIds(idsToRemember: readonly string[]): void {
  if (!canUseStorage() || idsToRemember.length === 0) {
    return;
  }

  const ids = readDismissedIds().filter(
    (item) => !idsToRemember.includes(item),
  );
  ids.push(...idsToRemember);
  window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids.slice(-200)));
}

function rememberDismissedId(id: string): void {
  rememberDismissedIds([id]);
}

export function ensureNotification(notification: AppNotification): {
  notifications: AppNotification[];
  created: boolean;
} {
  const normalized = normalizeNotification(notification);
  const current = readNotifications();
  if (
    current.some((item) => item.id === normalized.id) ||
    readDismissedIds().includes(normalized.id)
  ) {
    return { notifications: current, created: false };
  }

  const next = [normalized, ...current];
  writeNotifications(next);
  return { notifications: next, created: true };
}

export function upsertNotification(
  notification: AppNotification,
): AppNotification[] {
  const normalized = normalizeNotification(notification);
  const current = readNotifications();
  const index = current.findIndex((item) => item.id === normalized.id);
  const next =
    index >= 0
      ? current.map((item, i) =>
          i === index ? { ...item, ...normalized } : item,
        )
      : [normalized, ...current];

  writeNotifications(next);
  return next;
}

export function dismissNotification(id: string): AppNotification[] {
  rememberDismissedId(id);
  const next = readNotifications().filter((item) => item.id !== id);
  writeNotifications(next);
  return next;
}

export function dismissAllNotifications(): AppNotification[] {
  const current = readNotifications();
  rememberDismissedIds(current.map((item) => item.id));
  writeNotifications([]);
  return [];
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
