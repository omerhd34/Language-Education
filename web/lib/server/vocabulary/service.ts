import {
  getVocabularyCategoryById,
  getVocabularyWordById,
} from "@/data/vocabulary";
import { AppError } from "@/lib/server/AppError";
import { getPrisma } from "@/lib/server/prisma";
import { canAccessVocabularyCategory } from "@/lib/vocabularyAccess";
import {
  ALLOW_EARLY_VOCABULARY_QUIZ,
  BYPASS_LEARN_WORD_LOCK,
  LEARN_WORD_LOCK_MS,
  LEARN_WORD_PERIOD_LIMIT,
  VOCABULARY_QUIZ_DUE_MS,
} from "@/lib/vocabularyLimits";

export type VocabularyWordStatusValue = "KNOWN" | "LEARNING";

export type UserVocabularyStatusMap = Record<string, VocabularyWordStatusValue>;

export type VocabularyStatusPayload = {
  statuses: UserVocabularyStatusMap;
  learningSelectedInPeriod: number;
  learnLimit: number;
  lockedUntil: string | null;
  learningSelectedToday: number;
  dailyLearnLimit: number;
  pendingStudyCount: number;
  pendingStudyWordIds: string[];
};

export type KnownVocabularyWord = {
  id: string;
  en: string;
  tr: string;
  categoryId: string;
  categoryTitle: string;
  statusSetAt: string;
};

export type KnownVocabularyWordsPayload = {
  words: KnownVocabularyWord[];
  count: number;
};

export type StudiedTodayVocabularyWord = KnownVocabularyWord & {
  status: "LEARNING";
  dueAt: string;
};

export type StudiedTodayVocabularyWordsPayload = {
  words: StudiedTodayVocabularyWord[];
  count: number;
};

type LearnQuotaState = {
  selectedCount: number;
  lockedUntil: Date | null;
};

async function getLearnQuotaState(userId: string): Promise<LearnQuotaState> {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      vocabularyLearnSelectedCount: true,
      vocabularyLearnLockedUntil: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404, "NOT_FOUND");
  }

  if (BYPASS_LEARN_WORD_LOCK) {
    if (user.vocabularyLearnLockedUntil !== null) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          vocabularyLearnLockedUntil: null,
        },
      });
    }

    const learningCount = await prisma.userVocabularyWord.count({
      where: {
        userId,
        status: "LEARNING",
      },
    });

    return {
      selectedCount: learningCount,
      lockedUntil: null,
    };
  }

  const now = new Date();
  const lockedUntil = user.vocabularyLearnLockedUntil;

  if (lockedUntil && lockedUntil.getTime() <= now.getTime()) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        vocabularyLearnSelectedCount: 0,
        vocabularyLearnLockedUntil: null,
      },
    });

    return {
      selectedCount: 0,
      lockedUntil: null,
    };
  }

  return {
    selectedCount: user.vocabularyLearnSelectedCount,
    lockedUntil,
  };
}

function toStatusPayload(
  statuses: UserVocabularyStatusMap,
  quota: LearnQuotaState,
  pendingStudyWordIds: string[],
): VocabularyStatusPayload {
  return {
    statuses,
    learningSelectedInPeriod: quota.selectedCount,
    learnLimit: LEARN_WORD_PERIOD_LIMIT,
    lockedUntil: quota.lockedUntil ? quota.lockedUntil.toISOString() : null,
    learningSelectedToday: quota.selectedCount,
    dailyLearnLimit: LEARN_WORD_PERIOD_LIMIT,
    pendingStudyCount: pendingStudyWordIds.length,
    pendingStudyWordIds,
  };
}

async function listPendingStudyWordIds(userId: string): Promise<string[]> {
  const prisma = getPrisma();
  const rows = await prisma.userVocabularyWord.findMany({
    where: {
      userId,
      status: "LEARNING",
      studyStartedAt: null,
    },
    orderBy: { statusSetAt: "asc" },
    select: { wordId: true },
  });

  return rows.map((row) => row.wordId);
}

