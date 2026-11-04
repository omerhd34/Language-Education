/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, Check } from "lucide-react";
import type { KnownVocabularyWord } from "@/store/api";
import { useSetVocabularyWordStatusMutation } from "@/store/api";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useVocabularyLearnLimitReached } from "@/components/features/vocabulary/VocabularyLearnQuotaBanner";
import { cn } from "@/lib/utils";

type KnownWordRowProps = {
  word: KnownVocabularyWord;
  compact?: boolean;
};

const lockedButtonClassName =
  "cursor-not-allowed border-brand-200 bg-brand-100/80 text-brand-400 opacity-100 hover:bg-brand-100/80 hover:text-brand-400 dark:border-brand-800 dark:bg-brand-900/70 dark:text-brand-500 dark:hover:bg-brand-900/70";

export function KnownWordRow({ word, compact = false }: KnownWordRowProps) {
  const t = useTranslations("Dashboard");
  const [setStatus, { isLoading }] = useSetVocabularyWordStatusMutation();
  const learnLimitReached = useVocabularyLearnLimitReached();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const quotaLocked = mounted && learnLimitReached;
  const relearnDisabled = isLoading || quotaLocked;

  async function handleRelearn() {
    if (relearnDisabled) {
      return;
    }
    try {
      await setStatus({
        categoryId: word.categoryId,
        wordId: word.id,
        status: "LEARNING",
      }).unwrap();
    } catch {}
  }

  return (
    <article className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/6 px-3 py-2.5 dark:border-emerald-400/15 dark:bg-emerald-400/8">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-semibold tracking-tight text-brand-950 dark:text-brand-100">
            {word.en}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-200">
            <Check className="size-3" aria-hidden />
            {t("knownWordsBadge")}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-brand-600 dark:text-brand-400">
          {word.tr}
        </p>
        {!compact ? (
          <p className="mt-1 text-xs text-brand-500 dark:text-brand-400">
            {word.categoryTitle}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={relearnDisabled}
          title={
            quotaLocked ? t("knownWordsRelearnLocked") : t("knownWordsRelearn")
          }
          className={cn(quotaLocked && lockedButtonClassName)}
          onClick={() => {
            void handleRelearn();
          }}
        >
          <BookOpen className="size-3.5" aria-hidden />
          {t("knownWordsRelearn")}
        </Button>
        <ButtonLink
          href={`/panelim/kelime/${word.categoryId}`}
          size="sm"
          variant="outline"
        >
          {t("knownWordsOpenCategory")}
        </ButtonLink>
      </div>
    </article>
  );
}
