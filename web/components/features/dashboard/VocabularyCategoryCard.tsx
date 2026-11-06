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
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
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
  const titleEn = getDistinctSecondaryTitle(category.title, category.titleEn);

  return (
    <Card className={cn("h-full transition-opacity", locked && "opacity-70")}>
      <CardHeader>
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
          <p className="shrink-0 text-xs font-medium text-brand-600 dark:text-brand-400">
            {t("vocabularyWordCount", { count: wordCount })}
          </p>
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

      <CardFooter className="flex-col gap-2 pt-2 sm:flex-row">
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
              href={`/panel/kelime/${category.id}`}
              size="sm"
              className="w-full sm:flex-1"
            >
              <BookOpen aria-hidden />
              {t("vocabularyOpenCategory")}
            </ButtonLink>
            <ButtonLink
              href={`/panel/kelime/${category.id}?tab=exercises`}
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
  );
}
