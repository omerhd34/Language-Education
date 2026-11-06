"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  useStartVocabularyStudyTimerMutation,
  useVocabularyLearnQuotaQuery,
} from "@/store/api";
import { cn } from "@/lib/utils";

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
  const [startTimer, { isLoading }] = useStartVocabularyStudyTimerMutation();
  const [hasError, setHasError] = useState(false);
  const pending = data?.pendingStudyCount ?? 0;

  if (pending <= 0) {
    return null;
  }

  async function handleStart() {
    setHasError(false);
    try {
      await startTimer().unwrap();
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
  const pending = data?.pendingStudyCount ?? 0;

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
        {t("studyTimerPendingHint", { count: pending })}
      </p>
      <StartStudyTimerButton />
    </div>
  );
}
