import type { VocabularyCategory } from "@/data/vocabulary";
import type {
  CrosswordExercise,
  ExerciseType,
  TopicExercise,
} from "@/data/topics/types";
import {
  readCrosswordDraft,
  readLinearSession,
} from "@/lib/exerciseDraftStorage";
import {
  countSolvedCrosswordClues,
  crosswordDraftKey,
} from "@/lib/exerciseTypeProgress";
import { countVocabularyActivities } from "@/lib/vocabularyActivity";
import { readVocabularyActivityIds } from "@/lib/vocabularyActivityStorage";
import { generateVocabularyExercises } from "@/lib/vocabulary/generateExercises";

export const VOCABULARY_WORD_SHARE = 40;
export const VOCABULARY_EXERCISE_SHARE = 15;

export function vocabularyExerciseProgressKey(categoryId: string): string {
  return `vocabulary:${categoryId}`;
}

function answeredCount(
  categoryId: string,
  type: ExerciseType,
  exercises: TopicExercise[],
): { answered: number; total: number } {
  if (type === "crossword") {
    const crosswords = exercises.filter(
      (item): item is CrosswordExercise => item.type === "crossword",
    );
    const total = crosswords.reduce((sum, item) => sum + item.clues.length, 0);
    const draft = readCrosswordDraft(crosswordDraftKey(undefined, crosswords));
    const { solved } = countSolvedCrosswordClues(crosswords, draft);
    return { answered: Math.min(solved, total), total };
  }

  const saved = readLinearSession(
    `${vocabularyExerciseProgressKey(categoryId)}:${type}`,
  );
  const answered = saved?.slots.filter((slot) => slot.checked).length ?? 0;
  return {
    answered: Math.min(answered, exercises.length),
    total: exercises.length,
  };
}

export function vocabularySectionPercent(
  category: VocabularyCategory,
  knownWordIds: ReadonlySet<string>,
): number {
  const done = readVocabularyActivityIds(category.id);
  const activities = countVocabularyActivities(category, done, knownWordIds);
  const wordShare =
    activities.total === 0
      ? 0
      : (activities.completed / activities.total) * VOCABULARY_WORD_SHARE;

  const exercises = generateVocabularyExercises(category.words, category.id);
  const types = [...new Set(exercises.map((item) => item.type))];
  let exerciseShare = 0;

  for (const type of types) {
    const ofType = exercises.filter((item) => item.type === type);
    const slice = answeredCount(category.id, type, ofType);
    if (slice.total > 0) {
      exerciseShare +=
        (slice.answered / slice.total) * VOCABULARY_EXERCISE_SHARE;
    }
  }

  return Math.min(100, Math.round(wordShare + exerciseShare));
}
