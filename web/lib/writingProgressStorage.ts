import type { WritingLevel } from "@/data/writings/types";

const STORAGE_KEY = "eng_writing_progress_v1";
const PASSED_EVENT = "writing-progress-changed";

export type WritingProgressEntry = {
  modelViewed?: boolean;
  modelTranslationShown?: boolean;
  modelListened?: boolean;
  practiceAllDone?: boolean;
  practiceDone?: boolean;
};

export type WritingProgressMap = Record<string, WritingProgressEntry>;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readRaw(): WritingProgressMap {
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
    return parsed as WritingProgressMap;
  } catch {
    return {};
  }
}

function writeRaw(map: WritingProgressMap): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(PASSED_EVENT, { detail: map }));
}

export function readWritingProgress(): WritingProgressMap {
  return readRaw();
}

export function markWritingModelTranslationShown(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], modelTranslationShown: true };
  writeRaw(next);
}

export function markWritingModelListened(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], modelListened: true };
  writeRaw(next);
}

export function markWritingPracticeAllDone(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], practiceAllDone: true };
  writeRaw(next);
}

export function markWritingPracticeDone(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = {
    ...next[sectionId],
    practiceAllDone: true,
    practiceDone: true,
  };
  writeRaw(next);
}

export function clearWritingPracticeProgress(sectionId: string): void {
  const next = { ...readRaw() };
  const entry = next[sectionId];
  if (!entry) {
    return;
  }
  next[sectionId] = {
    ...entry,
    practiceAllDone: false,
    practiceDone: false,
  };
  writeRaw(next);
}

export function isWritingPracticeAllDone(sectionId: string): boolean {
  const entry = readRaw()[sectionId];
  if (!entry) {
    return false;
  }
  return entry.practiceAllDone === true || entry.practiceDone === true;
}

export function isWritingModelTranslationShown(sectionId: string): boolean {
  const entry = readRaw()[sectionId];
  if (!entry) {
    return false;
  }
  return entry.modelTranslationShown === true || entry.modelViewed === true;
}

export function isWritingModelListened(sectionId: string): boolean {
  const entry = readRaw()[sectionId];
  if (!entry) {
    return false;
  }
  return entry.modelListened === true || entry.modelViewed === true;
}

export function isWritingModelViewed(sectionId: string): boolean {
  return (
    isWritingModelTranslationShown(sectionId) &&
    isWritingModelListened(sectionId)
  );
}

export function isWritingPracticeDone(sectionId: string): boolean {
  return readRaw()[sectionId]?.practiceDone === true;
}

export function isWritingSectionComplete(sectionId: string): boolean {
  return (
    isWritingModelViewed(sectionId) &&
    isWritingPracticeAllDone(sectionId) &&
    isWritingPracticeDone(sectionId)
  );
}

export function writingSectionPercent(sectionId: string): number {
  let percent = 0;
  if (isWritingModelTranslationShown(sectionId)) {
    percent += 25;
  }
  if (isWritingModelListened(sectionId)) {
    percent += 25;
  }
  if (isWritingPracticeDone(sectionId)) {
    percent += 50;
  }
  return percent;
}

export const WRITING_PROGRESS_EVENT = PASSED_EVENT;

export const PASSED_WRITING_LEVELS_KEY = "eng_passed_writing_levels_v1";
const LEVEL_PASSED_EVENT = "writing-level-passed-changed";

export function readPassedWritingLevels(): WritingLevel[] {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(PASSED_WRITING_LEVELS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is WritingLevel => typeof item === "string",
    );
  } catch {
    return [];
  }
}

export function markWritingLevelPassed(level: WritingLevel): void {
  if (!canUseStorage()) {
    return;
  }
  const current = new Set(readPassedWritingLevels());
  current.add(level);
  window.localStorage.setItem(
    PASSED_WRITING_LEVELS_KEY,
    JSON.stringify([...current]),
  );
  window.dispatchEvent(
    new CustomEvent(LEVEL_PASSED_EVENT, { detail: [...current] }),
  );
}

export const WRITING_LEVEL_PASSED_EVENT = LEVEL_PASSED_EVENT;
