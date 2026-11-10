"use client";

import { WritingPracticeQuiz } from "@/components/features/writing/WritingPracticeQuiz";
import type { WritingSection } from "@/data/writings/types";
import { useWritingSectionStatus } from "@/hooks/useWritingProgress";
import { tryMarkWritingLevelPassed } from "@/lib/writingAccess";
import {
  clearWritingPracticeProgress,
  markWritingPracticeAllDone,
  markWritingPracticeDone,
} from "@/lib/writingProgressStorage";

type WritingExercisesViewProps = {
  section: WritingSection;
};

export function WritingExercisesView({ section }: WritingExercisesViewProps) {
  const { modelViewed } = useWritingSectionStatus(section.id);

  function handleAllTasksComplete(passed: boolean, _percent: number) {
    markWritingPracticeAllDone(section.id);
    if (passed) {
      markWritingPracticeDone(section.id);
      tryMarkWritingLevelPassed(section.level);
    }
  }

  function handlePracticeReset() {
    clearWritingPracticeProgress(section.id);
  }

  return (
    <WritingPracticeQuiz
      block={section.practice}
      modelViewed={modelViewed}
      onAllTasksComplete={handleAllTasksComplete}
      onPracticeReset={handlePracticeReset}
    />
  );
}
