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
import { getCefrLevelBadgeClass, getNextLevel } from "@/lib/topicAccess";
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

  return (
    <Card
      className={cn(
        "h-full border-red-500/40 bg-red-50/90 transition-opacity dark:border-red-400/35 dark:bg-red-950/45",
        locked && "opacity-70",
      )}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-transparent bg-red-600 text-white uppercase dark:bg-red-500 dark:text-white"
          >
            <GraduationCap className="size-3" aria-hidden />
            {t("examLabel")}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "border-transparent uppercase",
              getCefrLevelBadgeClass(topic.level),
            )}
          >
            {topic.level}
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
            href={`/panelim/konular/${topic.id}/alistirmalar`}
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
