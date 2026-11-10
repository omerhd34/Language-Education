import type { VocabularyExample, VocabularyWord } from "@/data/vocabulary";
import type { EnglishVerb } from "@/data/vocabulary/verbs";
import type {
  CrosswordExercise,
  FillBlankExercise,
  ListeningExercise,
  MultipleChoiceExercise,
  TopicExercise,
  VerbListeningRow,
} from "@/data/topics/types";
import {
  generateCrosswordExercise,
  type CrosswordGenerateOptions,
} from "@/lib/vocabulary/generateExercises";
import { shuffleSeeded } from "@/lib/seededRandom";

export const VERB_EXERCISE_QUESTION_LIMIT = 30;

export const VERB_CROSSWORD_CLUE_COUNT = 12;

export const VERB_LISTENING_BATCH_SIZE = 8;

export const VERB_LISTENING_EXERCISE_LIMIT = 5;

export type VerbExerciseSessionSeeds = {
  multiple_choice: string;
  fill_blank: string;
  listening: string;
  crossword: string;
};

const VERB_CROSSWORD_OPTIONS: CrosswordGenerateOptions = {
  maxWords: VERB_CROSSWORD_CLUE_COUNT,
  minGridSize: 18,
  maxGridSize: 28,
  gridPadding: 8,
};

const CROSSWORD_EXAMPLE_STUB: VocabularyExample = {
  en: "—",
  tr: "—",
};

function primaryForm(form: string): string {
  return form.split("/")[0]?.trim() ?? form;
}

