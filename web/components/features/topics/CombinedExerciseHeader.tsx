"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, Layers } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { CombinedExercise } from "@/data/combinedExercises";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type CombinedExerciseHeaderProps = {
  combined: CombinedExercise;
};

export function CombinedExerciseHeader({
  combined,
}: CombinedExerciseHeaderProps) {
  const t = useTranslations("Topic");

  return (
    <header className="space-y-4">
      <ButtonLink href="/panel#grammer" variant="outline" size="sm">
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToTopics")}
      </ButtonLink>

      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex w-fit items-center gap-1 rounded-md bg-sky-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-sky-800 uppercase dark:bg-sky-400/20 dark:text-sky-200">
          <Layers className="size-3" aria-hidden />
          {t("combinedExerciseLabel", { index: combined.index })}
        </p>
        <p
          className={cn(
            "inline-flex w-fit rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide uppercase",
            getCefrLevelBadgeClass(combined.level),
          )}
        >
          {combined.level}
        </p>
      </div>

      <div className="space-y-2">
        <h1 className="page-title">{t("combinedExerciseTitle")}</h1>
        <p className="max-w-3xl text-sm text-brand-600 dark:text-brand-400">
          {t("combinedExerciseSubtitle", {
            count: combined.topics.length,
          })}
        </p>
      </div>
    </header>
  );
}
