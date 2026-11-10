"use client";

import { useTranslations } from "next-intl";
import { BookOpen, Lock, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { VocabularyCategory } from "@/data/vocabulary";
import { useVocabularySectionPercent } from "@/hooks/useVocabularySectionPercent";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { cn } from "@/lib/utils";

type VocabularyCategoryCardProps = {
  category: VocabularyCategory;
  index: number;
  knownWordIds: ReadonlySet<string>;
  locked?: boolean;
};

export function VocabularyCategoryCard({
  category,
  index,
  knownWordIds,
  locked = false,
}: VocabularyCategoryCardProps) {
  const t = useTranslations("Dashboard");
  const titleEn = getDistinctSecondaryTitle(category.title, category.titleEn);
  const percent = useVocabularySectionPercent(category, knownWordIds);

  return (
    <div
      className={cn(
        "relative h-full rounded-2xl",
        "[--progress-track:#dce3ef] dark:[--progress-track:#303d59]",
        locked && "opacity-70",
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={t("vocabularyProgressAria", { progress: percent })}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl ring-[3px] ring-(--progress-track) ring-inset"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-[background] duration-500 ease-out"
        style={{
          padding: 3,
          background: `conic-gradient(from -90deg, #0ea5e9 ${percent}%, transparent 0)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <Card className="relative h-full gap-2">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {t("vocabularyCategoryLabel", { index })}
              </Badge>
              {locked ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300"
                >
                  <Lock className="size-3" aria-hidden />
                  {t("locked")}
                </Badge>
              ) : null}
            </div>
            <Badge variant="outline" className="shrink-0 tabular-nums">
              {t("vocabularyProgress", { progress: percent })}
            </Badge>
          </div>

          <div className="space-y-1">
            <CardTitle>{category.title}</CardTitle>
            {titleEn ? (
              <CardDescription className="font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
                {titleEn}
              </CardDescription>
            ) : null}
          </div>
        </CardHeader>

        <CardFooter className="mt-0 flex-col gap-2 sm:flex-row">
          {locked ? (
            <>
              <Button
                type="button"
                size="sm"
                disabled
                className="w-full sm:flex-1"
              >
                <BookOpen aria-hidden />
                {t("vocabularyOpenCategory")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled
                className="w-full sm:flex-1"
              >
                <PencilLine aria-hidden />
                {t("vocabularyOpenExercises")}
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                href={`/panel/vocabulary/${category.id}`}
                size="sm"
                className="w-full sm:flex-1"
              >
                <BookOpen aria-hidden />
                {t("vocabularyOpenCategory")}
              </ButtonLink>
              <ButtonLink
                href={`/panel/vocabulary/${category.id}?tab=exercises`}
                size="sm"
                variant="outline"
                className="w-full sm:flex-1"
              >
                <PencilLine aria-hidden />
                {t("vocabularyOpenExercises")}
              </ButtonLink>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
