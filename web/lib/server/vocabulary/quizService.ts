import type { VocabularyWord } from "@/data/vocabulary";
import { getVocabularyWordById, vocabularyCategories } from "@/data/vocabulary";
import { AppError } from "@/lib/server/AppError";
import { getPrisma } from "@/lib/server/prisma";
import {
  ALLOW_EARLY_VOCABULARY_QUIZ,
  VOCABULARY_QUIZ_DUE_MS,
} from "@/lib/vocabularyLimits";

export type VocabularyQuizType = "multiple_choice" | "fill_blank" | "listening";

export type VocabularyQuizTypeProgress = {
  multiple_choice: boolean;
  fill_blank: boolean;
  listening: boolean;
};

export type VocabularyQuizWord = {
  id: string;
  en: string;
  tr: string;
  passed: VocabularyQuizTypeProgress;
};

export type VocabularyQuizQuestion = {
  wordId: string;
  prompt: string;
  options: string[];
};

export type VocabularyQuizPayload = {
  dueCount: number;
  words: VocabularyQuizWord[];
  questions: VocabularyQuizQuestion[];
  nextDueAt: string | null;
  earlyAccess: boolean;
  typeCounts: Record<VocabularyQuizType, number>;
};

export type VocabularyQuizAnswerPayload = {
  correct: boolean;
  expected: string;
  status: "KNOWN" | "LEARNING";
  dueCount: number;
  newlyKnown: boolean;
  passed: VocabularyQuizTypeProgress;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j]!;
    copy[j] = tmp!;
  }
  return copy;
}

function dueThreshold(now = new Date()): Date {
  return new Date(now.getTime() - VOCABULARY_QUIZ_DUE_MS);
}

function allEnglishPool(): string[] {
  return vocabularyCategories.flatMap((category) =>
    category.words.map((word) => word.en),
  );
}

