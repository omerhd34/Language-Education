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

const CROSSWORD_SECOND_WORDS = [
  "ANSWER",
  "REPEAT",
  "STUDY",
  "START",
  "TOUCH",
  "QUIET",
  "BOOK",
  "DOOR",
  "HERE",
  "NAME",
  "OPEN",
  "TALK",
  "LATE",
  "BACK",
  "DOWN",
  "WAIT",
  "STOP",
  "RUN",
  "GO",
  "IN",
  "UP",
] as const;

export function crosswordAnswerSpeakText(answer: string): string {
  const compact = answer.replace(/[^a-zA-Z]/g, "").toUpperCase();
  if (!compact) {
    return "";
  }
  if (compact.startsWith("DONTBE") && compact.length > 6) {
    return `don't be ${compact.slice(6).toLowerCase()}`;
  }
  if (compact.startsWith("DONT") && compact.length > 4) {
    return `don't ${compact.slice(4).toLowerCase()}`;
  }
  if (compact.startsWith("LETS") && compact.length > 4) {
    return `let's ${compact.slice(4).toLowerCase()}`;
  }
  if (compact.endsWith("PLEASE") && compact.length > 6) {
    const head = compact.slice(0, -6);
    const phrase = crosswordAnswerSpeakText(head);
    return phrase ? `${phrase}, please` : "please";
  }
  if (compact.endsWith("DOWN") && compact.length > 4) {
    return `${compact.slice(0, -4).toLowerCase()} down`;
  }
  if (compact.endsWith("UP") && compact.length > 2) {
    return `${compact.slice(0, -2).toLowerCase()} up`;
  }
  for (const tail of CROSSWORD_SECOND_WORDS) {
    if (compact.length > tail.length && compact.endsWith(tail)) {
      const head = compact.slice(0, -tail.length).toLowerCase();
      if (head.length > 0) {
        return `${head} ${tail.toLowerCase()}`;
      }
    }
  }
  return compact.toLowerCase();
}