export async function getVocabularyStatusForUser(
  userId: string,
  categoryId?: string,
): Promise<VocabularyStatusPayload> {
  const prisma = getPrisma();

  let wordIds: string[] | undefined;
  if (categoryId) {
    const category = getVocabularyCategoryById(categoryId);
    if (!category) {
      throw new AppError("Vocabulary category not found", 404, "NOT_FOUND");
    }
    wordIds = category.words.map((word) => word.id);
  }

  const [rows, quota, pendingStudyWordIds] = await Promise.all([
    prisma.userVocabularyWord.findMany({
      where: {
        userId,
        ...(wordIds ? { wordId: { in: wordIds } } : {}),
      },
      select: {
        wordId: true,
        status: true,
      },
    }),
    getLearnQuotaState(userId),
    listPendingStudyWordIds(userId),
  ]);

  const statuses: UserVocabularyStatusMap = {};
  for (const row of rows) {
    statuses[row.wordId] = row.status;
  }

  return toStatusPayload(statuses, quota, pendingStudyWordIds);
}

export async function getKnownVocabularyWordsForUser(
  userId: string,
): Promise<KnownVocabularyWordsPayload> {
  const prisma = getPrisma();
  const rows = await prisma.userVocabularyWord.findMany({
    where: {
      userId,
      status: "KNOWN",
    },
    orderBy: { statusSetAt: "desc" },
    select: {
      wordId: true,
      statusSetAt: true,
    },
  });

  const words: KnownVocabularyWord[] = [];
  for (const row of rows) {
    const found = getVocabularyWordById(row.wordId);
    if (!found) {
      continue;
    }

    words.push({
      id: found.word.id,
      en: found.word.en,
      tr: found.word.tr,
      categoryId: found.category.id,
      categoryTitle: found.category.title,
      statusSetAt: row.statusSetAt.toISOString(),
    });
  }

  return {
    words,
    count: words.length,
  };
}

export async function getStudiedTodayVocabularyWordsForUser(
  userId: string,
): Promise<StudiedTodayVocabularyWordsPayload> {
  if (ALLOW_EARLY_VOCABULARY_QUIZ) {
    return { words: [], count: 0 };
  }

  const prisma = getPrisma();
  const threshold = new Date(Date.now() - VOCABULARY_QUIZ_DUE_MS);
  const rows = await prisma.userVocabularyWord.findMany({
    where: {
      userId,
      status: "LEARNING",
      studyStartedAt: { gt: threshold },
    },
    orderBy: { studyStartedAt: "asc" },
    select: {
      wordId: true,
      statusSetAt: true,
      studyStartedAt: true,
    },
  });

  const words: StudiedTodayVocabularyWord[] = [];
  for (const row of rows) {
    const found = getVocabularyWordById(row.wordId);
    if (!found) {
      continue;
    }

    const startedAt = row.studyStartedAt;
    if (!startedAt) {
      continue;
    }

    words.push({
      id: found.word.id,
      en: found.word.en,
      tr: found.word.tr,
      categoryId: found.category.id,
      categoryTitle: found.category.title,
      statusSetAt: row.statusSetAt.toISOString(),
      status: "LEARNING",
      dueAt: new Date(
        startedAt.getTime() + VOCABULARY_QUIZ_DUE_MS,
      ).toISOString(),
    });
  }

  return {
    words,
    count: words.length,
  };
}

export async function assertVocabularyCategoryAccess(
  userId: string,
  categoryId: string,
): Promise<void> {
  const prisma = getPrisma();
  const rows = await prisma.userVocabularyWord.findMany({
    where: {
      userId,
      status: "KNOWN",
    },
    select: { wordId: true },
  });

  const knownWordIds = new Set(rows.map((row) => row.wordId));
  if (!canAccessVocabularyCategory(categoryId, knownWordIds)) {
    throw new AppError(
      "Vocabulary category is locked",
      403,
      "CATEGORY_LOCKED",
      { categoryId },
    );
  }
}

