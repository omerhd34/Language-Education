"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  useKnownVocabularyWordsQuery,
  useStudiedTodayVocabularyWordsQuery,
  useVocabularyQuizQuery,
} from "@/store/api";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { KnownWordsByCategory } from "@/components/features/dashboard/KnownWordsByCategory";
import { StudiedTodayWords } from "@/components/features/dashboard/StudiedTodayWords";
import { StudyTimerPendingNotice } from "@/components/features/vocabulary/StartStudyTimerButton";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { VOCABULARY_QUIZ_CYCLE_DAYS } from "@/lib/vocabularyLimits";

export function ProgressSection() {
  const t = useTranslations("Dashboard");
  const { data, isLoading, isError } = useKnownVocabularyWordsQuery();
  const {
    data: studied,
    isLoading: studiedLoading,
    isError: studiedError,
    refetch: refetchStudied,
  } = useStudiedTodayVocabularyWordsQuery();
  const { data: quiz, refetch: refetchQuiz } = useVocabularyQuizQuery();
  const dueCount = quiz?.dueCount ?? 0;
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
    <section
      id="ilerleme"
      aria-labelledby="progress-heading"
      className="space-y-8"
    >
      <div>
        <h1
          id="progress-heading"
          className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
        >
          {t("progressTitle")}
        </h1>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          {t("progressSubtitle")}
        </p>
      </div>

      {dueCount > 0 ? (
        <article className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-500/25 bg-sky-500/8 px-4 py-4 dark:border-sky-400/20 dark:bg-sky-400/10">
          <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
            {t("quizCardReady", { count: dueCount })}
          </p>
          <ButtonLink href="/panel/kelime/sinav" size="sm">
            {t("quizCardCta")}
          </ButtonLink>
        </article>
      ) : null}

      <StudyTimerPendingNotice />

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
              {t("studiedTodayTitle")}
            </h2>
            <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
              {t("studiedTodaySubtitle", { days: VOCABULARY_QUIZ_CYCLE_DAYS })}
            </p>
          </div>
          {studied ? (
            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
              {t("studiedTodayCount", { count: studied.count })}
            </p>
          ) : null}
        </div>

        {studiedLoading ? (
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("studiedTodayLoading")}
          </p>
        ) : null}

        {studiedError ? (
          <p className="text-sm text-destructive" role="alert">
            {t("studiedTodayError")}
          </p>
        ) : null}

        {!studiedLoading &&
        !studiedError &&
        studied &&
        studied.words.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-300/80 px-4 py-8 text-center dark:border-brand-700">
            <p className="text-sm text-brand-600 dark:text-brand-400">
              {t("studiedTodayEmpty")}
            </p>
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => navigatePanelSection("kelimeler")}
              >
                {t("knownWordsBrowseCta")}
              </Button>
            </div>
          </div>
        ) : null}

        {studied && studied.words.length > 0 ? (
          <StudiedTodayWords words={studied.words} />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
              {t("knownWordsTitle")}
            </h2>
            <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
              {t("knownWordsSubtitle")}
            </p>
          </div>
          {data ? (
            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
              {t("knownWordsCount", { count: data.count })}
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("knownWordsLoading")}
          </p>
        ) : null}

        {isError ? (
          <p className="text-sm text-destructive" role="alert">
            {t("knownWordsError")}
          </p>
        ) : null}

        {!isLoading && !isError && data && data.words.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-300/80 px-4 py-8 text-center dark:border-brand-700">
            <p className="text-sm text-brand-600 dark:text-brand-400">
              {t("knownWordsEmpty")}
            </p>
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => navigatePanelSection("kelimeler")}
              >
                {t("knownWordsBrowseCta")}
              </Button>
            </div>
          </div>
        ) : null}

        {data && data.words.length > 0 ? (
          <KnownWordsByCategory words={data.words} />
        ) : null}
      </div>
    </section>
  );
}
