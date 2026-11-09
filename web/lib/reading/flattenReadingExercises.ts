import type {
  ReadingExerciseBlock,
  ReadingFillBlankQuestion,
  ReadingReferenceQuestion,
  ReadingShortAnswerQuestion,
  ReadingTrueFalseQuestion,
} from "@/data/readings/types";

export type FlatReadingExercise =
  | { kind: "reference"; question: ReadingReferenceQuestion }
  | { kind: "shortAnswer"; question: ReadingShortAnswerQuestion }
  | { kind: "trueFalse"; question: ReadingTrueFalseQuestion }
  | { kind: "fillBlank"; question: ReadingFillBlankQuestion };

export function flattenReadingExerciseBlock(
  block: ReadingExerciseBlock,
): FlatReadingExercise[] {
  const items: FlatReadingExercise[] = [];

  for (const question of block.reference ?? []) {
    items.push({ kind: "reference", question });
  }
  for (const question of block.fillBlank ?? []) {
    items.push({ kind: "fillBlank", question });
  }
  for (const question of block.shortAnswer ?? []) {
    items.push({ kind: "shortAnswer", question });
  }
  for (const question of block.trueFalse ?? []) {
    items.push({ kind: "trueFalse", question });
  }

  return items;
}
