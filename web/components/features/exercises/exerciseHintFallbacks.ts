export type ExerciseHintFallbackKey =
  | "readingMultipleChoice"
  | "readingReference"
  | "readingShortAnswer"
  | "readingTrueFalse"
  | "readingFillBlank"
  | "topicMultipleChoice"
  | "topicFillBlank"
  | "topicListening"
  | "topicCrossword"
  | "vocabularyQuizChoice"
  | "vocabularyQuizListening"
  | "vocabularyQuizFill"
  | "topicExam"
  | "speaking"
  | "writing";

export function vocabularyQuizHintKey(type: string): ExerciseHintFallbackKey {
  switch (type) {
    case "listening":
      return "vocabularyQuizListening";
    case "fill_blank":
      return "vocabularyQuizFill";
    default:
      return "vocabularyQuizChoice";
  }
}

export function readingExerciseHintKey(
  kind: "reference" | "shortAnswer" | "trueFalse" | "fillBlank",
): ExerciseHintFallbackKey {
  switch (kind) {
    case "reference":
      return "readingReference";
    case "shortAnswer":
      return "readingShortAnswer";
    case "trueFalse":
      return "readingTrueFalse";
    case "fillBlank":
      return "readingFillBlank";
  }
}
