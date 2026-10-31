"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { DashboardStatsBar } from "@/components/features/dashboard/DashboardStatsBar";
import { TopicCard } from "@/components/features/dashboard/TopicCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import { canAccessLevel, getRequiredLevelToUnlock } from "@/lib/topicAccess";

export function DashboardHome() {
  const t = useTranslations("Dashboard");
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("A0");

  const filteredTopics = useMemo(
    () => dashboardTopics.filter((topic) => topic.level === selectedLevel),
    [selectedLevel],
  );

  const levelUnlocked = canAccessLevel(selectedLevel);
  const requiredLevel = getRequiredLevelToUnlock(selectedLevel);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <DashboardStatsBar />

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
          {filteredTopics.map((topic) => {
            const index =
              dashboardTopics.findIndex((item) => item.id === topic.id) + 1;

            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                locked={!levelUnlocked}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
