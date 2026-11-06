"use client";

import { useTranslations } from "next-intl";
import { KnownWordsByCategory } from "@/components/features/dashboard/KnownWordsByCategory";
import { useKnownVocabularyWordsQuery } from "@/store/api";

export function KnownWordsSection() {
  const t = useTranslations("Dashboard");
  const { data, isLoading, isError } = useKnownVocabularyWordsQuery();

  return (
    <section aria-labelledby="known-words-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1
            id="known-words-heading"
            className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
          >
            {t("knownWordsTitle")}
          </h1>
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
        </div>
      ) : null}

      {data && data.words.length > 0 ? (
        <KnownWordsByCategory words={data.words} />
      ) : null}
    </section>
  );
}
