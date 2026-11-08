"use client";

import { useTranslations } from "next-intl";
import { Check, GraduationCap, Lock } from "lucide-react";
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
import type { DashboardTopic } from "@/data/dashboardTopics";
import { useLevelExamPercent } from "@/hooks/useLevelExamPercent";
import { getNextLevel } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type LevelExamCardProps = {
  topic: DashboardTopic;
  locked?: boolean;
  passed?: boolean;
};

export function LevelExamCard({
  topic,
  locked = false,
  passed = false,
}: LevelExamCardProps) {
  const t = useTranslations("Dashboard");
  const nextLevel = getNextLevel(topic.level);
  const progress = useLevelExamPercent(topic.level);

  return (
    <Card
      className={cn(
        "h-full bg-red-100/90! shadow-[inset_0_1px_0_rgb(255_255_255/70%),inset_0_0_0_1px_rgb(248_113_113/34%),0_0_0_1px_rgb(220_38_38/14%),var(--glass-shadow)]! transition-opacity dark:bg-red-950/55!",
        locked && "opacity-70",
      )}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-transparent bg-red-500/20 text-red-900 uppercase dark:bg-red-400/20 dark:text-red-200"
          >
            <GraduationCap className="size-3" aria-hidden />
            {t("examLabel")}
          </Badge>
          {passed ? (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
            >
              <Check className="size-3" aria-hidden />
              {t("examPassed")}
            </Badge>
          ) : null}
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
            aria-label={t("examProgressAria", { progress })}
            className="ml-auto tabular-nums"
          >
            {t("examProgress", { progress })}
          </Badge>
        </div>

        <div className="space-y-1">
          <CardTitle>{t("examTitle", { level: topic.level })}</CardTitle>
          <CardDescription className="not-italic">
            {nextLevel
              ? t("examSubtitle", { nextLevel })
              : t("examSubtitleFinal")}
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter>
        {locked ? (
          <Button type="button" size="sm" disabled className="w-full">
            {t("examCta")}
          </Button>
        ) : (
          <ButtonLink
            href={`/panel/konular/${topic.id}/alistirmalar`}
            size="sm"
            className="w-full"
          >
            {passed ? t("examRetakeCta") : t("examCta")}
          </ButtonLink>
        )}
      </CardFooter>
    </Card>
  );
}
