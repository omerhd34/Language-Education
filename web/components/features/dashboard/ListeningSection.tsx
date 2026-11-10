"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LevelLockedDialog } from "@/components/features/dashboard/LevelLockedDialog";
import { ListeningSectionCard } from "@/components/features/dashboard/ListeningSectionCard";
import { TopicLevelFilter } from "@/components/features/dashboard/TopicLevelFilter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LISTENING_LEVEL_ORDER,
  getListeningSectionsByLevel,
} from "@/lib/listeningContent";
import type { CefrLevel } from "@/data/dashboardTopics";
import type { ListeningLevel } from "@/data/listenings/types";
import {
  canAccessListeningLevel,
  getRequiredListeningLevelToUnlock,
} from "@/lib/listeningAccess";
import {
  useCanAccessListeningLevel,
  useListeningLevelUnlockedCheck,
} from "@/hooks/useListeningLevelAccess";

export function ListeningSection() {
  const t = useTranslations("Dashboard");
  const tListening = useTranslations("Listening");
  const [selectedLevel, setSelectedLevel] = useState<ListeningLevel>("A1");
  const [lockDialogOpen, setLockDialogOpen] = useState(false);

  const isListeningLevelUnlocked = useListeningLevelUnlockedCheck();
  const sections = getListeningSectionsByLevel(selectedLevel);
  const levelUnlocked = useCanAccessListeningLevel(selectedLevel);
  const requiredLevel = getRequiredListeningLevelToUnlock(selectedLevel);

  function handleLevelChange(level: CefrLevel) {
    if (!LISTENING_LEVEL_ORDER.includes(level as ListeningLevel)) {
      return;
    }
    const next = level as ListeningLevel;
    setSelectedLevel(next);
    if (!canAccessListeningLevel(next)) {
      setLockDialogOpen(true);
      return;
    }
    setLockDialogOpen(false);
  }

  return (
    <section
      id="listening"
      aria-labelledby="listening-heading"
      className="space-y-4"
    >
      <div>
        <h1 id="listening-heading" className="page-title">
          {t("skillListeningTitle")}
        </h1>
        <p className="page-subtitle max-w-none">
          {tListening("dashboardSubtitle")}
        </p>
      </div>

      <TopicLevelFilter
        value={selectedLevel}
        onChange={handleLevelChange}
        levels={LISTENING_LEVEL_ORDER}
        isUnlocked={(level) =>
          isListeningLevelUnlocked(level as ListeningLevel)
        }
      />

      {sections.length === 0 ? (
        <Alert>
          <AlertTitle>
            {t("vocabularyLevelEmptyTitle", { level: selectedLevel })}
          </AlertTitle>
          <AlertDescription>
            {tListening("levelEmpty", { level: selectedLevel })}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section, index) => (
            <ListeningSectionCard
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
        title={tListening("levelLockedTitle", { level: selectedLevel })}
        description={
          requiredLevel
            ? tListening("levelLockedHint", {
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
