"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { VocabularyWord } from "@/data/vocabulary";
import { useRouter } from "@/i18n/navigation";
import {
  VocabularyCategoryTabs,
  type VocabularyCategoryTab,
} from "@/components/features/vocabulary/VocabularyCategoryTabs";
import { VocabularyCategoryLocked } from "@/components/features/vocabulary/VocabularyCategoryLocked";
import { VocabularyWordList } from "@/components/features/vocabulary/VocabularyWordList";
import { TopicExercisesView } from "@/components/features/topics/TopicExercisesView";
import {
  canAccessVocabularyCategory,
  canAccessVocabularyLevel,
  getRequiredVocabularyLevelToUnlock,
  getVocabularyCategoryDisplayIndex,
  getVocabularyCategoryLevel,
} from "@/lib/vocabularyAccess";
import { generateVocabularyExercises } from "@/lib/vocabulary/generateExercises";
import { vocabularyExerciseProgressKey } from "@/lib/vocabularySectionProgress";
import { useKnownVocabularyWordsQuery } from "@/store/api";

type VocabularyCategoryViewProps = {
  categoryId: string;
  words: VocabularyWord[];
};

export function VocabularyCategoryView({
  categoryId,
  words,
}: VocabularyCategoryViewProps) {
  const t = useTranslations("Vocabulary");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab: VocabularyCategoryTab =
    searchParams.get("tab") === "exercises" ? "exercises" : "words";

  function handleTabChange(next: VocabularyCategoryTab) {
    if (next === tab) {
      return;
    }

    router.replace(
      next === "exercises"
        ? `/panel/kelime/${categoryId}?tab=exercises`
        : `/panel/kelime/${categoryId}`,
      { scroll: false },
    );
  }
  const {
    data: knownWords,
    isLoading,
    isError,
  } = useKnownVocabularyWordsQuery();

  const knownWordIds = useMemo(
    () => new Set((knownWords?.words ?? []).map((word) => word.id)),
    [knownWords],
  );

  const level = getVocabularyCategoryLevel(categoryId);
  const levelUnlocked = level
    ? canAccessVocabularyLevel(level, knownWordIds)
    : false;
  const unlocked = canAccessVocabularyCategory(categoryId, knownWordIds);
  const requiredLevel = level
    ? getRequiredVocabularyLevelToUnlock(level)
    : null;

  const exercises = useMemo(
    () => generateVocabularyExercises(words, categoryId),
    [words, categoryId],
  );

  if (isLoading && !knownWords) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("statusLoading")}
      </p>
    );
  }

  if (isError && !knownWords) {
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
        reason={!levelUnlocked ? "level" : "window"}
        level={level}
        requiredLevel={requiredLevel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <VocabularyCategoryTabs activeTab={tab} onChange={handleTabChange} />

      {tab === "words" ? (
        <VocabularyWordList categoryId={categoryId} words={words} />
      ) : (
        <TopicExercisesView
          progressKey={vocabularyExerciseProgressKey(categoryId)}
          exercises={exercises}
        />
      )}
    </div>
  );
}
