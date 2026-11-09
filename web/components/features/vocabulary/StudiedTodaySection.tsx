"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ClipboardCheck } from "lucide-react";
import {
  StudiedTodayWords,
  type StudiedTodayListWord,
} from "@/components/features/dashboard/StudiedTodayWords";
import { ActiveStudyTimerNotice } from "@/components/features/vocabulary/CancelStudyTimerButton";
import { StudyTimerPendingNotice } from "@/components/features/vocabulary/StartStudyTimerButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";
import { getVocabularyWordById } from "@/data/vocabulary";
import {
  useStudiedTodayVocabularyWordsQuery,
  useVocabularyLearnQuotaQuery,
  useVocabularyQuizQuery,
} from "@/store/api";

export function StudiedTodaySection() {
  const t = useTranslations("Dashboard");
  const {
    data: studied,
    isLoading,
    isError,
    refetch: refetchStudied,
  } = useStudiedTodayVocabularyWordsQuery();
  const { data: quiz, refetch: refetchQuiz } = useVocabularyQuizQuery();
  const { data: quota } = useVocabularyLearnQuotaQuery();
  const pendingWords = useMemo(() => {
    const words: StudiedTodayListWord[] = [];
    for (const wordId of quota?.pendingStudyWordIds ?? []) {
      const found = getVocabularyWordById(wordId);
      if (!found) {
        continue;
      }
      words.push({
        id: found.word.id,
        en: found.word.en,
        tr: found.word.tr,
        categoryId: found.category.id,
        categoryTitle: found.category.title,
      });
    }
    return words;
  }, [quota?.pendingStudyWordIds]);
  const dueWords = useMemo(() => {
    const words: StudiedTodayListWord[] = [];
    for (const word of quiz?.words ?? []) {
      const found = getVocabularyWordById(word.id);
      if (!found) {
        continue;
      }
      words.push({
        id: found.word.id,
        en: found.word.en,
        tr: found.word.tr,
        categoryId: found.category.id,
        categoryTitle: found.category.title,
        examReady: true,
      });
    }
    return words;
  }, [quiz?.words]);
  const visibleWords = useMemo(() => {
    const byId = new Map<string, StudiedTodayListWord>();
    for (const word of dueWords) {
      byId.set(word.id, word);
    }
    for (const word of studied?.words ?? []) {
      if (!byId.has(word.id)) {
        byId.set(word.id, word);
      }
    }
    for (const word of pendingWords) {
      if (!byId.has(word.id)) {
        byId.set(word.id, word);
      }
    }
    return [...byId.values()];
  }, [dueWords, pendingWords, studied?.words]);
  const dueCount = quiz?.dueCount ?? dueWords.length;
  const nextStudiedDueAt = useMemo(() => {
    const words = studied?.words ?? [];
    if (words.length === 0) {
      return null;
    }
    return words.reduce(
      (earliest, word) => (word.dueAt < earliest ? word.dueAt : earliest),
      words[0]!.dueAt,
    );
  }, [studied?.words]);
  const refreshedDueAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (!nextStudiedDueAt) {
      return;
    }

    const remaining = Math.max(0, Date.parse(nextStudiedDueAt) - Date.now());
    if (remaining === 0) {
      if (refreshedDueAtRef.current === nextStudiedDueAt) {
        return;
      }
      refreshedDueAtRef.current = nextStudiedDueAt;
      void refetchStudied();
      void refetchQuiz();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refreshedDueAtRef.current = nextStudiedDueAt;
      void refetchStudied();
      void refetchQuiz();
    }, remaining + 250);

    return () => window.clearTimeout(timeoutId);
  }, [nextStudiedDueAt, refetchQuiz, refetchStudied]);

  const showPendingCard = pendingWords.length > 0;
  const showQuizCard = dueCount > 0;
  const showStatusRow = studied && (showPendingCard || showQuizCard);
  const bothInRow = showPendingCard && showQuizCard;
  const rowChildWidth = cn(
    "min-w-0",
    bothInRow ? "min-w-0 flex-1 basis-0" : "w-full flex-1",
  );

  return (
    <section aria-labelledby="studied-today-heading" className="space-y-4">
      <div>
        <h1 id="studied-today-heading" className="page-title">
          {t("studiedTodayTitle")}
        </h1>
        <p className="page-subtitle">{t("studiedTodaySubtitle")}</p>
      </div>

      {showStatusRow ? (
        <div className="space-y-3">
          <ActiveStudyTimerNotice />
          <div className="flex flex-row items-stretch gap-3">
            {showPendingCard ? (
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
                  {t("quizCardReady", { count: dueCount })}
                </p>
                <ButtonLink
                  href="/panel/kelime/sinav"
                  size="sm"
                  className="shrink-0"
                >
                  <ClipboardCheck className="size-3.5" aria-hidden />
                  {t("quizCardCta")}
                </ButtonLink>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <ActiveStudyTimerNotice />
      )}

      {isLoading ? (
        <p className="page-subtitle mt-0">{t("studiedTodayLoading")}</p>
      ) : null}

      {isError ? (
        <p className="text-sm text-destructive" role="alert">
          {t("studiedTodayError")}
        </p>
      ) : null}

      {!isLoading && !isError && studied && visibleWords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-300/80 px-4 py-8 text-center dark:border-brand-700">
          <p className="page-subtitle mt-0">{t("studiedTodayEmpty")}</p>
          <ButtonLink href="/panel#kelimeler" size="sm" className="mt-4">
            {t("studiedTodayAddWords")}
          </ButtonLink>
        </div>
      ) : null}

      {visibleWords.length > 0 ? (
        <StudiedTodayWords words={visibleWords} />
      ) : null}
    </section>
  );
}
