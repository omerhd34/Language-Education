"use client";

import { ReadingExercisePanel } from "@/components/features/reading/ReadingExercisePanel";
import { ReadingMultipleChoiceQuiz } from "@/components/features/reading/ReadingMultipleChoiceQuiz";
import type { ReadingSection } from "@/data/readings/types";
import { useReadingSectionStatus } from "@/hooks/useReadingProgress";
import { tryMarkReadingLevelPassed } from "@/lib/readingAccess";
import { markReadingPracticeDone } from "@/lib/readingProgressStorage";

type ReadingExercisesViewProps = {
  section: ReadingSection;
};

const PRACTICE_PASS_PERCENT = 50;

export function ReadingExercisesView({ section }: ReadingExercisesViewProps) {
  const { listened } = useReadingSectionStatus(section.id);
  const block = section.practice;
  const multipleChoice = block.multipleChoice ?? [];

  function handleComplete(_passed: boolean, percent: number) {
    if (percent < PRACTICE_PASS_PERCENT) {
      return;
    }
    markReadingPracticeDone(section.id);
    tryMarkReadingLevelPassed(section.level);
  }

  if (multipleChoice.length > 0) {
    return (
      <ReadingMultipleChoiceQuiz
        questions={multipleChoice}
        listened={listened}
        onComplete={handleComplete}
      />
    );
  }

  return <ReadingExercisePanel block={block} onComplete={handleComplete} />;
}
