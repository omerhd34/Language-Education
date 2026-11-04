"use client";

import { useTranslations } from "next-intl";
import { BookOpen, ClipboardCheck, Lock, PencilLine } from "lucide-react";
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
import { getTopicTitleEn, type DashboardTopic } from "@/data/dashboardTopics";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";
import { getCefrLevelBadgeClass } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type TopicCardProps = {
  topic: DashboardTopic;
  index: number;
  locked?: boolean;
};

export function TopicCard({ topic, index, locked = false }: TopicCardProps) {
  const t = useTranslations("Dashboard");
  const progress = Math.min(100, Math.max(0, useTopicProgress(topic.id)));
  const titleEn = getDistinctSecondaryTitle(
    topic.title,
    topic.titleEn ?? getTopicTitleEn(topic.id, topic.title),
  );

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
      aria-valuenow={progress}
      aria-label={t("topicProgressAria", { progress })}
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
          background: `conic-gradient(from -90deg, #0ea5e9 ${progress}%, transparent 0)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <Card className="relative h-full border-0 bg-surface shadow-sm dark:bg-brand-900">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{t("topicLabel", { index })}</Badge>
            <Badge
              variant="outline"
              className={cn(
                "border-transparent uppercase",
                getCefrLevelBadgeClass(topic.level),
              )}
            >
              {topic.level}
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
            <Badge variant="outline" className="ml-auto tabular-nums">
              %{progress}
            </Badge>
          </div>

          <div className="space-y-1">
            <CardTitle>{topic.title}</CardTitle>
            {titleEn ? (
              <CardDescription className="font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
                {titleEn}
              </CardDescription>
            ) : null}
          </div>
        </CardHeader>

        <CardFooter className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-3">
          {locked ? (
            <>
              <Button type="button" variant="outline" size="sm" disabled>
                <BookOpen aria-hidden />
                {t("lesson")}
              </Button>
              <Button type="button" variant="outline" size="sm" disabled>
                <PencilLine aria-hidden />
                {t("exercises")}
              </Button>
              <Button type="button" size="sm" disabled>
                <ClipboardCheck aria-hidden />
                {t("topicExam")}
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                href={`/panelim/konular/${topic.id}/anlatim`}
                variant="outline"
                size="sm"
              >
                <BookOpen aria-hidden />
                {t("lesson")}
              </ButtonLink>
              <ButtonLink
                href={`/panelim/konular/${topic.id}/alistirmalar`}
                variant="outline"
                size="sm"
              >
                <PencilLine aria-hidden />
                {t("exercises")}
              </ButtonLink>
              <ButtonLink href={`/panelim/konular/${topic.id}/sinav`} size="sm">
                <ClipboardCheck aria-hidden />
                {t("topicExam")}
              </ButtonLink>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
