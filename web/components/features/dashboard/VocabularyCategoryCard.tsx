"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { VocabularyCategory } from "@/data/vocabulary";
import { cn } from "@/lib/utils";

type VocabularyCategoryCardProps = {
  category: VocabularyCategory;
  index: number;
  locked?: boolean;
};

export function VocabularyCategoryCard({
  category,
  index,
  locked = false,
}: VocabularyCategoryCardProps) {
  const t = useTranslations("Dashboard");
  const wordCount = category.words.length;

  return (
    <article
      className={cn(
        "dashboard-panel flex h-full flex-col",
        locked && "opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="inline-flex w-fit rounded-md bg-zinc-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase dark:bg-zinc-400/15 dark:text-zinc-300">
            {t("vocabularyCategoryLabel", { index })}
          </p>
          {locked ? (
            <p className="inline-flex w-fit items-center gap-1 rounded-md bg-brand-600/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-300">
              <Lock className="size-3" aria-hidden />
              {t("locked")}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-sm text-brand-600 dark:text-brand-400">
          {t("vocabularyWordCount", { count: wordCount })}
        </p>
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {category.title}
      </h3>
      <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        {locked ? (
          <>
            <Button
              type="button"
              size="sm"
              disabled
              className="w-full sm:flex-1"
            >
              {t("vocabularyOpenCategory")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled
              className="w-full sm:flex-1"
            >
              {t("vocabularyOpenExercises")}
            </Button>
          </>
        ) : (
          <>
            <ButtonLink
              href={`/panelim/kelime/${category.id}`}
              size="sm"
              className="w-full sm:flex-1"
            >
              {t("vocabularyOpenCategory")}
            </ButtonLink>
            <ButtonLink
              href={`/panelim/kelime/${category.id}?tab=exercises`}
              size="sm"
              variant="outline"
              className="w-full sm:flex-1"
            >
              {t("vocabularyOpenExercises")}
            </ButtonLink>
          </>
        )}
      </div>
    </article>
  );
}