export async function setVocabularyWordStatus(
  userId: string,
  wordId: string,
  status: VocabularyWordStatusValue | null,
): Promise<VocabularyStatusPayload> {
  const found = getVocabularyWordById(wordId);
  if (!found) {
    throw new AppError("Vocabulary word not found", 404, "NOT_FOUND");
  }

  await assertVocabularyCategoryAccess(userId, found.category.id);

  const prisma = getPrisma();
  const existing = await prisma.userVocabularyWord.findUnique({
    where: {
      userId_wordId: { userId, wordId },
    },
  });

  const wasLearning = existing?.status === "LEARNING";
  const quota = await getLearnQuotaState(userId);
  const periodLocked = !BYPASS_LEARN_WORD_LOCK && Boolean(quota.lockedUntil);

  if (status === "KNOWN" && wasLearning) {
    throw new AppError(
      "Learning words can only become known via quiz",
      400,
      "QUIZ_REQUIRED",
    );
  }

  if (periodLocked && (status === "KNOWN" || wasLearning)) {
    throw new AppError("Learn word period locked", 400, "LEARN_PERIOD_LOCKED", {
      limit: LEARN_WORD_PERIOD_LIMIT,
      lockedUntil: quota.lockedUntil!.toISOString(),
      selectedInPeriod: quota.selectedCount,
    });
  }

  if (status === null) {
    if (existing) {
      await prisma.userVocabularyWord.delete({
        where: { id: existing.id },
      });
    }

    if (wasLearning) {
      await releaseLearnSelectionIfUnlocked(userId);
    }

    return getVocabularyStatusForUser(userId, found.category.id);
  }

  if (status === "LEARNING" && !wasLearning) {
    await consumeLearnSelection(userId);
  }

  if (status !== "LEARNING" && wasLearning) {
    await releaseLearnSelectionIfUnlocked(userId);
  }

  const now = new Date();
  const enteringLearning = status === "LEARNING" && !wasLearning;
  await prisma.userVocabularyWord.upsert({
    where: {
      userId_wordId: { userId, wordId },
    },
    create: {
      userId,
      wordId,
      status,
      statusSetAt: now,
      studyStartedAt: null,
      passedMultipleChoice: false,
      passedFillBlank: false,
      passedListening: false,
    },
    update: {
      status,
      statusSetAt: now,
      ...(enteringLearning
        ? {
            studyStartedAt: null,
            passedMultipleChoice: false,
            passedFillBlank: false,
            passedListening: false,
          }
        : {}),
    },
  });

  return getVocabularyStatusForUser(userId, found.category.id);
}

export async function startVocabularyStudyTimer(
  userId: string,
): Promise<{ startedCount: number }> {
  const prisma = getPrisma();
  const now = new Date();
  const result = await prisma.userVocabularyWord.updateMany({
    where: {
      userId,
      status: "LEARNING",
      studyStartedAt: null,
    },
    data: {
      studyStartedAt: now,
    },
  });

  if (result.count === 0) {
    throw new AppError(
      "No words are waiting for the study timer",
      400,
      "NO_PENDING_STUDY_WORDS",
    );
  }

  return { startedCount: result.count };
}

async function consumeLearnSelection(userId: string): Promise<void> {
  const prisma = getPrisma();
  const quota = await getLearnQuotaState(userId);

  if (quota.selectedCount >= LEARN_WORD_PERIOD_LIMIT) {
    throw new AppError(
      "Learn word period limit reached",
      400,
      "DAILY_LEARN_LIMIT",
      {
        limit: LEARN_WORD_PERIOD_LIMIT,
        selectedInPeriod: quota.selectedCount,
      },
    );
  }

  if (BYPASS_LEARN_WORD_LOCK) {
    return;
  }

  if (quota.lockedUntil) {
    throw new AppError("Learn word period locked", 400, "LEARN_PERIOD_LOCKED", {
      limit: LEARN_WORD_PERIOD_LIMIT,
      lockedUntil: quota.lockedUntil.toISOString(),
      selectedInPeriod: quota.selectedCount,
    });
  }

  const nextCount = quota.selectedCount + 1;
  const lockedUntil =
    nextCount >= LEARN_WORD_PERIOD_LIMIT
      ? new Date(Date.now() + LEARN_WORD_LOCK_MS)
      : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      vocabularyLearnSelectedCount: nextCount,
      vocabularyLearnLockedUntil: lockedUntil,
    },
  });
}

async function releaseLearnSelectionIfUnlocked(userId: string): Promise<void> {
  const prisma = getPrisma();
  const quota = await getLearnQuotaState(userId);

  if (quota.lockedUntil || quota.selectedCount <= 0) {
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      vocabularyLearnSelectedCount: quota.selectedCount - 1,
    },
  });
}
