"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { DashboardTopic } from "@/data/dashboardTopics";
import { getCefrLevelBadgeClass, getTopicProgress } from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type TopicCardProps = {
  topic: DashboardTopic;
  index: number;
  locked?: boolean;
};

export function TopicCard({ topic, index, locked = false }: TopicCardProps) {
  const t = useTranslations("Dashboard");
  const progress = getTopicProgress(topic);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <article
      className={cn(
        "dashboard-panel flex h-full flex-col",
        locked && "opacity-75",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="inline-flex w-fit rounded-md bg-zinc-500/15 px-2 py-1 text-[11px] font-semibold tracking-wide text-zinc-700 uppercase dark:bg-zinc-400/15 dark:text-zinc-300">
          {t("topicLabel", { index })}
        </p>
        <p
          className={cn(
            "inline-flex w-fit rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide uppercase",
            getCefrLevelBadgeClass(topic.level),
          )}
        >
          {topic.level}
        </p>
        {locked ? (
          <p className="inline-flex w-fit items-center gap-1 rounded-md bg-brand-600/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-brand-600 uppercase dark:text-brand-300">
            <Lock className="size-3" aria-hidden />
            {t("locked")}
          </p>
        ) : null}
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
        {topic.title}
      </h3>

      <div className="my-6 flex flex-1 items-center justify-center">
        <div className="relative size-28">
          <svg viewBox="0 0 96 96" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-brand-100 dark:text-brand-800"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-sky-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-semibold text-brand-950 dark:text-brand-100">
              %{progress}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2">
        {locked ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              className="w-full"
            >
              {t("lesson")}
            </Button>
            <Button type="button" size="sm" disabled className="w-full">
              {t("exercises")}
            </Button>
          </>
        ) : (
          <>
            <ButtonLink
              href={`/panelim/konular/${topic.id}/anlatim`}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {t("lesson")}
            </ButtonLink>
            <ButtonLink
              href={`/panelim/konular/${topic.id}/alistirmalar`}
              size="sm"
              className="w-full"
            >
              {t("exercises")}
            </ButtonLink>
          </>
        )}
      </div>
    </article>
  );
}
