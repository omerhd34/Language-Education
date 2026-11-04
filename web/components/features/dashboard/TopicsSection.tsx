"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { CombinedExerciseCard } from "@/components/features/dashboard/CombinedExerciseCard";
import { LevelExamCard } from "@/components/features/dashboard/LevelExamCard";
import { TopicCard } from "@/components/features/dashboard/TopicCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildTopicGridItems } from "@/data/combinedExercises";
import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import { usePassedLevelExams } from "@/hooks/usePassedLevelExams";
import {
  canAccessLevel,
  getRequiredLevelToUnlock,
  isLevelExamPassed,
} from "@/lib/topicAccess";

export function TopicsSection() {
  const t = useTranslations("Dashboard");
  const passedExams = usePassedLevelExams();
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("Başlangıç");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);

  const gridItems = useMemo(
    () => buildTopicGridItems(selectedLevel),
    [selectedLevel],
  );

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
                locked={!levelUnlocked}
              />
            );
          }

          if (item.topic.isExam) {
            return (
              <LevelExamCard
                key={item.topic.id}
                topic={item.topic}
                locked={!levelUnlocked}
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
              locked={!levelUnlocked}
            />
          );
        })}
      </div>

      <Dialog open={lockDialogOpen} onOpenChange={setLockDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center sm:items-center sm:text-center">
            <span className="mx-auto mb-1 flex size-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
              <Lock className="size-5" aria-hidden />
            </span>
            <DialogTitle>
              {t("topicsLevelLockedTitle", { level: selectedLevel })}
            </DialogTitle>
            <DialogDescription>
              {requiredLevel
                ? t("levelLockedHint", {
                    level: selectedLevel,
                    requiredLevel,
                  })
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <DialogClose render={<Button className="w-full sm:w-auto" />}>
              {t("topicsLevelLockedCta")}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
