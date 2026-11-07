"use client";

import type { MouseEvent } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { navigatePanelHref } from "@/hooks/usePanelHash";
import {
  resolveNotificationHref,
  type AppNotification,
} from "@/lib/notificationsStorage";

type NotificationFeaturedAlertProps = {
  item: AppNotification;
  reviewLabel: string;
  onOpen: () => void;
};

export function NotificationFeaturedAlert({
  item,
  reviewLabel,
  onOpen,
}: NotificationFeaturedAlertProps) {
  const href = resolveNotificationHref(item.type, item.href);

  function handleOpen(event: MouseEvent<HTMLAnchorElement>) {
    onOpen();
    if (navigatePanelHref(href)) {
      event.preventDefault();
    }
  }

  return (
    <div className="rounded-2xl bg-brand-950 p-3.5 text-brand-50 shadow-sm dark:bg-brand-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight">{item.title}</p>
          <p className="mt-1 text-xs leading-snug text-brand-200/85">
            {item.body}
          </p>
        </div>
        <ButtonLink
          href={href}
          size="sm"
          className="shrink-0 border-transparent bg-white text-brand-950 hover:bg-brand-100"
          onClick={handleOpen}
        >
          {reviewLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
