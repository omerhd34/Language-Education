import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import { examA1Clues } from "@/data/topics/exam/examA1";
import { examA2Clues } from "@/data/topics/exam/examA2";
import { examB1Clues } from "@/data/topics/exam/examB1";
import { examB2Clues } from "@/data/topics/exam/examB2";
import { examC1Clues } from "@/data/topics/exam/examC1";
import { examC2Clues } from "@/data/topics/exam/examC2";
import type {
  CrosswordExercise,
  FillBlankExercise,
  MultipleChoiceExercise,
  TopicContent,
} from "@/data/topics/types";
import {
  buildCrosswordFromCandidates,
  type CrosswordCandidate,
} from "@/lib/crosswordBuilder";
import { shuffleSeeded } from "@/lib/seededRandom";

const LEVEL_EXAM_CLUES: Record<CefrLevel, CrosswordCandidate[]> = {
  A1: examA1Clues,
  A2: examA2Clues,
  B1: examB1Clues,
  B2: examB2Clues,
  C1: examC1Clues,
  C2: examC2Clues,
};

function getLevelExamClues(level: CefrLevel): CrosswordCandidate[] {
  return LEVEL_EXAM_CLUES[level];
}

export const TOPIC_EXAM_OPTION_COUNT = 4;
export const TOPIC_EXAM_QUESTION_COUNT = 10;

export const LEVEL_EXAM_CROSSWORD_COUNT = 1;
export const LEVEL_EXAM_CLUE_COUNT = 20;
export const LEVEL_EXAM_FILL_BLANK_COUNT = 20;

export const TOPIC_EXAM_PASS_RATIO = 0.85;

const FALLBACK_DISTRACTORS = [
  "Hiçbiri",
  "Hepsi doğru",
  "Belirsiz",
  "Konu dışı",
  "Yanlış kalıp",
  "Eş anlamlı değil",
  "Atlanır",
  "Örnek yok",
  "Tamamen farklı",
  "Sadece ezber",
];

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleOptions(options: string[], seed: string): string[] {
  const next = [...options];
  let state = hashString(seed) || 1;
  for (let i = next.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const current = next[i];
    const swap = next[j];
    if (current === undefined || swap === undefined) {
      continue;
    }
    next[i] = swap;
    next[j] = current;
  }
  return next;
}

function uniquePush(options: string[], value: string): void {
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }
  if (
    options.some(
      (item) =>
        item.toLocaleLowerCase("tr") === trimmed.toLocaleLowerCase("tr"),
    )
  ) {
    return;
  }
  options.push(trimmed);
}

export function ensureExamOptionCount(
  exercise: MultipleChoiceExercise,
  distractorPool: string[] = [],
  count: number = TOPIC_EXAM_OPTION_COUNT,
): MultipleChoiceExercise {
  const correct =
    exercise.options[exercise.correctIndex] ?? exercise.options[0] ?? "";
  const options: string[] = [];

  uniquePush(options, correct);
  for (const option of exercise.options) {
    if (options.length >= count) {
      break;
    }
    uniquePush(options, option);
  }
  for (const distractor of distractorPool) {
    if (options.length >= count) {
      break;
    }
    uniquePush(options, distractor);
  }
  for (const distractor of FALLBACK_DISTRACTORS) {
    if (options.length >= count) {
      break;
    }
    uniquePush(options, distractor);
  }

  let filler = 1;
  while (options.length < count) {
    uniquePush(options, `Seçenek ${filler}`);
    filler += 1;
  }

  const finalOptions = shuffleOptions(
    options.slice(0, count),
    `${exercise.id}|${correct}`,
  );
  const correctIndex = Math.max(0, finalOptions.indexOf(correct));

  return {
    ...exercise,
    type: "multiple_choice",
    options: finalOptions,
    correctIndex,
  };
}

function listQuizExercises(content: TopicContent) {
  return content.quizExercises ?? [];
}

function practiceMultipleChoice(
  content: TopicContent,
): MultipleChoiceExercise[] {
  return content.exercises.filter(
    (item): item is MultipleChoiceExercise => item.type === "multiple_choice",
  );
}

function pushUniqueQuestion(
  target: MultipleChoiceExercise[],
  seen: Set<string>,
  item: MultipleChoiceExercise,
): void {
  const key = item.prompt.trim().toLocaleLowerCase("tr");
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  target.push(item);
}

