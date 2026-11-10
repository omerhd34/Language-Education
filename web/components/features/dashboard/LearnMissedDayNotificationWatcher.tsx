"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCountdown } from "@/hooks/useCountdown";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { showBrowserNotification } from "@/lib/browserNotification";
import {
  getLearnMissedDayNotice,
  markLearnMissedNotified,
  wasLearnMissedNotifiedRecently,
} from "@/lib/learnMissedDay";
import { ensureNotification } from "@/lib/notificationsStorage";
import { useVocabularyLearnQuotaQuery } from "@/store/api";
import { useAuthStore } from "@/store/authStore";

export function LearnMissedDayNotificationWatcher() {
  const t = useTranslations("Dashboard");
  const user = useAuthStore((state) => state.user);
  const { preferences } = useNotificationPreferences();
  const { data: quota, refetch } = useVocabularyLearnQuotaQuery();
  const lockedUntil = quota?.lockedUntil ?? null;
  const remainingMs = useCountdown(lockedUntil);
  const lockExpired =
    Boolean(lockedUntil) &&
    remainingMs <= 0 &&
    Date.parse(lockedUntil ?? "") <= Date.now();

  useEffect(() => {
    if (!lockExpired) {
      return;
    }

    void refetch();
    const id = window.setInterval(() => {
      void refetch();
    }, 5000);

    return () => window.clearInterval(id);
  }, [lockExpired, refetch]);

  useEffect(() => {
    if (!quota || !user) {
      return;
    }

    if (!preferences.learnMissedDay) {
      return;
    }

    const publish = () => {
      const nowMs = Date.now();
      if (wasLearnMissedNotifiedRecently(nowMs)) {
        return;
      }

      const notice = getLearnMissedDayNotice({
        nowMs,
        lastSelectedAt: quota.lastLearnSelectedAt ?? null,
        learnUnlockedAt: quota.learnUnlockedAt ?? null,
        lockedUntil: quota.lockedUntil,
        accountCreatedAt: user.createdAt,
      });

      if (!notice) {
        return;
      }

      const notification = {
        id: notice.id,
        type: "learn_missed_day" as const,
        title: t("learnMissedNotificationTitle"),
        body: t("learnMissedNotificationBody"),
        href: "/panel#vocabulary",
        createdAt: new Date(nowMs).toISOString(),
        read: false,
      };
      const { created } = ensureNotification(notification);
      if (created) {
        markLearnMissedNotified(nowMs);
        showBrowserNotification(notification);
      }
    };

    publish();
    const id = window.setInterval(publish, 30_000);
    return () => window.clearInterval(id);
  }, [quota, user, t, preferences.learnMissedDay]);

  return null;
}