function normalizeComparable(value: string): string {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function normalizeEnglishAnswer(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").toLowerCase();
}

export function isVocabularyQuizAnswerCorrect(
  word: Pick<VocabularyWord, "en" | "tr">,
  answer: string,
): boolean {
  const normalized = normalizeComparable(answer);
  const normalizedEn = normalizeEnglishAnswer(answer);

  return (
    normalized === normalizeComparable(word.tr) ||
    normalized === normalizeComparable(word.en) ||
    normalizedEn === normalizeEnglishAnswer(word.en)
  );
}

function toPassed(row: {
  passedMultipleChoice?: boolean | null;
  passedFillBlank?: boolean | null;
  passedListening?: boolean | null;
}): VocabularyQuizTypeProgress {
  return {
    multiple_choice: Boolean(row.passedMultipleChoice),
    fill_blank: Boolean(row.passedFillBlank),
    listening: Boolean(row.passedListening),
  };
}

function countRemainingByType(
  words: VocabularyQuizWord[],
): Record<VocabularyQuizType, number> {
  return {
    multiple_choice: words.filter((word) => !word.passed.multiple_choice)
      .length,
    fill_blank: words.filter((word) => !word.passed.fill_blank).length,
    listening: words.filter((word) => !word.passed.listening).length,
  };
}

function isFullyPassed(passed: VocabularyQuizTypeProgress): boolean {
  return passed.multiple_choice && passed.fill_blank && passed.listening;
}

export async function getVocabularyQuizForUser(
  userId: string,
): Promise<VocabularyQuizPayload> {
  const prisma = getPrisma();
  const threshold = dueThreshold();
  const earlyAccess = ALLOW_EARLY_VOCABULARY_QUIZ;

  const dueRows = await prisma.userVocabularyWord.findMany({
    where: {
      userId,
      status: "LEARNING",
      ...(earlyAccess ? {} : { statusSetAt: { lte: threshold } }),
    },
    orderBy: { statusSetAt: "asc" },
    select: {
      wordId: true,
      statusSetAt: true,
      passedMultipleChoice: true,
      passedFillBlank: true,
      passedListening: true,
    },
  });

  const waiting = earlyAccess
    ? null
    : await prisma.userVocabularyWord.findFirst({
        where: {
          userId,
          status: "LEARNING",
          statusSetAt: { gt: threshold },
        },
        orderBy: { statusSetAt: "asc" },
        select: { statusSetAt: true },
      });

  const pool = allEnglishPool();
  const words: VocabularyQuizWord[] = [];
  const questions: VocabularyQuizQuestion[] = [];

  for (const row of dueRows) {
    const found = getVocabularyWordById(row.wordId);
    if (!found) {
      continue;
    }

    const passed = toPassed(row);
    words.push({
      id: found.word.id,
      en: found.word.en,
      tr: found.word.tr,
      passed,
    });

    const distractors = shuffle(
      pool.filter((item) => item !== found.word.en),
    ).slice(0, 3);

    while (distractors.length < 3) {
      distractors.push(`Option ${distractors.length + 1}`);
    }

    const options = shuffle([found.word.en, ...distractors.slice(0, 3)]);

    questions.push({
      wordId: found.word.id,
      prompt: `"${found.word.tr}" kelimesinin İngilizcesi nedir?`,
      options,
    });
  }

  const nextDueAt = waiting
    ? new Date(
        waiting.statusSetAt.getTime() + VOCABULARY_QUIZ_DUE_MS,
      ).toISOString()
    : null;

  return {
    dueCount: words.length,
    words,
    questions,
    nextDueAt,
    earlyAccess,
    typeCounts: countRemainingByType(words),
  };
}

export async function answerVocabularyQuizQuestion(
  userId: string,
  wordId: string,
  answer: string,
  quizType: VocabularyQuizType,
): Promise<VocabularyQuizAnswerPayload> {
  const found = getVocabularyWordById(wordId);
  if (!found) {
    throw new AppError("Vocabulary word not found", 404, "NOT_FOUND");
  }

  const prisma = getPrisma();
  const existing = await prisma.userVocabularyWord.findUnique({
    where: {
      userId_wordId: { userId, wordId },
    },
    select: {
      id: true,
      status: true,
      statusSetAt: true,
      passedMultipleChoice: true,
      passedFillBlank: true,
      passedListening: true,
    },
  });

  if (!existing || existing.status !== "LEARNING") {
    throw new AppError("Word is not in learning quiz", 400, "NOT_IN_QUIZ");
  }

  if (!ALLOW_EARLY_VOCABULARY_QUIZ) {
    const threshold = dueThreshold();
    if (existing.statusSetAt.getTime() > threshold.getTime()) {
      throw new AppError("Word is not due for quiz yet", 400, "NOT_DUE");
    }
  }

  const correct = isVocabularyQuizAnswerCorrect(found.word, answer);
  const now = new Date();
  let passed = toPassed(existing);
  let newlyKnown = false;
  let status: "KNOWN" | "LEARNING" = "LEARNING";

  if (correct) {
    passed = {
      ...passed,
      [quizType]: true,
    };

    newlyKnown = isFullyPassed(passed);
    status = newlyKnown ? "KNOWN" : "LEARNING";

    await prisma.userVocabularyWord.update({
      where: { id: existing.id },
      data: {
        status,
        statusSetAt: now,
        passedMultipleChoice: passed.multiple_choice,
        passedFillBlank: passed.fill_blank,
        passedListening: passed.listening,
      },
    });
  } else {
    await prisma.userVocabularyWord.update({
      where: { id: existing.id },
      data: {
        status: "LEARNING",
        statusSetAt: now,
      },
    });
  }

  const quiz = await getVocabularyQuizForUser(userId);

  return {
    correct,
    expected: found.word.en,
    status,
    dueCount: quiz.dueCount,
    newlyKnown,
    passed,
  };
}