function normalizeCrosswordAnswer(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function limitVerbExercises<
  T extends MultipleChoiceExercise | FillBlankExercise | ListeningExercise,
>(
  items: T[],
  categoryId: string,
  exerciseKind: "multiple_choice" | "fill_blank" | "listening",
  sessionSeed: string,
): T[] {
  const limit =
    exerciseKind === "listening"
      ? VERB_LISTENING_EXERCISE_LIMIT
      : VERB_EXERCISE_QUESTION_LIMIT;

  return shuffleSeeded(
    items,
    `${categoryId}:verb-exercise-limit:${exerciseKind}:${sessionSeed}`,
  ).slice(0, limit);
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

function acceptedForms(form: string): string[] {
  const base = normalizeAnswer(form);
  const parts = form
    .split("/")
    .map((part) => normalizeAnswer(part))
    .filter(Boolean);
  return [...new Set([base, ...parts])];
}

function pickFormDistractors(
  verbs: EnglishVerb[],
  excludeId: string,
  count: number,
  field: "pastSimple" | "pastParticiple",
  seed: string,
): string[] {
  const pool = shuffleSeeded(
    verbs.filter((verb) => verb.id !== excludeId).map((verb) => verb[field]),
    seed,
  );
  return pool.slice(0, count);
}

/** Yanlış ama öğrencinin deneyebileceği -ed / yazım varyantları (put → putted, puted, putd). */
function generateMorphologicalDistractors(
  infinitive: string,
  correct: string,
  seed: string,
): string[] {
  const correctNorm = normalizeAnswer(correct);
  const inf = infinitive.toLowerCase().trim();
  const pool = new Set<string>();

  const push = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    if (normalizeAnswer(trimmed) === correctNorm) {
      return;
    }
    pool.add(trimmed);
  };

  push(`${inf}ed`);
  push(`${inf}d`);
  push(`${inf}ted`);
  push(`${inf}t`);
  push(`${inf}en`);
  push(`${inf}n`);
  push(inf);

  if (inf.endsWith("e")) {
    push(`${inf.slice(0, -1)}ed`);
  }
  if (inf.endsWith("y") && !/[aeiou]y$/i.test(inf)) {
    push(`${inf.slice(0, -1)}ied`);
    push(`${inf}yed`);
  }
  if (inf.endsWith("y") && /[aeiou]y$/i.test(inf)) {
    push(`${inf}yed`);
  }

  const last = inf.at(-1);
  if (
    last &&
    /[bdfghjklmnpqrstvwxz]/i.test(last) &&
    !inf.endsWith(`${last}${last}`)
  ) {
    push(`${inf}${last}ed`);
  }

  const primaryCorrect = primaryForm(correct);
  push(`${primaryCorrect}ed`);
  push(`${primaryCorrect}d`);
  if (primaryCorrect.length >= 2) {
    push(`${primaryCorrect.slice(0, -1)}d`);
  }
  push(`${inf}ded`);

  const ranked = shuffleSeeded([...pool], seed);
  const picked: string[] = [];
  for (const candidate of ranked) {
    if (picked.length >= 3) {
      break;
    }
    if (
      picked.some(
        (item) => normalizeAnswer(item) === normalizeAnswer(candidate),
      )
    ) {
      continue;
    }
    picked.push(candidate);
  }
  return picked;
}

function pickSimilarMcDistractors(
  verbs: EnglishVerb[],
  verb: EnglishVerb,
  correct: string,
  field: "pastSimple" | "pastParticiple",
  seed: string,
): string[] {
  const distractors = generateMorphologicalDistractors(
    verb.infinitive,
    correct,
    seed,
  );

  if (distractors.length >= 3) {
    return distractors.slice(0, 3);
  }

  const merged = [...distractors];
  const fallback = pickFormDistractors(
    verbs,
    verb.id,
    8,
    field,
    `${seed}:fallback`,
  );
  for (const item of fallback) {
    if (merged.length >= 3) {
      break;
    }
    if (normalizeAnswer(item) === normalizeAnswer(correct)) {
      continue;
    }
    if (
      merged.some(
        (existing) => normalizeAnswer(existing) === normalizeAnswer(item),
      )
    ) {
      continue;
    }
    merged.push(item);
  }

  return merged.slice(0, 3);
}

function mergeMcOptions(
  correct: string,
  distractors: string[],
  seed: string,
): string[] {
  const seen = new Set<string>();
  const options: string[] = [];

  const add = (value: string) => {
    const key = normalizeAnswer(value);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    options.push(value);
  };

  add(correct);
  for (const distractor of distractors) {
    add(distractor);
  }

  return shuffleSeeded(options, seed);
}

export function generateVerbMultipleChoiceExercises(
  verbs: EnglishVerb[],
  categoryId: string,
): MultipleChoiceExercise[] {
  return verbs.map((verb) => {
    const distractors = pickSimilarMcDistractors(
      verbs,
      verb,
      verb.pastSimple,
      "pastSimple",
      `${categoryId}:${verb.id}:mc-ps`,
    );

    const options = mergeMcOptions(
      verb.pastSimple,
      distractors,
      `${categoryId}:${verb.id}:mc-ps-options`,
    );

    return {
      id: `verb-mc-ps-${categoryId}-${verb.id}`,
      subtopicId: categoryId,
      type: "multiple_choice",
      prompt: `"${verb.infinitive}" fiilinin past simple (V2) hali hangisidir?`,
      options,
      correctIndex: options.indexOf(verb.pastSimple),
    };
  });
}

export function generateVerbPastParticipleMcExercises(
  verbs: EnglishVerb[],
  categoryId: string,
): MultipleChoiceExercise[] {
  return verbs
    .filter(
      (verb) =>
        normalizeAnswer(verb.pastSimple) !==
        normalizeAnswer(verb.pastParticiple),
    )
    .map((verb) => {
      const distractors = pickSimilarMcDistractors(
        verbs,
        verb,
        verb.pastParticiple,
        "pastParticiple",
        `${categoryId}:${verb.id}:mc-pp`,
      );

      const options = mergeMcOptions(
        verb.pastParticiple,
        distractors,
        `${categoryId}:${verb.id}:mc-pp-options`,
      );

      return {
        id: `verb-mc-pp-${categoryId}-${verb.id}`,
        subtopicId: categoryId,
        type: "multiple_choice",
        prompt: `"${verb.infinitive}" fiilinin past participle (V3) hali hangisidir?`,
        options,
        correctIndex: options.indexOf(verb.pastParticiple),
      };
    });
}

export function generateVerbFillBlankExercises(
  verbs: EnglishVerb[],
  categoryId: string,
): FillBlankExercise[] {
  const exercises: FillBlankExercise[] = verbs.map((verb) => ({
    id: `verb-fb-ps-${categoryId}-${verb.id}`,
    subtopicId: categoryId,
    type: "fill_blank",
    prompt: `"${verb.infinitive}" fiilinin past simple (V2) halini yaz.`,
    answer: verb.pastSimple,
    acceptedAnswers: acceptedForms(verb.pastSimple),
  }));

  for (const verb of verbs) {
    if (
      normalizeAnswer(verb.pastSimple) === normalizeAnswer(verb.pastParticiple)
    ) {
      continue;
    }

    exercises.push({
      id: `verb-fb-pp-${categoryId}-${verb.id}`,
      subtopicId: categoryId,
      type: "fill_blank",
      prompt: `"${verb.infinitive}" fiilinin past participle (V3) halini yaz.`,
      answer: verb.pastParticiple,
      acceptedAnswers: acceptedForms(verb.pastParticiple),
    });
  }

  return exercises;
}

function pickInfinitiveDistractors(
  verbs: EnglishVerb[],
  excludeId: string,
  count: number,
  seed: string,
): string[] {
  return shuffleSeeded(
    verbs
      .filter((verb) => verb.id !== excludeId)
      .map((verb) => verb.infinitive),
    seed,
  ).slice(0, count);
}

function buildVerbBatchListeningItem(
  batch: EnglishVerb[],
  categoryId: string,
): ListeningExercise {
  const batchKey = batch.map((verb) => verb.id).join("-");
  const v2Pool = shuffleSeeded(
    batch.map((verb) => primaryForm(verb.pastSimple)),
    `${categoryId}:listen-v2-pool:${batchKey}`,
  );
  const v3Pool = shuffleSeeded(
    batch.map((verb) => primaryForm(verb.pastParticiple)),
    `${categoryId}:listen-v3-pool:${batchKey}`,
  );

  const rows: VerbListeningRow[] = batch.map((verb) => {
    const v2 = primaryForm(verb.pastSimple);
    const v3 = primaryForm(verb.pastParticiple);
    return {
      verbId: verb.id,
      v1: verb.infinitive,
      regular: verb.regular,
      v2CorrectPoolIndex: v2Pool.indexOf(v2),
      v3CorrectPoolIndex: v3Pool.indexOf(v3),
    };
  });

  return {
    id: `verb-listen-batch-${categoryId}-${batchKey}`,
    subtopicId: categoryId,
    type: "listening",
    verbTripleForm: true,
    verbListeningRows: rows,
    verbListeningV2Pool: v2Pool,
    verbListeningV3Pool: v3Pool,
    prompt: "",
    speakText: "",
    englishOptions: v3Pool,
    englishCorrectIndex: 0,
    turkishOptions: batch.map((verb) => verb.infinitive),
    turkishCorrectIndex: 0,
    v2Options: v2Pool,
    v2CorrectIndex: 0,
  };
}

function generateVerbListeningExercises(
  verbs: EnglishVerb[],
  categoryId: string,
): ListeningExercise[] {
  if (verbs.length < VERB_LISTENING_BATCH_SIZE) {
    return [];
  }

  const shuffled = shuffleSeeded(verbs, `${categoryId}:listen-batches`);
  const exercises: ListeningExercise[] = [];

  for (
    let index = 0;
    index + VERB_LISTENING_BATCH_SIZE <= shuffled.length;
    index += VERB_LISTENING_BATCH_SIZE
  ) {
    exercises.push(
      buildVerbBatchListeningItem(
        shuffled.slice(index, index + VERB_LISTENING_BATCH_SIZE),
        categoryId,
      ),
    );
  }

  return exercises;
}

function verbToCrosswordWord(verb: EnglishVerb): VocabularyWord | null {
  const answer = normalizeCrosswordAnswer(primaryForm(verb.pastSimple));
  if (answer.length < 3 || answer.length > 14) {
    return null;
  }

  return {
    id: verb.id,
    en: answer,
    tr: `${verb.infinitive} → V2`,
    examples: [
      CROSSWORD_EXAMPLE_STUB,
      CROSSWORD_EXAMPLE_STUB,
      CROSSWORD_EXAMPLE_STUB,
    ],
  };
}

function generateVerbCrosswordExercise(
  verbs: EnglishVerb[],
  categoryId: string,
  sessionSeed: string,
): CrosswordExercise | null {
  const shuffled = shuffleSeeded(
    verbs,
    `${categoryId}:verb-crossword-pool:${sessionSeed}`,
  );
  const eligible = shuffled
    .map(verbToCrosswordWord)
    .filter((word): word is VocabularyWord => word !== null);

  if (eligible.length < VERB_CROSSWORD_CLUE_COUNT) {
    return generateCrosswordExercise(
      eligible,
      `${categoryId}:${sessionSeed}`,
      VERB_CROSSWORD_OPTIONS,
    );
  }

  let best: CrosswordExercise | null = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const pool = shuffleSeeded(
      eligible,
      `${categoryId}:verb-crossword-attempt:${sessionSeed}:${attempt}`,
    );
    const crossword = generateCrosswordExercise(
      pool,
      `${categoryId}:${sessionSeed}:${attempt}`,
      VERB_CROSSWORD_OPTIONS,
    );

    if (!crossword) {
      continue;
    }

    if (crossword.clues.length >= VERB_CROSSWORD_CLUE_COUNT) {
      return {
        ...crossword,
        id: `verb-cw-${categoryId}-${sessionSeed}`,
        subtopicId: categoryId,
      };
    }

    if (!best || crossword.clues.length > best.clues.length) {
      best = crossword;
    }
  }

  if (!best) {
    return null;
  }

  return {
    ...best,
    id: `verb-cw-${categoryId}-${sessionSeed}`,
    subtopicId: categoryId,
  };
}

export function generateVerbExercises(
  verbs: EnglishVerb[],
  categoryId: string,
  sessionSeeds: VerbExerciseSessionSeeds,
): TopicExercise[] {
  const multipleChoice = limitVerbExercises(
    [
      ...generateVerbMultipleChoiceExercises(verbs, categoryId),
      ...generateVerbPastParticipleMcExercises(verbs, categoryId),
    ],
    categoryId,
    "multiple_choice",
    sessionSeeds.multiple_choice,
  );

  const fillBlank = limitVerbExercises(
    generateVerbFillBlankExercises(verbs, categoryId),
    categoryId,
    "fill_blank",
    sessionSeeds.fill_blank,
  );

  const listening = limitVerbExercises(
    generateVerbListeningExercises(verbs, categoryId),
    categoryId,
    "listening",
    sessionSeeds.listening,
  );

  const crossword = generateVerbCrosswordExercise(
    verbs,
    categoryId,
    sessionSeeds.crossword,
  );

  return [
    ...multipleChoice,
    ...fillBlank,
    ...listening,
    ...(crossword ? [crossword] : []),
  ];
}
