"use client";

import type { MouseEvent } from "react";
import { BookOpen, ClipboardCheck, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { navigatePanelHref } from "@/hooks/usePanelHash";
import { cn } from "@/lib/utils";
import {
  resolveNotificationHref,
  type AppNotification,
} from "@/lib/notificationsStorage";

type NotificationItemProps = {
  item: AppNotification;
  typeLabel: string;
  timeLabel: string;
  dismissLabel: string;
  onOpen: () => void;
  onDismiss: () => void;
};

export function NotificationItem({
  item,
  typeLabel,
  timeLabel,
  dismissLabel,
  onOpen,
  onDismiss,
}: NotificationItemProps) {
  const Icon = item.type === "quiz_ready" ? ClipboardCheck : BookOpen;
  const href = resolveNotificationHref(item.type, item.href);

  function handleOpen(event: MouseEvent<HTMLAnchorElement>) {
    onOpen();
    if (navigatePanelHref(href)) {
      event.preventDefault();
    }
  }

  return (
    <li className="group relative">
      <Link
        href={href}
        onClick={handleOpen}
        className={cn(
          "flex items-start gap-3 rounded-xl px-3 py-2.5 pr-8 transition-colors",
          item.read
            ? "bg-transparent hover:bg-muted/70"
            : "bg-sky-500/10 hover:bg-sky-500/15",
        )}
      >
        <span
          className={cn(
            "mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
            item.type === "quiz_ready"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/15 text-amber-700 dark:text-amber-300",
          )}
          aria-hidden
        >
          <Icon className="size-4" strokeWidth={1.75} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-brand-950 dark:text-brand-100">
            {item.title}
          </span>
          <span className="mt-0.5 block text-xs text-brand-600 dark:text-brand-400">
            {typeLabel}
            <span aria-hidden> · </span>
            {timeLabel}
          </span>
        </span>

        {!item.read ? (
          <span
            className="mt-2 size-2 shrink-0 rounded-full bg-sky-500"
            aria-hidden
          />
        ) : null}
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute top-1.5 right-1.5 rounded-full border border-transparent text-brand-600 opacity-0 transition-colors group-hover:border-border group-hover:opacity-100 hover:border-destructive/40 hover:bg-transparent hover:text-destructive focus-visible:border-destructive/40 focus-visible:opacity-100 focus-visible:text-destructive dark:text-brand-400 dark:group-hover:border-white/20 dark:hover:border-red-300/50 dark:hover:text-red-300 dark:focus-visible:border-red-300/50 dark:focus-visible:text-red-300"
        aria-label={dismissLabel}
        onClick={onDismiss}
      >
        <X aria-hidden />
      </Button>
    </li>
  );
}
