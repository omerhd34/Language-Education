"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { VocabularyWord } from "@/data/vocabulary";
import { useVocabularyStatusQuery } from "@/store/api";
import { useVocabularyStore } from "@/store/vocabularyStore";
import type { VocabularyWordStatusValue } from "@/types/api";
import { VocabularyWordCard } from "@/components/features/vocabulary/VocabularyWordCard";
import {
  useVocabularyLearnLimitReached,
  VocabularyLearnQuotaBanner,
} from "@/components/features/vocabulary/VocabularyLearnQuotaBanner";
import { VocabularyWordJumpNav } from "@/components/features/vocabulary/VocabularyWordJumpNav";
import { getApiErrorCode } from "@/lib/apiClient";
import { vocabularyStatusActivityId } from "@/lib/vocabularyActivity";
import { markVocabularyActivities } from "@/lib/vocabularyActivityStorage";
import { LEARN_WORD_PERIOD_LIMIT } from "@/lib/vocabularyLimits";

type VocabularyWordListProps = {
  categoryId: string;
  words: VocabularyWord[];
};

export function VocabularyWordList({
  categoryId,
  words,
}: VocabularyWordListProps) {
  const t = useTranslations("Vocabulary");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingWordId, setPendingWordId] = useState<string | null>(null);

  const { data, isLoading, isError } = useVocabularyStatusQuery({
    categoryId,
  });
  const setStatus = useVocabularyStore((state) => state.setWordStatus);
  const learnLimitReached = useVocabularyLearnLimitReached();
  const learnLimit =
    data?.learnLimit ?? data?.dailyLearnLimit ?? LEARN_WORD_PERIOD_LIMIT;
  const pendingWordIds = new Set(data?.pendingStudyWordIds ?? []);

  useEffect(() => {
    if (!data?.statuses) {
      return;
    }

    const actionIds: string[] = [];
    for (const [wordId, status] of Object.entries(data.statuses)) {
      if (status === "KNOWN") {
        actionIds.push(vocabularyStatusActivityId(wordId, "known"));
      }
    }
    markVocabularyActivities(categoryId, actionIds);
  }, [categoryId, data?.statuses]);

  async function handleSetStatus(
    wordId: string,
    status: VocabularyWordStatusValue | null,
    activity?: "known" | "learn" | "relearn",
  ) {
    setErrorMessage(null);
    setPendingWordId(wordId);

    try {
      await setStatus({ categoryId, wordId, status });
      if (activity && activity !== "learn") {
        markVocabularyActivities(categoryId, [
          vocabularyStatusActivityId(wordId, activity),
        ]);
      }
    } catch (error) {
      const code = getApiErrorCode(error) ?? undefined;
      if (code === "LEARN_PERIOD_LOCKED" || code === "DAILY_LEARN_LIMIT") {
        setErrorMessage(t("learnPeriodLocked", { limit: learnLimit }));
      } else {
        setErrorMessage(t("statusError"));
      }
    } finally {
      setPendingWordId(null);
    }
  }

  if (words.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("emptyWords")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <VocabularyLearnQuotaBanner />
      <VocabularyWordJumpNav words={words} />

      {isLoading ? (
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("statusLoading")}
        </p>
      ) : null}

      {isError || errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage ?? t("statusError")}
        </p>
      ) : null}

      <ul className="space-y-4" aria-label={t("listAria")}>
        {words.map((word, index) => (
          <li key={`${word.id}-${index}`}>
            <VocabularyWordCard
              word={word}
              categoryId={categoryId}
              categoryWords={words}
              index={index + 1}
              status={data?.statuses[word.id]}
              timerPending={pendingWordIds.has(word.id)}
              learnDisabled={learnLimitReached}
              isUpdating={pendingWordId === word.id}
              onSetStatus={(nextStatus, activity) => {
                void handleSetStatus(word.id, nextStatus, activity);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
