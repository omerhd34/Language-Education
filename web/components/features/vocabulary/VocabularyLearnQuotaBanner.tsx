"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ClipboardCheck } from "lucide-react";
import {
  useStudiedTodayVocabularyWordsQuery,
  useVocabularyLearnQuotaQuery,
  useVocabularyQuizQuery,
} from "@/store/api";
import { ActiveStudyTimerNotice } from "@/components/features/vocabulary/CancelStudyTimerButton";
import { StudyTimerPendingNotice } from "@/components/features/vocabulary/StartStudyTimerButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useCountdown } from "@/hooks/useCountdown";
import {
  BYPASS_LEARN_WORD_LOCK,
  LEARN_WORD_PERIOD_LIMIT,
} from "@/lib/vocabularyLimits";
import { cn } from "@/lib/utils";

type VocabularyLearnQuotaBannerProps = {
  className?: string;
};

export function VocabularyLearnQuotaBanner({
  className,
}: VocabularyLearnQuotaBannerProps) {
  const t = useTranslations("Vocabulary");
  const tDashboard = useTranslations("Dashboard");
  const { data, refetch } = useVocabularyLearnQuotaQuery();
  const { data: quiz } = useVocabularyQuizQuery();
  const { data: studiedToday } = useStudiedTodayVocabularyWordsQuery();

  const lockedUntil = data?.lockedUntil ?? null;
  const remainingMs = useCountdown(lockedUntil);
  const quizReady = (quiz?.dueCount ?? 0) > 0;
  const pending = data?.pendingStudyCount ?? 0;
  const cancellableCount = studiedToday?.cancellableCount ?? 0;

  useEffect(() => {
    if (lockedUntil && remainingMs === 0) {
      void refetch();
    }
  }, [lockedUntil, remainingMs, refetch]);

  const showPendingNotice = pending > 0;
  const showQuizCard = quizReady;
  const showRow = showPendingNotice || showQuizCard;

  if (!showRow && cancellableCount === 0) {
    return null;
  }

  const bothInRow = showPendingNotice && showQuizCard;
  const rowChildWidth = cn(
    "min-w-0",
    bothInRow ? "min-w-0 flex-1 basis-0" : "w-full flex-1",
  );

  return (
    <div className={cn("space-y-3", className)}>
      <ActiveStudyTimerNotice />
      {showRow ? (
        <div className="flex flex-row items-stretch gap-3">
          {showPendingNotice ? (
            <StudyTimerPendingNotice className={rowChildWidth} />
          ) : null}
          {showQuizCard ? (
            <div
              className={cn(
                "flex min-h-12 flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200/70 bg-brand-50/50 px-4 py-3 dark:border-brand-800/70 dark:bg-brand-900/40",
                rowChildWidth,
              )}
            >
              <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
                {tDashboard("quizCardReady", { count: quiz?.dueCount ?? 0 })}
              </p>
              <ButtonLink
                href="/panel/kelime/sinav"
                size="sm"
                className="shrink-0"
              >
                <ClipboardCheck className="size-3.5" aria-hidden />
                {t("startQuizEarly")}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function useVocabularyLearnLimitReached(): boolean {
  const { data } = useVocabularyLearnQuotaQuery();
  const selected =
    data?.learningSelectedInPeriod ?? data?.learningSelectedToday ?? 0;
  const learnLimit =
    data?.learnLimit ?? data?.dailyLearnLimit ?? LEARN_WORD_PERIOD_LIMIT;
  const remainingMs = useCountdown(data?.lockedUntil);
  const isLocked =
    !BYPASS_LEARN_WORD_LOCK && Boolean(data?.lockedUntil) && remainingMs > 0;
  return isLocked || selected >= learnLimit;
}
