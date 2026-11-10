"use client";

import { ListeningPracticeQuiz } from "@/components/features/listening/ListeningPracticeQuiz";
import type { ListeningSection } from "@/data/listenings/types";
import { useListeningSectionStatus } from "@/hooks/useListeningProgress";
import { tryMarkListeningLevelPassed } from "@/lib/listeningAccess";
import { getListeningSpeakText } from "@/lib/listeningContent";
import { markListeningPracticeDone } from "@/lib/listeningProgressStorage";

type ListeningExercisesViewProps = {
  section: ListeningSection;
};

const PRACTICE_PASS_PERCENT = 50;

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
