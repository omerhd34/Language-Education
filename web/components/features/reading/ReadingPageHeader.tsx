"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import type { ReadingLevel } from "@/data/readings/types";
import { ReadingSectionPassStatus } from "@/components/features/reading/ReadingSectionPassStatus";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type ReadingPageHeaderProps = {
  title: string;
  titleEn: string;
  level: ReadingLevel;
  index: number;
  sectionId: string;
};

export function ReadingPageHeader({
  title,
  titleEn,
  level,
  index,
  sectionId,
}: ReadingPageHeaderProps) {
  const t = useTranslations("Reading");
  const englishTitle = getDistinctSecondaryTitle(title, titleEn);

  return (
    <header className="space-y-4">
      <ButtonLink href="/panel#reading" variant="outline" size="sm">
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToReading")}
      </ButtonLink>

      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex w-fit rounded-md bg-zinc-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase dark:bg-zinc-400/15 dark:text-zinc-300">
          {t("sectionLabel", { index })}
        </p>
        <p
          className={cn(
            "inline-flex w-fit rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide uppercase",
            getCefrLevelBadgeClass(level),
          )}
        >
          {level}
        </p>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <h1 className="page-title">{title}</h1>
          {englishTitle ? (
            <p className="text-base font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
              {englishTitle}
            </p>
          ) : null}
        </div>
        <ReadingSectionPassStatus sectionId={sectionId} />
      </div>
    </header>
  );
}
