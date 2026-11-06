"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useVocabularyQuizQuery } from "@/store/api";
import { useCountdown } from "@/hooks/useCountdown";
import { upsertNotification } from "@/lib/notificationsStorage";

export function QuizReadyNotificationWatcher() {
  const t = useTranslations("Dashboard");
  const { data: quiz, refetch: refetchQuiz } = useVocabularyQuizQuery();
  const nextDueAt = quiz?.nextDueAt ?? null;
  const remainingMs = useCountdown(nextDueAt);
  const handledSignatureRef = useRef<string | null>(null);

  const dueSignature = useMemo(() => {
    const words = quiz?.words ?? [];
    if ((quiz?.dueCount ?? 0) <= 0 || words.length === 0) {
      return null;
    }
    return words
      .map((word) => word.id)
      .sort()
      .join("|");
  }, [quiz?.dueCount, quiz?.words]);

  useEffect(() => {
    if (!nextDueAt || remainingMs > 0) {
      return;
    }
    void refetchQuiz();
  }, [nextDueAt, remainingMs, refetchQuiz]);

  useEffect(() => {
    if (!dueSignature) {
      return;
    }

    if (handledSignatureRef.current === dueSignature) {
      return;
    }
    handledSignatureRef.current = dueSignature;

    upsertNotification({
      id: `quiz-ready-${dueSignature}`,
      type: "quiz_ready",
      title: t("quizReadyNotificationTitle"),
      body: t("quizReadyNotificationBody", {
        count: quiz?.dueCount ?? 0,
      }),
      href: "/panel/kelime/sinav",
      createdAt: new Date().toISOString(),
      read: false,
    });
  }, [dueSignature, quiz?.dueCount, t]);

  return null;
}
