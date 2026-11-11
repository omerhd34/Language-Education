"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { cn } from "@/lib/utils";

type TopicProgressBadgeProps = {
  topicId: string;
  className?: string;
};

export function TopicProgressBadge({
  topicId,
  className,
}: TopicProgressBadgeProps) {
  const t = useTranslations("Topic");
  const progress = Math.min(
    100,
    Math.max(0, Math.round(useTopicProgress(topicId))),
  );
  const done = progress >= 100;

  return (
    <Badge
      variant="outline"
      aria-label={t("topicProgressAria", { progress })}
      className={cn(
        "shrink-0 rounded-xl px-3 py-2 text-xl font-bold tracking-tight tabular-nums sm:text-2xl",
        done
          ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
          : progress > 0
            ? "border-sky-500/40 text-sky-700 dark:text-sky-300"
            : "text-brand-500 dark:text-brand-400",
        className,
      )}
    >
      {t("typeProgressBadge", { percent: progress })}
    </Badge>
  );
}
