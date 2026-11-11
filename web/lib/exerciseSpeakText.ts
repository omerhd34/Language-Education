import type {
  FillBlankExercise,
  MultipleChoiceExercise,
} from "@/data/topics/types";

function quotedSegments(prompt: string): string[] {
  return [...prompt.matchAll(/'([^']+)'/g)]
    .map((match) => match[1]?.trim() ?? "")
    .filter((value) => value.length > 0);
}

function speakTextFromPrompt(prompt: string): string | null {
  const quoted = quotedSegments(prompt);
  if (quoted.length > 1) {
    return quoted.join(", ");
  }
  if (quoted.length === 1) {
    return quoted[0] ?? null;
  }

  const letterMatch = prompt.match(/^([A-Za-z]) harfi/);
  if (letterMatch?.[1]) {
    return letterMatch[1];
  }

  return null;
}

export function fillBlankSpeakText(exercise: FillBlankExercise): string | null {
  const explicit = exercise.speakText?.trim();
  if (explicit) {
    return explicit;
  }
  return speakTextFromPrompt(exercise.prompt);
}

export function multipleChoiceSpeakText(
  exercise: MultipleChoiceExercise,
): string | null {
  const explicit = exercise.speakText?.trim();
  if (explicit) {
    return explicit;
  }
  return speakTextFromPrompt(exercise.prompt);
}
