import type { AppNotification } from "@/lib/notificationsStorage";
import { readNotificationPreferences } from "@/lib/notificationPreferencesStorage";

export async function requestBrowserNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  return Notification.requestPermission();
}

export function showBrowserNotification(notification: AppNotification): void {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  const prefs = readNotificationPreferences();
  if (!prefs.browserPush || Notification.permission !== "granted") {
    return;
  }

  try {
    const browserNotification = new Notification(notification.title, {
      body: notification.body,
      tag: notification.id,
    });
    browserNotification.onclick = () => {
      window.focus();
      browserNotification.close();
      window.location.assign(notification.href);
    };
  } catch {}
}
