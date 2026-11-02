"use client";

import { useTranslations } from "next-intl";
import { Layers, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { CombinedExercise } from "@/data/combinedExercises";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type CombinedExerciseCardProps = {
  combined: CombinedExercise;
  locked?: boolean;
};

export function CombinedExerciseCard({
  combined,
  locked = false,
}: CombinedExerciseCardProps) {
  const t = useTranslations("Dashboard");
  const topicTitles = combined.topics.map((topic) => topic.title).join(" · ");

  return (
    <article
      className={cn(
        "dashboard-panel flex h-full flex-col border-amber-400/45 bg-amber-100/90 dark:border-amber-500/35 dark:bg-amber-950/55",
        locked && "opacity-75",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex w-fit items-center gap-1 rounded-md bg-amber-500/20 px-2 py-1 text-[11px] font-semibold tracking-wide text-amber-900 uppercase dark:bg-amber-400/20 dark:text-amber-200">
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
        {locked ? (
          <p className="inline-flex w-fit items-center gap-1 rounded-md bg-brand-600/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-300">
            <Lock className="size-3" aria-hidden />
            {t("locked")}
          </p>
        ) : null}
      </div>

      <h3 className="mt-3 font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {t("combinedExerciseTitle")}
      </h3>
      <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">
        {t("combinedExerciseSubtitle", {
          count: combined.topics.length,
          topics: topicTitles,
        })}
      </p>

      <div className="my-6 flex flex-1 items-center justify-center">
        <div className="flex size-28 items-center justify-center rounded-full border border-amber-500/35 bg-amber-500/15 dark:border-amber-400/35 dark:bg-amber-400/15">
          <Layers
            className="size-10 text-amber-700 dark:text-amber-300"
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-auto">
        {locked ? (
          <Button type="button" size="sm" disabled className="w-full">
            {t("combinedExerciseCta")}
          </Button>
        ) : (
          <ButtonLink
            href={`/panelim/konular/birlesik/${combined.id}`}
            size="sm"
            className="w-full"
          >
            {t("combinedExerciseCta")}
          </ButtonLink>
        )}
      </div>
    </article>
  );
}
