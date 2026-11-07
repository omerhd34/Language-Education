import { getPrisma } from "@/lib/server/prisma";
import { getStartOfDayInTimeZone } from "@/lib/server/date";

export type StreakPayload = {
  currentStreak: number;
  longestStreak: number;
  activeToday: boolean;
  lastActivityAt: string | null;
};

function dayKey(date: Date): number {
  return getStartOfDayInTimeZone(date).getTime();
}

function yesterdayKey(today: number): number {
  return today - 24 * 60 * 60 * 1000;
}

async function ensureStreakRow(userId: string) {
  const prisma = getPrisma();
  return prisma.streak.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

function toPayload(row: {
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
}): StreakPayload {
  const today = dayKey(new Date());
  const lastDay = row.lastActivityAt ? dayKey(row.lastActivityAt) : null;
  const activeToday = lastDay === today;

  let currentStreak = row.currentStreak;
  if (lastDay == null || (lastDay !== today && lastDay !== yesterdayKey(today))) {
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak: row.longestStreak,
    activeToday,
    lastActivityAt: row.lastActivityAt?.toISOString() ?? null,
  };
}

export async function getStreakForUser(userId: string): Promise<StreakPayload> {
  const prisma = getPrisma();
  let row = await ensureStreakRow(userId);
  const today = dayKey(new Date());
  const lastDay = row.lastActivityAt ? dayKey(row.lastActivityAt) : null;

  if (
    row.currentStreak > 0 &&
    (lastDay == null ||
      (lastDay !== today && lastDay !== yesterdayKey(today)))
  ) {
    row = await prisma.streak.update({
      where: { userId },
      data: { currentStreak: 0 },
    });
  }

  return toPayload(row);
}

export async function recordStreakActivity(
  userId: string,
): Promise<StreakPayload> {
  const prisma = getPrisma();
  const now = new Date();
  const today = dayKey(now);
  const row = await ensureStreakRow(userId);
  const lastDay = row.lastActivityAt ? dayKey(row.lastActivityAt) : null;

  if (lastDay === today) {
    return toPayload(row);
  }

  const nextCurrent =
    lastDay === yesterdayKey(today) ? row.currentStreak + 1 : 1;
  const nextLongest = Math.max(row.longestStreak, nextCurrent);

  const updated = await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: nextCurrent,
      longestStreak: nextLongest,
      lastActivityAt: now,
    },
  });

  return toPayload(updated);
}
