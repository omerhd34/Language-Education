"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { VocabularyWord } from "@/data/vocabulary";
import {
  useSetVocabularyWordStatusMutation,
  useVocabularyStatusQuery,
  type VocabularyWordStatusValue,
} from "@/store/api";
import { VocabularyWordCard } from "@/components/features/vocabulary/VocabularyWordCard";
import {
  useVocabularyLearnLimitReached,
  VocabularyLearnQuotaBanner,
} from "@/components/features/vocabulary/VocabularyLearnQuotaBanner";
import { SpeechRateControl } from "@/components/features/vocabulary/SpeechRateControl";
import { VocabularyWordJumpNav } from "@/components/features/vocabulary/VocabularyWordJumpNav";
import { LEARN_WORD_PERIOD_LIMIT } from "@/lib/vocabularyLimits";

type VocabularyWordListProps = {
  categoryId: string;
  words: VocabularyWord[];
};

function getApiErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return undefined;
  }

  const data = (error as { data?: unknown }).data;
  if (typeof data !== "object" || data === null || !("error" in data)) {
    return undefined;
  }

  const apiError = (data as { error?: { code?: unknown } }).error;
  return typeof apiError?.code === "string" ? apiError.code : undefined;
}

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
  const [setStatus] = useSetVocabularyWordStatusMutation();
  const learnLimitReached = useVocabularyLearnLimitReached();
  const learnLimit =
    data?.learnLimit ?? data?.dailyLearnLimit ?? LEARN_WORD_PERIOD_LIMIT;

  async function handleSetStatus(
    wordId: string,
    status: VocabularyWordStatusValue | null,
  ) {
    setErrorMessage(null);
    setPendingWordId(wordId);

    try {
      await setStatus({ categoryId, wordId, status }).unwrap();
    } catch (error) {
      const code = getApiErrorCode(error);
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
      <SpeechRateControl />
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
              categoryWords={words}
              index={index + 1}
              status={data?.statuses[word.id]}
              learnDisabled={learnLimitReached}
              isUpdating={pendingWordId === word.id}
              onSetStatus={(nextStatus) => {
                void handleSetStatus(word.id, nextStatus);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
