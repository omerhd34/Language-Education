import type { FillBlankExercise } from "@/data/topics/types";

export function fillBlankSpeakText(exercise: FillBlankExercise): string | null {
  const explicit = exercise.speakText?.trim();
  if (explicit) {
    return explicit;
  }

  const match = exercise.prompt.match(/'([^']+)'/);
  const quoted = match?.[1]?.trim();
  return quoted && quoted.length > 0 ? quoted : null;
}
