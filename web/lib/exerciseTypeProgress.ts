import type {
  CrosswordClue,
  CrosswordExercise,
  ExerciseType,
  TopicExercise,
} from "@/data/topics/types";
import {
  readCrosswordDraft,
  readLinearSession,
  type CrosswordDraft,
} from "@/lib/exerciseDraftStorage";

function clueCellKey(clue: CrosswordClue, index: number): string {
  const row = clue.direction === "across" ? clue.row : clue.row + index;
  const col = clue.direction === "across" ? clue.col + index : clue.col;
  return `${row}-${col}`;
}

export function isCrosswordClueSolved(
  clue: CrosswordClue,
  values: Record<string, string>,
): boolean {
  const answer = clue.answer.toUpperCase();
  if (answer.length === 0) {
    return false;
  }

  for (let index = 0; index < answer.length; index += 1) {
    const typed = (values[clueCellKey(clue, index)] ?? "").toUpperCase();
    if (typed !== answer[index]) {
      return false;
    }
  }

  return true;
}

export function countSolvedCrosswordClues(
  exercises: CrosswordExercise[],
  draft: CrosswordDraft | null,
): { solved: number; total: number } {
  const total = exercises.reduce((sum, item) => sum + item.clues.length, 0);
  if (!draft || total === 0) {
    return { solved: 0, total };
  }

  if (draft.finished) {
    return { solved: total, total };
  }

  const index = exercises.findIndex((item) => item.id === draft.exerciseId);
  if (index < 0) {
    return { solved: 0, total };
  }

  let solved = 0;
  for (let puzzleIndex = 0; puzzleIndex < index; puzzleIndex += 1) {
    solved += exercises[puzzleIndex].clues.length;
  }

  solved += exercises[index].clues.filter((clue) =>
    isCrosswordClueSolved(clue, draft.values),
  ).length;

  return { solved: Math.min(solved, total), total };
}

function toPercent(solved: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((solved / total) * 100);
}

export function crosswordDraftKey(
  topicId: string | undefined,
  exercises: CrosswordExercise[],
): string {
  if (topicId) {
    return `topic:${topicId}:crossword`;
  }
  return `crossword:${exercises.map((item) => item.id).join(",")}`;
}

export function computeExerciseTypeProgress(options: {
  topicId?: string;
  progressKey?: string;
  exercises: TopicExercise[];
  completedTypes: readonly ExerciseType[];
}): Partial<Record<ExerciseType, number>> {
  const progress: Partial<Record<ExerciseType, number>> = {};
  const completed = new Set(options.completedTypes);
  const crosswords = options.exercises.filter(
    (item): item is CrosswordExercise => item.type === "crossword",
  );

  for (const exercise of options.exercises) {
    if (progress[exercise.type] !== undefined) {
      continue;
    }

    if (completed.has(exercise.type)) {
      progress[exercise.type] = 100;
      continue;
    }

    if (exercise.type === "crossword") {
      const draft = readCrosswordDraft(
        crosswordDraftKey(options.topicId, crosswords),
      );
      const { solved, total } = countSolvedCrosswordClues(crosswords, draft);
      progress.crossword = toPercent(solved, total);
      continue;
    }

    const scope = options.progressKey ?? options.topicId;
    const saved = scope ? readLinearSession(`${scope}:${exercise.type}`) : null;
    const checked = saved?.slots.filter((slot) => slot.checked).length ?? 0;
    progress[exercise.type] =
      saved && saved.total > 0 ? toPercent(checked, saved.total) : 0;
  }

  return progress;
}
