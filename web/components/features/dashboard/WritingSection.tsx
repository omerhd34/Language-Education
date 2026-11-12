"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LevelLockedDialog } from "@/components/features/dashboard/LevelLockedDialog";
import { WritingSectionCard } from "@/components/features/dashboard/WritingSectionCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  WRITING_LEVEL_ORDER,
  getWritingSectionsByLevel,
} from "@/lib/writingContent";
import type { CefrLevel } from "@/data/grammar/dashboardTopics";
import type { WritingLevel } from "@/data/writings/types";
import {
  canAccessWritingLevel,
  getRequiredWritingLevelToUnlock,
} from "@/lib/writingAccess";
import {
  useCanAccessWritingLevel,
  useWritingLevelUnlockedCheck,
} from "@/hooks/useWritingLevelAccess";

export function WritingSection() {
  const t = useTranslations("Dashboard");
  const tWriting = useTranslations("Writing");
  const [selectedLevel, setSelectedLevel] = useState<WritingLevel>("A1");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);

  const isWritingLevelUnlocked = useWritingLevelUnlockedCheck();
  const sections = getWritingSectionsByLevel(selectedLevel);
  const levelUnlocked = useCanAccessWritingLevel(selectedLevel);
  const requiredLevel = getRequiredWritingLevelToUnlock(selectedLevel);

  function handleLevelChange(level: CefrLevel) {
    if (!WRITING_LEVEL_ORDER.includes(level as WritingLevel)) {
      return;
    }
    const next = level as WritingLevel;
    setSelectedLevel(next);
    if (!canAccessWritingLevel(next)) {
      setLockDialogOpen(true);
      return;
    }
    setLockDialogOpen(false);
  }

  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="space-y-4"
    >
      <div>
        <h1 id="writing-heading" className="page-title">
          {t("skillWritingTitle")}
        </h1>
        <p className="page-subtitle max-w-none">
          {tWriting("dashboardSubtitle")}
        </p>
      </div>

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        levels={WRITING_LEVEL_ORDER}
        isUnlocked={(level) => isWritingLevelUnlocked(level as WritingLevel)}
      />

      {sections.length === 0 ? (
        <Alert>
          <AlertTitle>
            {t("vocabularyLevelEmptyTitle", { level: selectedLevel })}
          </AlertTitle>
          <AlertDescription>
            {tWriting("levelEmpty", { level: selectedLevel })}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => (
            <WritingSectionCard
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
        title={tWriting("levelLockedTitle", { level: selectedLevel })}
        description={
          requiredLevel
            ? tWriting("levelLockedHint", {
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
