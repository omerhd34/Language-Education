/* eslint-disable react-hooks/purity */
"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useCountdown } from "@/hooks/useCountdown";
import { getLearnMissedDayNotice } from "@/lib/learnMissedDay";
import { ensureNotification } from "@/lib/notificationsStorage";
import { useVocabularyLearnQuotaQuery } from "@/store/api";

export function LearnMissedDayNotificationWatcher() {
  const t = useTranslations("Dashboard");
  const user = useAppSelector((state) => state.auth.user);
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

    const publish = () => {
      const notice = getLearnMissedDayNotice({
        nowMs: Date.now(),
        lastSelectedAt: quota.lastLearnSelectedAt ?? null,
        learnUnlockedAt: quota.learnUnlockedAt ?? null,
        lockedUntil: quota.lockedUntil,
        accountCreatedAt: user.createdAt,
      });

      if (!notice) {
        return;
      }

      ensureNotification({
        id: notice.id,
        type: "learn_missed_day",
        title: t("learnMissedNotificationTitle"),
        body: t("learnMissedNotificationBody"),
        href: "/panel#kelimeler",
        createdAt: new Date().toISOString(),
        read: false,
      });
    };

    publish();
    const id = window.setInterval(publish, 30_000);
    return () => window.clearInterval(id);
  }, [quota, user, t]);

  return null;
}
