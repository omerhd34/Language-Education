"use client";

import { useTranslations } from "next-intl";
import { ClipboardCheck } from "lucide-react";
import {
  useKnownVocabularyWordsQuery,
  useVocabularyQuizQuery,
} from "@/store/api";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { KnownWordsByCategory } from "@/components/features/dashboard/KnownWordsByCategory";
import { ProgressResetPanel } from "@/components/features/dashboard/ProgressResetPanel";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { useCountdown } from "@/hooks/useCountdown";
import { useLastVocabularyQuizResult } from "@/hooks/useLastVocabularyQuizResult";
import { formatDurationHms } from "@/lib/formatDuration";

export function ProgressSection() {
  const t = useTranslations("Dashboard");
  const { data, isLoading, isError } = useKnownVocabularyWordsQuery();
  const {
    data: quiz,
    isLoading: quizLoading,
    isError: quizError,
  } = useVocabularyQuizQuery();
  const lastQuizResult = useLastVocabularyQuizResult();
  const remainingMs = useCountdown(quiz?.nextDueAt);
  const dueCount = quiz?.dueCount ?? 0;

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

      <div className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
            {t("quizSectionTitle")}
          </h2>
          <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
            {t("quizSectionSubtitle")}
          </p>
        </div>

        {quizLoading ? (
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("quizSectionLoading")}
          </p>
        ) : null}

        {quizError ? (
          <p className="text-sm text-destructive" role="alert">
            {t("quizSectionError")}
          </p>
        ) : null}

        {!quizLoading && !quizError ? (
          <article className="rounded-2xl border border-sky-500/25 bg-sky-500/8 px-4 py-4 dark:border-sky-400/20 dark:bg-sky-400/10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <ClipboardCheck
                    className="size-4 text-sky-700 dark:text-sky-300"
                    aria-hidden
                  />
                  <h3 className="font-display text-lg font-semibold text-brand-950 dark:text-brand-100">
                    {t("quizCardTitle")}
                  </h3>
                </div>
                {dueCount > 0 ? (
                  <p className="text-sm text-brand-600 dark:text-brand-400">
                    {t("quizCardReady", { count: dueCount })}
                  </p>
                ) : (
                  <p className="text-sm text-brand-600 dark:text-brand-400">
                    {t("quizCardWaiting")}
                  </p>
                )}
                {dueCount === 0 && quiz?.nextDueAt && remainingMs > 0 ? (
                  <p className="font-mono text-sm font-semibold tabular-nums text-amber-800 dark:text-amber-200">
                    {t("quizCardCountdown", {
                      time: formatDurationHms(remainingMs),
                    })}
                  </p>
                ) : null}
                {lastQuizResult ? (
                  <p className="text-xs text-brand-500 dark:text-brand-400">
                    {t("quizLastResultInline", {
                      score: lastQuizResult.score,
                      correct: lastQuizResult.correct,
                      total: lastQuizResult.total,
                    })}
                  </p>
                ) : null}
              </div>

              {dueCount > 0 ? (
                <ButtonLink href="/panelim/kelime/sinav" size="sm">
                  {t("quizCardCta")}
                </ButtonLink>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => navigatePanelSection("kelime")}
                >
                  {t("knownWordsBrowseCta")}
                </Button>
              )}
            </div>
          </article>
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
                onClick={() => navigatePanelSection("kelime")}
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

      <ProgressResetPanel />
    </section>
  );
}
