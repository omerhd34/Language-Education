import { LEARN_WORD_LOCK_MS } from "@/lib/vocabularyLimits";
import { readNotifications } from "@/lib/notificationsStorage";

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

const LAST_NOTIFIED_KEY = "pylmor-learn-missed-last-notified-at";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function parseTime(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getLastLearnMissedNotifiedAt(): number | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LAST_NOTIFIED_KEY);
    if (!raw) {
      return null;
    }
    const parsed = Date.parse(raw);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

export function markLearnMissedNotified(atMs: number): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(LAST_NOTIFIED_KEY, new Date(atMs).toISOString());
}

export function wasLearnMissedNotifiedRecently(nowMs: number): boolean {
  let last = getLastLearnMissedNotifiedAt();

  if (last == null) {
    for (const item of readNotifications()) {
      if (item.type !== "learn_missed_day") {
        continue;
      }
      const created = Date.parse(item.createdAt);
      if (Number.isNaN(created)) {
        continue;
      }
      if (last == null || created > last) {
        last = created;
      }
    }
    if (last != null) {
      markLearnMissedNotified(last);
    }
  }

  if (last == null) {
    return false;
  }
  return nowMs - last < LEARN_WORD_LOCK_MS;
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
