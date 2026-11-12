"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LevelLockedDialog } from "@/components/features/dashboard/LevelLockedDialog";
import { ReadingSectionCard } from "@/components/features/dashboard/ReadingSectionCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  READING_LEVEL_ORDER,
  getReadingSectionsByLevel,
} from "@/lib/readingContent";
import type { CefrLevel } from "@/data/grammar/dashboardTopics";
import type { ReadingLevel } from "@/data/readings/types";
import {
  canAccessReadingLevel,
  getRequiredReadingLevelToUnlock,
} from "@/lib/readingAccess";
import {
  useCanAccessReadingLevel,
  useReadingLevelUnlockedCheck,
} from "@/hooks/useReadingLevelAccess";

export function ReadingSection() {
  const t = useTranslations("Dashboard");
  const tReading = useTranslations("Reading");
  const [selectedLevel, setSelectedLevel] = useState<ReadingLevel>("A1");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);

  const isReadingLevelUnlocked = useReadingLevelUnlockedCheck();
  const sections = getReadingSectionsByLevel(selectedLevel);
  const levelUnlocked = useCanAccessReadingLevel(selectedLevel);
  const requiredLevel = getRequiredReadingLevelToUnlock(selectedLevel);

  function handleLevelChange(level: CefrLevel) {
    if (!READING_LEVEL_ORDER.includes(level as ReadingLevel)) {
      return;
    }
    const next = level as ReadingLevel;
    setSelectedLevel(next);
    if (!canAccessReadingLevel(next)) {
      setLockDialogOpen(true);
      return;
    }
    setLockDialogOpen(false);
  }

  return (
    <section id="read" aria-labelledby="reading-heading" className="space-y-4">
      <div>
        <h1 id="reading-heading" className="page-title">
          {t("skillReadingTitle")}
        </h1>
        <p className="page-subtitle max-w-none">
          {tReading("dashboardSubtitle")}
        </p>
      </div>

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        levels={READING_LEVEL_ORDER}
        isUnlocked={(level) => isReadingLevelUnlocked(level as ReadingLevel)}
      />

      {sections.length === 0 ? (
        <Alert>
          <AlertTitle>
            {t("vocabularyLevelEmptyTitle", { level: selectedLevel })}
          </AlertTitle>
          <AlertDescription>
            {tReading("levelEmpty", { level: selectedLevel })}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => (
            <ReadingSectionCard
              key={section.id}
              section={section}
              index={index + 1}
              locked={!levelUnlocked}
            />
          ))}
        </div>
      )}

      <LevelLockedDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        title={tReading("levelLockedTitle", { level: selectedLevel })}
        description={
          requiredLevel
            ? tReading("levelLockedHint", {
                level: selectedLevel,
                requiredLevel,
              })
            : null
        }
        ctaLabel={t("vocabularyLevelLockedCta")}
      />
    </section>
  );
}
