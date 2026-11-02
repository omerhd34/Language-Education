"use client";

import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { VocabularyCategory } from "@/data/vocabulary";

type VocabularyCategoryCardProps = {
  category: VocabularyCategory;
  index: number;
};

export function VocabularyCategoryCard({
  category,
  index,
}: VocabularyCategoryCardProps) {
  const t = useTranslations("Dashboard");
  const wordCount = category.words.length;

  return (
    <article className="dashboard-panel flex h-full flex-col">
      <p className="inline-flex w-fit rounded-md bg-zinc-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase dark:bg-zinc-400/15 dark:text-zinc-300">
        {t("vocabularyCategoryLabel", { index })}
      </p>
      <h3 className="mt-3 font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {category.title}
      </h3>
      <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">
        {t("vocabularyWordCount", { count: wordCount })}
      </p>
      <div className="mt-auto pt-6">
        <ButtonLink
          href={`/panelim/kelime/${category.id}`}
          size="sm"
          className="w-full"
        >
          {t("vocabularyOpenCategory")}
        </ButtonLink>
      </div>
    </article>
  );
}
