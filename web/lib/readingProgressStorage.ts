import type { ReadingLevel } from "@/data/readings/types";

const STORAGE_KEY = "eng_reading_progress_v1";
const PASSED_EVENT = "reading-progress-changed";

const LEGACY_PASSAGE_TO_SECTION: Record<string, string> = {
  "a1-reading-1": "a1-family-friends",
  "a1-reading-2": "a1-cities",
  "a1-reading-3": "a1-free-time",
};

function normalizeSectionId(id: string): string {
  return LEGACY_PASSAGE_TO_SECTION[id] ?? id;
}

function migrateProgressMap(map: ReadingProgressMap): ReadingProgressMap {
  let changed = false;
  const next: ReadingProgressMap = { ...map };

  for (const [key, entry] of Object.entries(map)) {
    const sectionId = LEGACY_PASSAGE_TO_SECTION[key];
    if (!sectionId) {
      continue;
    }
    const existing = next[sectionId];
    next[sectionId] = {
      practiceDone: existing?.practiceDone || entry.practiceDone,
      examPassed: existing?.examPassed || entry.examPassed,
      listened: existing?.listened || entry.listened,
    };
    delete next[key];
    changed = true;
  }

  if (changed && canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return changed ? next : map;
}

export type ReadingProgressEntry = {
  listened?: boolean;
  practiceDone?: boolean;
  examPassed?: boolean;
};

export type ReadingProgressMap = Record<string, ReadingProgressEntry>;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readRaw(): ReadingProgressMap {
  if (!canUseStorage()) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return migrateProgressMap(parsed as ReadingProgressMap);
  } catch {
    return {};
  }
}

function writeRaw(map: ReadingProgressMap): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(PASSED_EVENT, { detail: map }));
}

export function readReadingProgress(): ReadingProgressMap {
  return readRaw();
}

export function markReadingListened(sectionId: string): void {
  const id = normalizeSectionId(sectionId);
  const next = { ...readRaw() };
  next[id] = { ...next[id], listened: true };
  writeRaw(next);
}

export function markReadingPracticeDone(sectionId: string): void {
  const id = normalizeSectionId(sectionId);
  const next = { ...readRaw() };
  next[id] = { ...next[id], practiceDone: true };
  writeRaw(next);
}

export function markReadingExamPassed(sectionId: string): void {
  const id = normalizeSectionId(sectionId);
  const next = { ...readRaw() };
  next[id] = {
    ...next[id],
    practiceDone: true,
    examPassed: true,
  };
  writeRaw(next);
}

export function isReadingExamPassed(sectionId: string): boolean {
  const id = normalizeSectionId(sectionId);
  return readRaw()[id]?.examPassed === true;
}

export function isReadingPracticeDone(sectionId: string): boolean {
  const id = normalizeSectionId(sectionId);
  return readRaw()[id]?.practiceDone === true;
}

export function isReadingListened(sectionId: string): boolean {
  const id = normalizeSectionId(sectionId);
  return readRaw()[id]?.listened === true;
}

export function isReadingPracticeComplete(sectionId: string): boolean {
  return isReadingPracticeDone(sectionId) || isReadingExamPassed(sectionId);
}

export function isReadingSectionComplete(sectionId: string): boolean {
  return isReadingListened(sectionId) && isReadingPracticeComplete(sectionId);
}

export function readingSectionPercent(sectionId: string): number {
  const listened = isReadingListened(sectionId);
  const practiced = isReadingPracticeComplete(sectionId);
  if (listened && practiced) {
    return 100;
  }
  if (listened || practiced) {
    return 50;
  }
  return 0;
}

export const READING_PROGRESS_EVENT = PASSED_EVENT;

export const PASSED_READING_LEVELS_KEY = "eng_passed_reading_levels_v1";
const LEVEL_PASSED_EVENT = "reading-level-passed-changed";

export function readPassedReadingLevels(): ReadingLevel[] {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(PASSED_READING_LEVELS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is ReadingLevel => typeof item === "string",
    );
  } catch {
    return [];
  }
}

export function markReadingLevelPassed(level: ReadingLevel): void {
  if (!canUseStorage()) {
    return;
  }
  const current = new Set(readPassedReadingLevels());
  current.add(level);
  window.localStorage.setItem(
    PASSED_READING_LEVELS_KEY,
    JSON.stringify([...current]),
  );
  window.dispatchEvent(
    new CustomEvent(LEVEL_PASSED_EVENT, { detail: [...current] }),
  );
}

export const READING_LEVEL_PASSED_EVENT = LEVEL_PASSED_EVENT;

export function clearReadingProgressStorage(): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(PASSED_READING_LEVELS_KEY);
  window.dispatchEvent(new CustomEvent(PASSED_EVENT, { detail: {} }));
  window.dispatchEvent(new CustomEvent(LEVEL_PASSED_EVENT, { detail: [] }));
}
