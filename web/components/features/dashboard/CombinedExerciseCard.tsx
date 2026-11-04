"use client";

import { useTranslations } from "next-intl";
import { Layers, Lock } from "lucide-react";
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

  return (
    <Card
      className={cn(
        "h-full border-amber-400/45 bg-amber-100/90 transition-opacity dark:border-amber-500/35 dark:bg-amber-950/55",
        locked && "opacity-70",
      )}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-transparent bg-amber-500/20 text-amber-900 uppercase dark:bg-amber-400/20 dark:text-amber-200"
          >
            <Layers className="size-3" aria-hidden />
            {t("combinedExerciseLabel", { index: combined.index })}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "border-transparent uppercase",
              getCefrLevelBadgeClass(combined.level),
            )}
          >
            {combined.level}
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

        <div className="space-y-1">
          <CardTitle>{t("combinedExerciseTitle")}</CardTitle>
          <CardDescription className="not-italic">
            {t("combinedExerciseSubtitle", {
              count: combined.topics.length,
            })}
          </CardDescription>
        </div>
      </CardHeader>

      <div className="flex flex-1 items-center justify-center py-2">
        <div className="flex size-20 items-center justify-center rounded-full border border-amber-500/35 bg-amber-500/15 dark:border-amber-400/35 dark:bg-amber-400/15">
          <Layers
            className="size-8 text-amber-700 dark:text-amber-300"
            aria-hidden
          />
        </div>
      </div>

      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
