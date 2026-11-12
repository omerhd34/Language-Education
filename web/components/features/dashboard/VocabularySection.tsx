"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { LevelLockedDialog } from "@/components/features/dashboard/LevelLockedDialog";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { VocabularyCategoryCard } from "@/components/features/dashboard/VocabularyCategoryCard";
import { VocabularyLearnQuotaBanner } from "@/components/features/vocabulary/VocabularyLearnQuotaBanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  VOCABULARY_LEVEL_ORDER,
  getVocabularyCategoriesByLevel,
  type VocabularyLevel,
} from "@/data/vocabulary";
import type { CefrLevel } from "@/data/grammar/dashboardTopics";
import {
  canAccessVocabularyCategory,
  canAccessVocabularyLevel,
  getRequiredVocabularyLevelToUnlock,
} from "@/lib/vocabularyAccess";
import { useKnownVocabularyWordsQuery } from "@/store/api";

export function VocabularySection() {
  const t = useTranslations("Dashboard");
  const [selectedLevel, setSelectedLevel] = useState<VocabularyLevel>("A1");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);
  const { data: knownWords } = useKnownVocabularyWordsQuery();

  const knownWordIds = useMemo(
    () => new Set((knownWords?.words ?? []).map((word) => word.id)),
    [knownWords],
  );

  const categories = getVocabularyCategoriesByLevel(selectedLevel);
  const levelUnlocked = canAccessVocabularyLevel(selectedLevel, knownWordIds);
  const requiredLevel = getRequiredVocabularyLevelToUnlock(selectedLevel);

  function handleLevelChange(level: CefrLevel) {
    setSelectedLevel(level);

    if (!canAccessVocabularyLevel(level, knownWordIds)) {
      setLockDialogOpen(true);
      return;
    }

    setLockDialogOpen(false);
  }

  return (
    <section aria-labelledby="vocabulary-heading" className="space-y-4">
      <div>
        <h1 id="vocabulary-heading" className="page-title">
          {t("vocabularyTitle")}
        </h1>
        <p className="page-subtitle max-w-none">{t("vocabularySubtitle")}</p>
      </div>

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        levels={VOCABULARY_LEVEL_ORDER}
        isUnlocked={(level) => canAccessVocabularyLevel(level, knownWordIds)}
      />

      <VocabularyLearnQuotaBanner />

      {categories.length === 0 ? (
        <Alert>
          <AlertTitle>
            {t("vocabularyLevelEmptyTitle", { level: selectedLevel })}
          </AlertTitle>
          <AlertDescription>
            {t("vocabularyLevelEmpty", { level: selectedLevel })}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <VocabularyCategoryCard
              key={category.id}
              category={category}
              index={index + 1}
              knownWordIds={knownWordIds}
              locked={
                !levelUnlocked ||
                !canAccessVocabularyCategory(category.id, knownWordIds)
              }
            />
          ))}
        </div>
      )}

      <LevelLockedDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        title={t("vocabularyLevelLockedTitle", { level: selectedLevel })}
        description={
          requiredLevel
            ? t("vocabularyLevelLockedHint", {
                level: selectedLevel,
                requiredLevel,
              })
            : null
        }
        ctaLabel={t("vocabularyLevelLockedCta")}
      />
    </section>
  );
}