function buildExtraTopicQuestions(
  content: TopicContent,
  needed: number,
  distractorPool: string[],
): MultipleChoiceExercise[] {
  if (needed <= 0) {
    return [];
  }

  const topic = dashboardTopics.find((item) => item.id === content.topicId);
  const extras: MultipleChoiceExercise[] = [];
  const subtopics = topic?.subtopics ?? [];

  for (const subtopic of subtopics) {
    if (extras.length >= needed) {
      break;
    }
    extras.push(
      ensureExamOptionCount(
        {
          id: `quiz-extra-${content.topicId}-${subtopic.id}-1`,
          subtopicId: subtopic.id,
          type: "multiple_choice",
          prompt: `"${subtopic.title}" hangi konunun parçasıdır?`,
          options: [
            topic?.title ?? content.topicId,
            "Farklı bir konu",
            "Kelime listesi",
            "Hiçbiri",
          ],
          correctIndex: 0,
          explanation: `"${subtopic.title}" bu konuya aittir.`,
        },
        distractorPool,
      ),
    );
    if (extras.length >= needed) {
      break;
    }
    extras.push(
      ensureExamOptionCount(
        {
          id: `quiz-extra-${content.topicId}-${subtopic.id}-2`,
          subtopicId: subtopic.id,
          type: "multiple_choice",
          prompt: `"${subtopic.title}" için en iyi çalışma yolu hangisidir?`,
          options: [
            "Örnekleri okuyup pratik yapmak",
            "Konuyu atlamak",
            "Hiç tekrar etmemek",
            "Sadece ezberlemek",
          ],
          correctIndex: 0,
          explanation: "Örnek + pratik kalıcı öğrenmeye yardımcı olur.",
        },
        distractorPool,
      ),
    );
  }

  let index = extras.length;
  while (extras.length < needed) {
    index += 1;
    extras.push(
      ensureExamOptionCount(
        {
          id: `quiz-extra-${content.topicId}-pad-${index}`,
          subtopicId: subtopics[0]?.id ?? content.topicId,
          type: "multiple_choice",
          prompt: `Bu konuyla ilgili doğru ifade hangisidir? (${index})`,
          options: [
            "Düzenli pratik ilerlemeyi hızlandırır",
            "Hiç alıştırma çözmemek yeterlidir",
            "Konuyu tamamen atlamak gerekir",
            "Örnekleri okumamak daha iyidir",
          ],
          correctIndex: 0,
          explanation: "Düzenli pratik öğrenmeyi pekiştirir.",
        },
        distractorPool,
      ),
    );
  }

  return extras.slice(0, needed);
}

export function resolveTopicExamExercises(
  content: TopicContent,
): MultipleChoiceExercise[] {
  const questionCount =
    content.quizQuestionCount && content.quizQuestionCount > 0
      ? content.quizQuestionCount
      : TOPIC_EXAM_QUESTION_COUNT;
  const practice = practiceMultipleChoice(content);
  const pool = [
    ...practice.flatMap((item) => item.options),
    ...FALLBACK_DISTRACTORS,
  ];
  const seen = new Set<string>();
  const source: MultipleChoiceExercise[] = [];
  const quizMultipleChoice = listQuizExercises(content).filter(
    (item): item is MultipleChoiceExercise => item.type === "multiple_choice",
  );

  for (const item of quizMultipleChoice) {
    pushUniqueQuestion(source, seen, item);
  }
  if (quizMultipleChoice.length === 0 && source.length < questionCount) {
    for (const item of practice) {
      pushUniqueQuestion(source, seen, {
        ...item,
        id: `quiz-${item.id}`,
      });
    }
  }

  if (source.length < questionCount) {
    for (const item of buildExtraTopicQuestions(
      content,
      questionCount - source.length,
      pool,
    )) {
      pushUniqueQuestion(source, seen, item);
    }
  }

  const optionCount =
    content.quizOptionCount && content.quizOptionCount > 1
      ? content.quizOptionCount
      : TOPIC_EXAM_OPTION_COUNT;

  return source
    .slice(0, questionCount)
    .map((item) => ensureExamOptionCount(item, pool, optionCount));
}

export function resolveTopicExamFillBlanks(
  content: TopicContent,
): FillBlankExercise[] {
  return listQuizExercises(content)
    .filter((item): item is FillBlankExercise => item.type === "fill_blank")
    .map((item) => ({
      ...item,
      id: item.id.startsWith("quiz-") ? item.id : `quiz-${item.id}`,
    }));
}

