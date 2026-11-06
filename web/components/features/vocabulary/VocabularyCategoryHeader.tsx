"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";

type VocabularyCategoryHeaderProps = {
  title: string;
  titleEn?: string;
  index: number;
  wordCount: number;
};

export function VocabularyCategoryHeader({
  title,
  titleEn,
  index,
  wordCount,
}: VocabularyCategoryHeaderProps) {
  const t = useTranslations("Vocabulary");
  const secondaryTitle = getDistinctSecondaryTitle(title, titleEn);

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink href="/panel#kelimeler" variant="outline" size="sm">
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToVocabulary")}
        </ButtonLink>

        <Badge variant="secondary">{t("categoryLabel", { index })}</Badge>
      </div>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl dark:text-brand-100">
          {title}
        </h1>
        {secondaryTitle ? (
          <p className="text-base font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
            {secondaryTitle}
          </p>
        ) : null}
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("wordCount", { count: wordCount })}
        </p>
      </div>
    </header>
  );
}
