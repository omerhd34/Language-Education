"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Bell, ChevronRight, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { NotificationFeaturedAlert } from "@/components/features/dashboard/NotificationFeaturedAlert";
import { NotificationItem } from "@/components/features/dashboard/NotificationItem";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import type {
  AppNotification,
  AppNotificationType,
} from "@/lib/notificationsStorage";
import { cn } from "@/lib/utils";

type NotificationFilter = "all" | AppNotificationType;

function isSameLocalDay(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type NotificationsMenuProps = {
  variant?: "inline" | "sidebar";
  triggerClassName?: string;
};

export function NotificationsMenu({
  variant = "inline",
  triggerClassName,
}: NotificationsMenuProps) {
  const t = useTranslations("Dashboard");
  const {
    notifications,
    unreadCount,
    open,
    toggleMenu,
    closeMenu,
    markRead,
    markAllRead,
    dismiss,
    dismissAll,
  } = useAppNotifications();
  const rootRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const isSidebar = variant === "sidebar";

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

  const counts = useMemo(() => {
    const quiz = notifications.filter((item) => item.type === "quiz_ready");
    const study = notifications.filter(
      (item) => item.type === "learn_missed_day",
    );
    return {
      all: notifications.length,
      quiz_ready: quiz.length,
      learn_missed_day: study.length,
    };
  }, [notifications]);

  const featured = useMemo(
    () =>
      notifications.find((item) => item.type === "quiz_ready" && !item.read) ??
      null,
    [notifications],
  );

  const showFeatured = Boolean(featured) && filter !== "learn_missed_day";

  const filtered = useMemo(() => {
    const byType =
      filter === "all"
        ? notifications
        : notifications.filter((item) => item.type === filter);

    if (!showFeatured || !featured) {
      return byType;
    }

    return byType.filter((item) => item.id !== featured.id);
  }, [featured, filter, notifications, showFeatured]);

  const { today, earlier } = useMemo(() => {
    const now = new Date();
    const todayItems = filtered.filter((item) =>
      isSameLocalDay(new Date(item.createdAt), now),
    );
    const earlierItems = filtered.filter(
      (item) => !isSameLocalDay(new Date(item.createdAt), now),
    );
    return { today: todayItems, earlier: earlierItems };
  }, [filtered]);

  const filters: { id: NotificationFilter; label: string; count: number }[] = [
    { id: "all", label: t("notificationsFilterAll"), count: counts.all },
    {
      id: "quiz_ready",
      label: t("notificationsFilterQuiz"),
      count: counts.quiz_ready,
    },
    {
      id: "learn_missed_day",
      label: t("notificationsFilterStudy"),
      count: counts.learn_missed_day,
    },
  ];

  function typeLabel(type: AppNotificationType): string {
    return type === "quiz_ready"
      ? t("notificationsTypeQuiz")
      : t("notificationsTypeStudy");
  }

  function renderGroup(label: string, items: AppNotification[]): ReactNode {
    if (items.length === 0) {
      return null;
    }

    return (
      <div className="space-y-1">
        <p className="px-3 pt-2 text-[0.65rem] font-semibold tracking-[0.12em] text-brand-600 uppercase dark:text-brand-400">
          {label}
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              typeLabel={typeLabel(item.type)}
              timeLabel={formatNotificationTime(item.createdAt)}
              dismissLabel={t("notificationsDismiss")}
              onOpen={() => {
                markRead(item.id);
                closeMenu();
              }}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative",
        isSidebar
          ? "w-full"
          : "flex h-full flex-col items-center justify-center",
      )}
    >
      <span className={cn("bar-badged", isSidebar && "w-full")}>
        <Button
          type="button"
          variant="ghost"
          size={isSidebar ? "default" : "icon"}
          className={cn(
            isSidebar
              ? "h-auto w-full justify-start gap-2 rounded-[13px] px-2.5 py-2 text-base font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              : "size-11 text-brand-800 shadow-none hover:bg-transparent hover:text-brand-950 dark:text-brand-400 dark:hover:bg-transparent dark:hover:text-brand-100 [&_svg:not([class*='size-'])]:size-5",
            open &&
              isSidebar &&
              "bg-sidebar-accent text-sidebar-accent-foreground",
            triggerClassName,
          )}
          aria-label={t("notifications")}
          aria-expanded={open}
          aria-haspopup="dialog"
          title={t("notifications")}
          onClick={toggleMenu}
        >
          <Bell
            className={cn(isSidebar ? "size-4" : "size-5")}
            strokeWidth={1.75}
            aria-hidden
          />
          {isSidebar ? (
            <span className="group-data-[collapsible=icon]:hidden">
              {t("notifications")}
            </span>
          ) : null}
        </Button>
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
          className={cn(
            "glass-panel z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl text-foreground",
            isSidebar
              ? "absolute bottom-0 left-full ml-4"
              : "absolute top-[calc(100%+0.5rem)] right-0",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <p className="text-sm font-semibold text-brand-950 dark:text-brand-100">
                {t("notifications")}
              </p>
              {unreadCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  className="cursor-pointer text-xs font-medium text-brand-600 transition-colors hover:text-brand-950 dark:text-brand-400 dark:hover:text-brand-100"
                  onClick={markAllRead}
                >
                  {t("notificationsMarkAllRead")}
                </button>
              ) : null}
              {notifications.length > 0 ? (
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-destructive dark:text-brand-400 dark:hover:text-red-300"
                  onClick={dismissAll}
                >
                  {t("notificationsDismissAll")}
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              ) : null}
            </div>
          </div>

          <div
            className="flex gap-1 overflow-x-auto border-b border-border px-2"
            role="tablist"
            aria-label={t("notifications")}
          >
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    "inline-flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-xs font-medium transition-colors",
                    active
                      ? "border-brand-950 text-brand-950 dark:border-brand-100 dark:text-brand-100"
                      : "border-transparent text-brand-600 hover:text-brand-950 dark:text-brand-400 dark:hover:text-brand-100",
                  )}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                  <span
                    className={cn(
                      "inline-flex min-w-4 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
                      active
                        ? "bg-brand-950/8 text-brand-800 dark:bg-white/10 dark:text-brand-100"
                        : "bg-muted text-brand-600 dark:bg-white/5 dark:text-brand-400",
                    )}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-2">
            {showFeatured && featured ? (
              <NotificationFeaturedAlert
                item={featured}
                reviewLabel={t("notificationsReview")}
                onOpen={() => {
                  markRead(featured.id);
                  closeMenu();
                }}
              />
            ) : null}

            {filtered.length === 0 && !showFeatured ? (
              <p className="px-2 py-8 text-center text-sm text-brand-600 dark:text-brand-400">
                {t("notificationsEmpty")}
              </p>
            ) : (
              <>
                {renderGroup(t("notificationsToday"), today)}
                {renderGroup(t("notificationsEarlier"), earlier)}
              </>
            )}
          </div>

          <div className="border-t border-border">
            <Link
              href="/panel/ayarlar#bildirimler"
              onClick={closeMenu}
              className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-brand-800 transition-colors hover:bg-muted/70 dark:text-brand-100 dark:hover:bg-white/5"
            >
              {t("notificationsSettings")}
              <ChevronRight className="size-4 opacity-60" aria-hidden />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
