"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  StudiedTodayWords,
  type StudiedTodayListWord,
} from "@/components/features/dashboard/StudiedTodayWords";
import { CancelStudyTimerButton } from "@/components/features/vocabulary/CancelStudyTimerButton";
import { StudyTimerPendingNotice } from "@/components/features/vocabulary/StartStudyTimerButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
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

  return (
    <section aria-labelledby="studied-today-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1
            id="studied-today-heading"
            className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
          >
            {t("studiedTodayTitle")}
          </h1>
          <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
            {t("studiedTodaySubtitle")}
          </p>
        </div>
        {studied ? (
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {dueCount > 0 ? (
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {t("quizCardReady", { count: dueCount })}
              </p>
            ) : null}
            {studied.count > 0 ? (
              <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                {t("studiedTodayCount", { count: studied.count })}
              </p>
            ) : null}
            {pendingWords.length > 0 ? (
              <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
                {t("studiedTodayPendingCount", {
                  count: pendingWords.length,
                })}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {dueCount > 0 ? (
                <ButtonLink href="/panel/kelime/sinav" size="sm">
                  {t("quizCardCta")}
                </ButtonLink>
              ) : null}
              <CancelStudyTimerButton />
            </div>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("studiedTodayLoading")}
        </p>
      ) : null}

      {isError ? (
        <p className="text-sm text-destructive" role="alert">
          {t("studiedTodayError")}
        </p>
      ) : null}

      <StudyTimerPendingNotice />

      {!isLoading &&
      !isError &&
      studied &&
      visibleWords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-300/80 px-4 py-8 text-center dark:border-brand-700">
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("studiedTodayEmpty")}
          </p>
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
