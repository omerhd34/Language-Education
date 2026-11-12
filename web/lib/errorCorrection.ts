import type { ErrorCorrectionExercise } from "@/data/grammar/types";

export function errorCorrectionTokens(
  exercise: ErrorCorrectionExercise,
): string[] {
  if (exercise.tokens && exercise.tokens.length > 0) {
    return exercise.tokens;
  }
  return exercise.sentence.split(/\s+/).filter((part) => part.length > 0);
}

function normalizeCorrection(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

export function isErrorCorrectionAnswerCorrect(
  exercise: ErrorCorrectionExercise,
  correction: string,
): boolean {
  const normalized = normalizeCorrection(correction);
  if (!normalized) {
    return false;
  }
  const accepted = [
    exercise.correction,
    ...(exercise.acceptedCorrections ?? []),
  ].map(normalizeCorrection);
  return accepted.includes(normalized);
}

export function isErrorCorrectionSpotCorrect(
  exercise: ErrorCorrectionExercise,
  tokenIndex: number | null,
): boolean {
  return tokenIndex === exercise.errorTokenIndex;
}

export function isErrorCorrectionFullyCorrect(
  exercise: ErrorCorrectionExercise,
  tokenIndex: number | null,
  correction: string,
): boolean {
  return (
    isErrorCorrectionSpotCorrect(exercise, tokenIndex) &&
    isErrorCorrectionAnswerCorrect(exercise, correction)
  );
}

export function correctedSentence(exercise: ErrorCorrectionExercise): string {
  const tokens = errorCorrectionTokens(exercise);
  const index = exercise.errorTokenIndex;
  if (index < 0 || index >= tokens.length) {
    return exercise.sentence;
  }
  return tokens
    .map((token, tokenIndex) =>
      tokenIndex === index ? exercise.correction : token,
    )
    .join(" ");
}
