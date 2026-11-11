"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TOPIC_BATCH_INTERVAL } from "@/data/combinedExercises";

export type TopicItemLockedKind = "topic" | "combined" | "levelExam";

type TopicItemLockedProps = {
  kind: TopicItemLockedKind;
  index?: number;
};

export function TopicItemLocked({ kind, index }: TopicItemLockedProps) {
  const t = useTranslations("Topic");

  const title =
    kind === "topic" && index != null
      ? t("topicItemLockedTitleTopic", { index })
      : kind === "combined" && index != null
        ? t("topicItemLockedTitleCombined", { index })
        : t("topicItemLockedTitleLevelExam");

  const body =
    kind === "levelExam"
      ? t("topicItemLockedBodyLevelExam")
      : t("topicItemLockedBody", { count: TOPIC_BATCH_INTERVAL });

  return (
    <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
        <Lock className="size-5" aria-hidden />
      </span>
      <h2 className="section-title">{title}</h2>
      <p className="page-subtitle mt-0">{body}</p>
      <ButtonLink href="/panel#grammer" variant="outline">
        {t("backToTopics")}
      </ButtonLink>
    </div>
  );
}
