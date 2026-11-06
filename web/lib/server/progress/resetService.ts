import { getPrisma } from "@/lib/server/prisma";
import type { ProgressResetScope } from "@/validators/progress.schema";

export type ProgressResetPayload = {
  scope: ProgressResetScope;
  vocabularyDeleted: number;
  topicProgressDeleted: number;
  streakReset: boolean;
};

async function resetVocabulary(userId: string): Promise<number> {
  const prisma = getPrisma();
  const deleted = await prisma.userVocabularyWord.deleteMany({
    where: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      vocabularyLearnSelectedCount: 0,
      vocabularyLearnLockedUntil: null,
      vocabularyLearnLastSelectedAt: null,
      vocabularyLearnLastUnlockedAt: null,
    },
  });

  return deleted.count;
}

async function resetTopics(userId: string): Promise<{
  topicProgressDeleted: number;
  streakReset: boolean;
}> {
  const prisma = getPrisma();

  const deleted = await prisma.userProgress.deleteMany({
    where: { userId },
  });

  const streak = await prisma.streak.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (streak) {
    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: null,
      },
    });
  }

  return {
    topicProgressDeleted: deleted.count,
    streakReset: Boolean(streak),
  };
}

export async function resetUserProgress(
  userId: string,
  scope: ProgressResetScope,
): Promise<ProgressResetPayload> {
  let vocabularyDeleted = 0;
  let topicProgressDeleted = 0;
  let streakReset = false;

  if (scope === "vocabulary" || scope === "all") {
    vocabularyDeleted = await resetVocabulary(userId);
  }

  if (scope === "topics" || scope === "all") {
    const topics = await resetTopics(userId);
    topicProgressDeleted = topics.topicProgressDeleted;
    streakReset = topics.streakReset;
  }

  return {
    scope,
    vocabularyDeleted,
    topicProgressDeleted,
    streakReset,
  };
}
