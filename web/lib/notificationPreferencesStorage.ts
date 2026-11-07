export type NotificationPreferences = {
  quizReady: boolean;
  learnMissedDay: boolean;
  browserPush: boolean;
};

const STORAGE_KEY = "pylmor-notification-preferences";
export const NOTIFICATION_PREFERENCES_CHANGED_EVENT =
  "pylmor:notification-preferences-changed";

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  quizReady: true,
  learnMissedDay: true,
  browserPush: false,
};

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(preferences: NotificationPreferences): void {
  if (!canUseStorage()) {
    return;
  }
  window.dispatchEvent(
    new CustomEvent(NOTIFICATION_PREFERENCES_CHANGED_EVENT, {
      detail: preferences,
    }),
  );
}

function isNotificationPreferences(
  value: unknown,
): value is NotificationPreferences {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.quizReady === "boolean" &&
    typeof item.learnMissedDay === "boolean" &&
    typeof item.browserPush === "boolean"
  );
}

export function readNotificationPreferences(): NotificationPreferences {
  if (!canUseStorage()) {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isNotificationPreferences(parsed)) {
      if (typeof parsed === "object" && parsed !== null) {
        const legacy = parsed as Record<string, unknown>;
        if (
          typeof legacy.quizReady === "boolean" &&
          typeof legacy.learnMissedDay === "boolean" &&
          typeof legacy.browserPush === "boolean"
        ) {
          return {
            quizReady: legacy.quizReady,
            learnMissedDay: legacy.learnMissedDay,
            browserPush: legacy.browserPush,
          };
        }
      }
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
    return parsed;
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

export function writeNotificationPreferences(
  preferences: NotificationPreferences,
): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  emitChanged(preferences);
}

export function updateNotificationPreferences(
  patch: Partial<NotificationPreferences>,
): NotificationPreferences {
  const next = { ...readNotificationPreferences(), ...patch };
  writeNotificationPreferences(next);
  return next;
}
