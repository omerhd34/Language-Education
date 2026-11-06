"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import { cn } from "@/lib/utils";

export function NotificationsMenu() {
  const t = useTranslations("Dashboard");
  const {
    notifications,
    unreadCount,
    open,
    toggleMenu,
    closeMenu,
    markRead,
    markAllRead,
  } = useAppNotifications();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeMenu]);

  return (
    <div
      ref={rootRef}
      className="relative flex flex-col items-start"
    >
      <p className="dashboard-panel__label">
        <Bell className="size-3.5" aria-hidden />
        {t("notifications")}
      </p>

      <span className="bar-badged mt-3">
        <button
          type="button"
          className="relative inline-flex size-12 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface-muted text-brand-800 transition-colors hover:bg-muted dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800"
          aria-label={t("notifications")}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={toggleMenu}
        >
          <Bell className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
        {unreadCount > 0 ? (
          <>
            <span className="bar-badge" aria-hidden="true">
              {unreadCount}
            </span>
            <span className="sr-only">
              {t("unreadNotifications", { count: unreadCount })}
            </span>
          </>
        ) : null}
      </span>

      {open ? (
        <div
          role="dialog"
          aria-label={t("notifications")}
          className="absolute top-[calc(100%+0.5rem)] right-0 z-40 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-3 shadow-lg dark:bg-brand-950"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-brand-950 dark:text-brand-100">
              {t("notifications")}
            </p>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="cursor-pointer text-xs font-medium text-sky-700 hover:underline dark:text-sky-300"
                onClick={markAllRead}
              >
                {t("notificationsMarkAllRead")}
              </button>
            ) : null}
          </div>

          {notifications.length === 0 ? (
            <p className="px-1 py-4 text-sm text-brand-600 dark:text-brand-400">
              {t("notificationsEmpty")}
            </p>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto">
              {notifications.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      markRead(item.id);
                      closeMenu();
                    }}
                    className={cn(
                      "block rounded-xl border px-3 py-2 transition-colors",
                      item.read
                        ? "border-border bg-transparent hover:bg-muted/60"
                        : "border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/15",
                    )}
                  >
                    <p className="text-sm font-medium text-brand-950 dark:text-brand-100">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-600 dark:text-brand-400">
                      {item.body}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
