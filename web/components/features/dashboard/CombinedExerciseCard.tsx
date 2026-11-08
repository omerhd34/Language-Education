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
import { useCombinedExerciseProgress } from "@/hooks/useCombinedExerciseProgress";
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
  const progress = useCombinedExerciseProgress(combined.id);

  return (
    <Card
      className={cn(
        "h-full bg-amber-100/90! shadow-[inset_0_1px_0_rgb(255_255_255/70%),inset_0_0_0_1px_rgb(251_191_36/38%),0_0_0_1px_rgb(217_119_6/14%),var(--glass-shadow)]! transition-opacity dark:bg-amber-950/55!",
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
          {locked ? (
            <Badge
              variant="outline"
              className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300"
            >
              <Lock className="size-3" aria-hidden />
              {t("locked")}
            </Badge>
          ) : null}
          <Badge
            variant="outline"
            aria-label={t("combinedExerciseProgressAria", { progress })}
            className="ml-auto tabular-nums"
          >
            {t("combinedExerciseProgress", { progress })}
          </Badge>
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

      <CardFooter>
        {locked ? (
          <Button type="button" size="sm" disabled className="w-full">
            {t("combinedExerciseCta")}
          </Button>
        ) : (
          <ButtonLink
            href={`/panel/konular/birlesik/${combined.id}`}
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
