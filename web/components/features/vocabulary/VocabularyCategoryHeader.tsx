"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

type VocabularyCategoryHeaderProps = {
  title: string;
  index: number;
  wordCount: number;
};

export function VocabularyCategoryHeader({
  title,
  index,
  wordCount,
}: VocabularyCategoryHeaderProps) {
  const t = useTranslations("Vocabulary");

  return (
    <header className="space-y-4">
      <ButtonLink href="/panelim#kelime" variant="outline" size="sm">
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToVocabulary")}
      </ButtonLink>

      <p className="inline-flex w-fit rounded-md bg-zinc-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase dark:bg-zinc-400/15 dark:text-zinc-300">
        {t("categoryLabel", { index })}
      </p>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl dark:text-brand-100">
          {title}
        </h1>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("wordCount", { count: wordCount })}
        </p>
      </div>
    </header>
  );
}
