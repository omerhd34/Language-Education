"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CombinedExerciseCard } from "@/components/features/dashboard/CombinedExerciseCard";
import { TopicCard } from "@/components/features/dashboard/TopicCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { buildTopicGridItems } from "@/data/combinedExercises";
import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import { canAccessLevel, getRequiredLevelToUnlock } from "@/lib/topicAccess";

export function TopicsSection() {
  const t = useTranslations("Dashboard");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("Başlangıç");

  const gridItems = useMemo(
    () => buildTopicGridItems(selectedLevel),
    [selectedLevel],
  );

  const levelUnlocked = canAccessLevel(selectedLevel);
  const requiredLevel = getRequiredLevelToUnlock(selectedLevel);

  return (
    <section
      id="konular"
      aria-labelledby="topics-heading"
      className="space-y-4"
    >
      <div>
        <h1
          id="topics-heading"
          className="font-display text-2xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
        >
          {t("topicsTitle")}
        </h1>
        <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
          {t("topicsSubtitle")}
        </p>
      </div>

      <TopicLevelFilter value={selectedLevel} onChange={setSelectedLevel} />

      {!levelUnlocked && requiredLevel ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {t("levelLockedHint", {
            level: selectedLevel,
            requiredLevel,
          })}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {gridItems.map((item) => {
          if (item.kind === "combined") {
            return (
              <CombinedExerciseCard
                key={item.combined.id}
                combined={item.combined}
                locked={!levelUnlocked}
              />
            );
          }

          const levelTopics = dashboardTopics.filter(
            (topic) => topic.level === selectedLevel,
          );
          const index =
            levelTopics.findIndex((topic) => topic.id === item.topic.id) + 1;

          return (
            <TopicCard
              key={item.topic.id}
              topic={item.topic}
              index={index}
              locked={!levelUnlocked}
            />
          );
        })}
      </div>
    </section>
  );
}
