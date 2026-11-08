"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useVocabularyQuizQuery } from "@/store/api";
import { useCountdown } from "@/hooks/useCountdown";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { showBrowserNotification } from "@/lib/browserNotification";
import {
  ensureNotification,
  readNotifications,
} from "@/lib/notificationsStorage";
import { unseenQuizReadyWordIds } from "@/lib/quizReadyNotice";

export function QuizReadyNotificationWatcher() {
  const t = useTranslations("Dashboard");
  const { preferences } = useNotificationPreferences();
  const { data: quiz, refetch: refetchQuiz } = useVocabularyQuizQuery();
  const nextDueAt = quiz?.nextDueAt ?? null;
  const remainingMs = useCountdown(nextDueAt);
  const overdue =
    Boolean(nextDueAt) &&
    remainingMs <= 0 &&
    Date.parse(nextDueAt ?? "") <= Date.now();

  useEffect(() => {
    if (!overdue) {
      return;
    }

    void refetchQuiz();
    const id = window.setInterval(() => {
      void refetchQuiz();
    }, 5000);

    return () => window.clearInterval(id);
  }, [overdue, refetchQuiz]);

  useEffect(() => {
    if (!preferences.quizReady) {
      return;
    }

    const dueIds = (quiz?.words ?? []).map((word) => word.id);
    if ((quiz?.dueCount ?? 0) <= 0 || dueIds.length === 0) {
      return;
    }

    const unseen = unseenQuizReadyWordIds(dueIds, readNotifications());
    if (unseen.length === 0) {
      return;
    }

    const signature = [...unseen].sort().join("|");
    const notification = {
      id: `quiz-ready-${signature}`,
      type: "quiz_ready" as const,
      title: t("quizReadyNotificationTitle"),
      body: t("quizReadyNotificationBody", { count: unseen.length }),
      href: "/panel/kelime/bugun-calisilan",
      createdAt: new Date().toISOString(),
      read: false,
    };
    const { created } = ensureNotification(notification);
    if (created) {
      showBrowserNotification(notification);
    }
  }, [quiz?.dueCount, quiz?.words, t, preferences.quizReady]);

  return null;
}
