"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { CombinedExerciseCard } from "@/components/features/dashboard/CombinedExerciseCard";
import { LevelExamCard } from "@/components/features/dashboard/LevelExamCard";
import { LevelLockedDialog } from "@/components/features/dashboard/LevelLockedDialog";
import { TopicCard } from "@/components/features/dashboard/TopicCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { buildTopicGridItems } from "@/data/combinedExercises";
import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import { usePassedLevelExams } from "@/hooks/usePassedLevelExams";
import {
  canAccessLevel,
  getRequiredLevelToUnlock,
  isLevelExamPassed,
} from "@/lib/topicAccess";
import {
  canAccessCombinedExercise,
  canAccessGrammarTopic,
  canAccessLevelProficiencyExam,
} from "@/lib/topicItemAccess";
import { useTopicItemAccessVersion } from "@/hooks/useTopicItemAccessVersion";

export function TopicsSection() {
  const t = useTranslations("Dashboard");
  const passedExams = usePassedLevelExams();
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("A1");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);

  const gridItems = useMemo(
    () => buildTopicGridItems(selectedLevel),
    [selectedLevel],
  );

  useTopicItemAccessVersion();

  const levelUnlocked = canAccessLevel(selectedLevel, passedExams);
  const requiredLevel = getRequiredLevelToUnlock(selectedLevel);
  const examPassed = isLevelExamPassed(selectedLevel, passedExams);

  function handleLevelChange(level: CefrLevel) {
    setSelectedLevel(level);

    if (!canAccessLevel(level, passedExams)) {
      setLockDialogOpen(true);
      return;
    }

    setLockDialogOpen(false);
  }

  return (
    <section
      id="grammer"
      aria-labelledby="topics-heading"
      className="space-y-4"
    >
      <div>
        <h1 id="topics-heading" className="page-title">
          {t("topicsTitle")}
        </h1>
        <p className="page-subtitle max-w-none">{t("topicsSubtitle")}</p>
      </div>

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        isUnlocked={(level) => canAccessLevel(level, passedExams)}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {gridItems.map((item) => {
          if (item.kind === "combined") {
            return (
              <CombinedExerciseCard
                key={item.combined.id}
                combined={item.combined}
                locked={
                  !levelUnlocked || !canAccessCombinedExercise(item.combined.id)
                }
              />
            );
          }

          if (item.topic.isExam) {
            return (
              <LevelExamCard
                key={item.topic.id}
                topic={item.topic}
                locked={
                  !levelUnlocked ||
                  !canAccessLevelProficiencyExam(selectedLevel)
                }
                passed={examPassed}
              />
            );
          }

          const levelTopics = dashboardTopics.filter(
            (topic) => topic.level === selectedLevel && !topic.isExam,
          );
          const index =
            levelTopics.findIndex((topic) => topic.id === item.topic.id) + 1;

          return (
            <TopicCard
              key={item.topic.id}
              topic={item.topic}
              index={index}
              locked={!levelUnlocked || !canAccessGrammarTopic(item.topic.id)}
            />
          );
        })}
      </div>

      <LevelLockedDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        title={t("topicsLevelLockedTitle", { level: selectedLevel })}
        description={
          requiredLevel
            ? t("levelLockedHint", {
                level: selectedLevel,
                requiredLevel,
              })
            : null
        }
        ctaLabel={t("topicsLevelLockedCta")}
      />
    </section>
  );
}
