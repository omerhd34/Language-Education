"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LevelLockedDialog } from "@/components/features/dashboard/LevelLockedDialog";
import { SpeakingSectionCard } from "@/components/features/dashboard/SpeakingSectionCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  SPEAKING_LEVEL_ORDER,
  getSpeakingSectionsByLevel,
} from "@/lib/speakingContent";
import type { CefrLevel } from "@/data/dashboardTopics";
import type { SpeakingLevel } from "@/data/speakings/types";
import {
  canAccessSpeakingLevel,
  getRequiredSpeakingLevelToUnlock,
} from "@/lib/speakingAccess";
import {
  useCanAccessSpeakingLevel,
  useSpeakingLevelUnlockedCheck,
} from "@/hooks/useSpeakingLevelAccess";

export function SpeakingSection() {
  const t = useTranslations("Dashboard");
  const tSpeaking = useTranslations("Speaking");
  const [selectedLevel, setSelectedLevel] = useState<SpeakingLevel>("A1");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);

  const isSpeakingLevelUnlocked = useSpeakingLevelUnlockedCheck();
  const sections = getSpeakingSectionsByLevel(selectedLevel);
  const levelUnlocked = useCanAccessSpeakingLevel(selectedLevel);
  const requiredLevel = getRequiredSpeakingLevelToUnlock(selectedLevel);

  function handleLevelChange(level: CefrLevel) {
    if (!SPEAKING_LEVEL_ORDER.includes(level as SpeakingLevel)) {
      return;
    }
    const next = level as SpeakingLevel;
    setSelectedLevel(next);
    if (!canAccessSpeakingLevel(next)) {
      setLockDialogOpen(true);
      return;
    }
    setLockDialogOpen(false);
  }

  return (
    <section
      id="konusma"
      aria-labelledby="speaking-heading"
      className="space-y-4"
    >
      <div>
        <h1 id="speaking-heading" className="page-title">
          {t("skillSpeakingTitle")}
        </h1>
        <p className="page-subtitle max-w-none">
          {tSpeaking("dashboardSubtitle")}
        </p>
      </div>

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        levels={SPEAKING_LEVEL_ORDER}
        isUnlocked={(level) =>
          isSpeakingLevelUnlocked(level as SpeakingLevel)
        }
      />

      {sections.length === 0 ? (
        <Alert>
          <AlertTitle>
            {t("vocabularyLevelEmptyTitle", { level: selectedLevel })}
          </AlertTitle>
          <AlertDescription>
            {tSpeaking("levelEmpty", { level: selectedLevel })}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => (
            <SpeakingSectionCard
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
        title={tSpeaking("levelLockedTitle", { level: selectedLevel })}
        description={
          requiredLevel
            ? tSpeaking("levelLockedHint", {
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