export function resolveTopicExamCrosswords(
  content: TopicContent,
): CrosswordExercise[] {
  return listQuizExercises(content)
    .filter((item): item is CrosswordExercise => item.type === "crossword")
    .slice(0, 1)
    .map((item) => ({
      ...item,
      id: item.id.startsWith("quiz-") ? item.id : `quiz-${item.id}`,
    }));
}

function shuffleCandidates(
  items: CrosswordCandidate[],
  seed: string,
): CrosswordCandidate[] {
  return shuffleSeeded(items, seed);
}

function collectLevelCrosswordCandidates(
  level: CefrLevel,
): CrosswordCandidate[] {
  const candidates: CrosswordCandidate[] = [];
  const seenAnswers = new Set<string>();

  for (const item of getLevelExamClues(level)) {
    const normalized = item.answer.replace(/[^a-zA-Z]/g, "").toUpperCase();
    if (normalized.length < 2 || normalized.length > 14) {
      continue;
    }
    if (seenAnswers.has(normalized)) {
      continue;
    }
    seenAnswers.add(normalized);
    candidates.push({
      answer: normalized,
      text: item.text.trim(),
    });
  }

  return candidates;
}

function createLevelExamCrossword(level: CefrLevel): CrosswordExercise {
  const pool = collectLevelCrosswordCandidates(level);
  const targetClues = Math.min(LEVEL_EXAM_CLUE_COUNT, Math.max(pool.length, 1));

  let best: CrosswordExercise | null = null;
  const attempts = 24;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const picked = shuffleCandidates(
      pool,
      `level-cw:${level}:${attempt}`,
    ).slice(0, targetClues);
    const built = buildCrosswordFromCandidates(picked, {
      id: `level-exam-cw-${level}-${attempt}`,
      subtopicId: `level-exam-${level}`,
      targetClues,
      minClues: Math.min(6, targetClues),
    });

    if (!built) {
      continue;
    }

    if (built.clues.length === targetClues) {
      return built;
    }

    if (!best || built.clues.length > best.clues.length) {
      best = built;
    }
  }

  if (best) {
    return best;
  }

  throw new Error(`Yeterlilik bulmacası üretilemedi: ${level}`);
}

export type LevelExamPart = "crossword" | "fill_blank";

export function getLevelExamParts(level: CefrLevel): LevelExamPart[] {
  const usable = getLevelExamClues(level).filter((item) => {
    const normalized = item.answer.replace(/[^a-zA-Z]/g, "");
    return normalized.length >= 2 && normalized.length <= 14;
  });
  if (usable.length === 0) {
    return [];
  }

  const parts: LevelExamPart[] = [];
  if (LEVEL_EXAM_FILL_BLANK_COUNT > 0) {
    parts.push("fill_blank");
  }
  if (LEVEL_EXAM_CROSSWORD_COUNT > 0) {
    parts.push("crossword");
  }
  return parts;
}

export function resolveLevelExamCrosswords(
  level: CefrLevel,
): CrosswordExercise[] {
  return [createLevelExamCrossword(level)].slice(0, LEVEL_EXAM_CROSSWORD_COUNT);
}

function toTitleCaseAnswer(answer: string): string {
  const lower = answer.toLocaleLowerCase("en-US");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function createLevelExamFillBlanks(level: CefrLevel): FillBlankExercise[] {
  const pool = collectLevelCrosswordCandidates(level);
  const target = Math.min(LEVEL_EXAM_FILL_BLANK_COUNT, pool.length);
  const picked = shuffleCandidates(pool, `level-fb:${level}`).slice(0, target);

  return picked.map((item, index) => {
    const displayAnswer = toTitleCaseAnswer(item.answer);
    return {
      id: `level-exam-fb-${level}-${index + 1}`,
      subtopicId: `level-exam-${level}`,
      type: "fill_blank" as const,
      prompt: `"${item.text}" İngilizcede _____ olarak yazılır.`,
      answer: displayAnswer,
      acceptedAnswers: [
        item.answer,
        item.answer.toLocaleLowerCase("en-US"),
        displayAnswer,
      ],
      explanation: `${displayAnswer} = ${item.text}`,
    };
  });
}

export function resolveLevelExamFillBlanks(
  level: CefrLevel,
): FillBlankExercise[] {
  return createLevelExamFillBlanks(level);
}

export function didPassTopicExamScore(correct: number, total: number): boolean {
  if (total <= 0) {
    return false;
  }
  return correct / total >= TOPIC_EXAM_PASS_RATIO;
}
