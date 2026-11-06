"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { VocabularyCategoryCard } from "@/components/features/dashboard/VocabularyCategoryCard";
import { VocabularyLearnQuotaBanner } from "@/components/features/vocabulary/VocabularyLearnQuotaBanner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  VOCABULARY_LEVEL_ORDER,
  getVocabularyCategoriesByLevel,
  type VocabularyLevel,
} from "@/data/vocabulary";
import type { CefrLevel } from "@/data/dashboardTopics";
import {
  ACTIVE_VOCABULARY_WINDOW,
  canAccessVocabularyCategory,
  canAccessVocabularyLevel,
  getRequiredVocabularyLevelToUnlock,
} from "@/lib/vocabularyAccess";
import {
  LEARN_WORD_PERIOD_LIMIT,
  VOCABULARY_QUIZ_CYCLE_DAYS,
  VOCABULARY_QUIZ_CYCLE_WORD_TARGET,
} from "@/lib/vocabularyLimits";
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
    if (level === "Başlangıç") {
      return;
    }

    setSelectedLevel(level);

    if (!canAccessVocabularyLevel(level, knownWordIds)) {
      setLockDialogOpen(true);
      return;
    }

    setLockDialogOpen(false);
  }

  return (
    <section
      id="kelimeler"
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

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        levels={VOCABULARY_LEVEL_ORDER}
        isUnlocked={(level) => {
          if (level === "Başlangıç") {
            return false;
          }
          return canAccessVocabularyLevel(level, knownWordIds);
        }}
      />

      <VocabularyLearnQuotaBanner />

      {categories.length === 0 ? (
        <Alert>
          <AlertTitle>{t("vocabularyLevelEmptyTitle", { level: selectedLevel })}</AlertTitle>
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
              locked={
                !levelUnlocked ||
                !canAccessVocabularyCategory(category.id, knownWordIds)
              }
            />
          ))}
        </div>
      )}

      <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center sm:items-center sm:text-center">
            <span className="mx-auto mb-1 flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
              <Lock className="size-5" aria-hidden />
            </span>
            <DialogTitle>
              {t("vocabularyLevelLockedTitle", { level: selectedLevel })}
            </DialogTitle>
            <DialogDescription>
              {requiredLevel
                ? t("vocabularyLevelLockedHint", {
                    level: selectedLevel,
                    requiredLevel,
                  })
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <DialogClose
              render={<Button className="w-full sm:w-auto" />}
            >
              {t("vocabularyLevelLockedCta")}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
