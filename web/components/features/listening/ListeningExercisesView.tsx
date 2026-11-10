"use client";

import { ListeningPracticeQuiz } from "@/components/features/listening/ListeningPracticeQuiz";
import type { ListeningSection } from "@/data/listenings/types";
import { useListeningSectionStatus } from "@/hooks/useListeningProgress";
import { tryMarkListeningLevelPassed } from "@/lib/listeningAccess";
import { getListeningSpeakText } from "@/lib/listeningContent";
import { markListeningPracticeDone } from "@/lib/listeningProgressStorage";
import { SECTION_PRACTICE_PASS_PERCENT } from "@/lib/sectionPracticePassPercent";

type ListeningExercisesViewProps = {
  section: ListeningSection;
};

const PRACTICE_PASS_PERCENT = SECTION_PRACTICE_PASS_PERCENT;

export function ListeningExercisesView({
  section,
}: ListeningExercisesViewProps) {
  const { listened } = useListeningSectionStatus(section.id);

  function handleComplete(_passed: boolean, percent: number) {
    if (percent < PRACTICE_PASS_PERCENT) {
      return;
    }
    markListeningPracticeDone(section.id);
    tryMarkListeningLevelPassed(section.level);
  }

  return (
    <ListeningPracticeQuiz
      block={section.practice}
      recordingText={getListeningSpeakText(section)}
      listened={listened}
      onComplete={handleComplete}
    />
  );
}
