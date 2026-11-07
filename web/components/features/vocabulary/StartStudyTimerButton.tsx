"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useStudiedTodayVocabularyWordsQuery,
  useVocabularyLearnQuotaQuery,
  useVocabularyQuizQuery,
} from "@/store/api";
import { useVocabularyStore } from "@/store/vocabularyStore";
import { cn } from "@/lib/utils";

export function useStudyCycleOpen(): { open: boolean; ready: boolean } {
  const studied = useStudiedTodayVocabularyWordsQuery();
  const quiz = useVocabularyQuizQuery();
  const open = (studied.data?.count ?? 0) > 0 || (quiz.data?.dueCount ?? 0) > 0;

  return {
    open,
    ready: studied.isSuccess && quiz.isSuccess,
  };
}

type StartStudyTimerButtonProps = {
  className?: string;
  size?: "sm" | "default";
};

export function StartStudyTimerButton({
  className,
  size = "sm",
}: StartStudyTimerButtonProps) {
  const t = useTranslations("Dashboard");
  const { data } = useVocabularyLearnQuotaQuery();
  const { open: cycleOpen, ready: cycleKnown } = useStudyCycleOpen();
  const startTimer = useVocabularyStore((state) => state.startStudyTimer);
  const isLoading = useVocabularyStore((state) => state.isStartingTimer);
  const [hasError, setHasError] = useState(false);
  const pending = data?.pendingStudyCount ?? 0;

  if (pending <= 0 || !cycleKnown || cycleOpen) {
    return null;
  }

  async function handleStart() {
    setHasError(false);
    try {
      await startTimer();
    } catch {
      setHasError(true);
    }
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1", className)}>
      <Button
        type="button"
        size={size}
        disabled={isLoading}
        onClick={() => {
          void handleStart();
        }}
      >
        <Timer className="size-3.5" aria-hidden />
        {t("startStudyTimer")}
      </Button>
      {hasError ? (
        <p className="text-xs text-destructive" role="alert">
          {t("startStudyTimerError")}
        </p>
      ) : null}
    </span>
  );
}

type StudyTimerPendingNoticeProps = {
  className?: string;
};

export function StudyTimerPendingNotice({
  className,
}: StudyTimerPendingNoticeProps) {
  const t = useTranslations("Dashboard");
  const { data } = useVocabularyLearnQuotaQuery();
  const { open: cycleOpen, ready: cycleKnown } = useStudyCycleOpen();
  const pending = data?.pendingStudyCount ?? 0;
  const blocked = cycleKnown && cycleOpen;

  if (pending <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-4 dark:border-amber-400/20 dark:bg-amber-400/10",
        className,
      )}
    >
      <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
        {blocked
          ? t("studyTimerBlockedHint", { count: pending })
          : t("studyTimerPendingHint", { count: pending })}
      </p>
      <StartStudyTimerButton />
    </div>
  );
}
