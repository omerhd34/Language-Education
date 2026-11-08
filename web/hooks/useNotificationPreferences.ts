"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_PREFERENCES_CHANGED_EVENT,
  readNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/notificationPreferencesStorage";

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    DEFAULT_NOTIFICATION_PREFERENCES,
  );

  useEffect(() => {
    setPreferences(readNotificationPreferences());

    function sync(event: Event) {
      const custom = event as CustomEvent<NotificationPreferences>;
      setPreferences(custom.detail ?? readNotificationPreferences());
    }

    window.addEventListener(NOTIFICATION_PREFERENCES_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(NOTIFICATION_PREFERENCES_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function patchPreferences(patch: Partial<NotificationPreferences>) {
    const next = updateNotificationPreferences(patch);
    setPreferences(next);
    return next;
  }

  return { preferences, patchPreferences };
}
