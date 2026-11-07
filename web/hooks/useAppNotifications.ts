"use client";

import { useEffect, useState } from "react";
import {
  dismissAllNotifications,
  dismissNotification,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_CHANGED_EVENT,
  readNotifications,
  type AppNotification,
} from "@/lib/notificationsStorage";

export function useAppNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setNotifications(readNotifications());
    sync();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  function openMenu() {
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    setOpen((value) => !value);
  }

  function markRead(id: string) {
    setNotifications(markNotificationRead(id));
  }

  function markAllRead() {
    setNotifications(markAllNotificationsRead());
  }

  function dismiss(id: string) {
    setNotifications(dismissNotification(id));
  }

  function dismissAll() {
    setNotifications(dismissAllNotifications());
  }

  return {
    notifications,
    unreadCount,
    open,
    openMenu,
    closeMenu,
    toggleMenu,
    markRead,
    markAllRead,
    dismiss,
    dismissAll,
  };
}
