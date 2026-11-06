import { LEARN_WORD_LOCK_MS } from "@/lib/vocabularyLimits";

export type LearnMissedDayInput = {
  nowMs: number;
  lastSelectedAt: string | null;
  learnUnlockedAt: string | null;
  lockedUntil: string | null;
  accountCreatedAt: string | null;
};

export type LearnMissedDayNotice = {
  id: string;
  anchorMs: number;
};

function parseTime(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getLearnMissedDayNotice(
  input: LearnMissedDayInput,
): LearnMissedDayNotice | null {
  if (input.lockedUntil) {
    return null;
  }

  const lastSelectedMs = parseTime(input.lastSelectedAt);
  const unlockedMs = parseTime(input.learnUnlockedAt);
  const createdMs = parseTime(input.accountCreatedAt);

  let anchor: number | null = null;
  if (
    unlockedMs != null &&
    (lastSelectedMs == null || unlockedMs >= lastSelectedMs)
  ) {
    anchor = unlockedMs;
  } else if (lastSelectedMs != null) {
    anchor = lastSelectedMs;
  } else {
    anchor = createdMs;
  }

  if (anchor == null) {
    return null;
  }

  const elapsed = input.nowMs - anchor;
  if (elapsed < LEARN_WORD_LOCK_MS) {
    return null;
  }

  const bucket = Math.floor(elapsed / LEARN_WORD_LOCK_MS);
  return {
    id: `learn-missed-${anchor}-${bucket}`,
    anchorMs: anchor,
  };
}
