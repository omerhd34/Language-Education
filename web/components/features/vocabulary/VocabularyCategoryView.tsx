"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { VocabularyWord } from "@/data/vocabulary";
import {
  VocabularyCategoryTabs,
  type VocabularyCategoryTab,
} from "@/components/features/vocabulary/VocabularyCategoryTabs";
import { VocabularyCategoryLocked } from "@/components/features/vocabulary/VocabularyCategoryLocked";
import { VocabularyWordList } from "@/components/features/vocabulary/VocabularyWordList";
import { TopicExercisesView } from "@/components/features/topics/TopicExercisesView";
import {
  canAccessVocabularyCategory,
  getVocabularyCategoryDisplayIndex,
} from "@/lib/vocabularyAccess";
import { generateVocabularyExercises } from "@/lib/vocabulary/generateExercises";
import { useKnownVocabularyWordsQuery } from "@/store/api";

type VocabularyCategoryViewProps = {
  categoryId: string;
  words: VocabularyWord[];
  initialTab?: VocabularyCategoryTab;
};

export function VocabularyCategoryView({
  categoryId,
  words,
  initialTab = "words",
}: VocabularyCategoryViewProps) {
  const t = useTranslations("Vocabulary");
  const [tab, setTab] = useState<VocabularyCategoryTab>(initialTab);
  const {
    data: knownWords,
    isLoading,
    isError,
  } = useKnownVocabularyWordsQuery();

  const knownWordIds = useMemo(
    () => new Set((knownWords?.words ?? []).map((word) => word.id)),
    [knownWords],
  );

  const unlocked = canAccessVocabularyCategory(categoryId, knownWordIds);

  const exercises = useMemo(
    () => generateVocabularyExercises(words, categoryId),
    [words, categoryId],
  );

  if (isLoading) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("statusLoading")}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400" role="alert">
        {t("statusError")}
      </p>
    );
  }

  if (!unlocked) {
    return (
      <VocabularyCategoryLocked
        index={getVocabularyCategoryDisplayIndex(categoryId)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <VocabularyCategoryTabs activeTab={tab} onChange={setTab} />

      {tab === "words" ? (
        <VocabularyWordList categoryId={categoryId} words={words} />
      ) : (
        <TopicExercisesView exercises={exercises} />
      )}
    </div>
  );
}
