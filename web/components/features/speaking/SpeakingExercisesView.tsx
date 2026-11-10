"use client";

import { SpeakingPracticeQuiz } from "@/components/features/speaking/SpeakingPracticeQuiz";
import type { SpeakingSection } from "@/data/speakings/types";
import { useSpeakingSectionStatus } from "@/hooks/useSpeakingProgress";
import { tryMarkSpeakingLevelPassed } from "@/lib/speakingAccess";
import {
  clearSpeakingPracticeProgress,
  markSpeakingPracticeAllDone,
  markSpeakingPracticeDone,
} from "@/lib/speakingProgressStorage";

type SpeakingExercisesViewProps = {
  section: SpeakingSection;
};

export function SpeakingExercisesView({ section }: SpeakingExercisesViewProps) {
  const { modelViewed } = useSpeakingSectionStatus(section.id);

  function handleAllTasksComplete(passed: boolean, _percent: number) {
    markSpeakingPracticeAllDone(section.id);
    if (passed) {
      markSpeakingPracticeDone(section.id);
      tryMarkSpeakingLevelPassed(section.level);
    }
  }

  function handlePracticeReset() {
    clearSpeakingPracticeProgress(section.id);
  }

  return (
    <SpeakingPracticeQuiz
      block={section.practice}
      modelViewed={modelViewed}
      onAllTasksComplete={handleAllTasksComplete}
      onPracticeReset={handlePracticeReset}
    />
  );
}
