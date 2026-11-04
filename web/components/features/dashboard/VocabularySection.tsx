"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { VocabularyCategoryCard } from "@/components/features/dashboard/VocabularyCategoryCard";
import { VocabularyLearnQuotaBanner } from "@/components/features/vocabulary/VocabularyLearnQuotaBanner";
import { vocabularyCategories } from "@/data/vocabulary";
import {
  ACTIVE_VOCABULARY_WINDOW,
  canAccessVocabularyCategory,
} from "@/lib/vocabularyAccess";
import {
  LEARN_WORD_PERIOD_LIMIT,
  VOCABULARY_QUIZ_CYCLE_DAYS,
  VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
} from "@/lib/vocabularyLimits";
import { useKnownVocabularyWordsQuery } from "@/store/api";

export function VocabularySection() {
  const t = useTranslations("Dashboard");
  const { data: knownWords } = useKnownVocabularyWordsQuery();

  const knownWordIds = useMemo(
    () => new Set((knownWords?.words ?? []).map((word) => word.id)),
    [knownWords],
  );

  return (
    <section
      id="kelime"
      aria-labelledby="vocabulary-heading"
      className="space-y-4"
    >
      <div>
        <h1
          id="vocabulary-heading"
          className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
        >
          {t("vocabularyTitle")}
        </h1>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          {t("vocabularySubtitle", {
            limit: LEARN_WORD_PERIOD_LIMIT,
            window: ACTIVE_VOCABULARY_WINDOW,
            quizDays: VOCABULARY_QUIZ_CYCLE_DAYS,
            quizTarget: VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
          })}
        </p>
      </div>

      <VocabularyLearnQuotaBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {vocabularyCategories.map((category, index) => (
          <VocabularyCategoryCard
            key={category.id}
            category={category}
            index={index + 1}
            locked={!canAccessVocabularyCategory(category.id, knownWordIds)}
          />
        ))}
      </div>
    </section>
  );
}
