import type { ListeningLevel } from "@/data/listenings/types";

const STORAGE_KEY = "eng_listening_progress_v1";
const PASSED_EVENT = "listening-progress-changed";

export type ListeningProgressEntry = {
  listened?: boolean;
  practiceDone?: boolean;
};

export type ListeningProgressMap = Record<string, ListeningProgressEntry>;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readRaw(): ListeningProgressMap {
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
    return parsed as ListeningProgressMap;
  } catch {
    return {};
  }
}

function writeRaw(map: ListeningProgressMap): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(PASSED_EVENT, { detail: map }));
}

export function readListeningProgress(): ListeningProgressMap {
  return readRaw();
}

export function markListeningListened(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], listened: true };
  writeRaw(next);
}

export function markListeningPracticeDone(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], practiceDone: true };
  writeRaw(next);
}

export function isListeningListened(sectionId: string): boolean {
  return readRaw()[sectionId]?.listened === true;
}

export function isListeningPracticeDone(sectionId: string): boolean {
  return readRaw()[sectionId]?.practiceDone === true;
}

export function isListeningSectionComplete(sectionId: string): boolean {
  return isListeningListened(sectionId) && isListeningPracticeDone(sectionId);
}

export function listeningSectionPercent(sectionId: string): number {
  const listened = isListeningListened(sectionId);
  const practiced = isListeningPracticeDone(sectionId);
  if (listened && practiced) {
    return 100;
  }
  if (listened || practiced) {
    return 50;
  }
  return 0;
}

export const LISTENING_PROGRESS_EVENT = PASSED_EVENT;

export const PASSED_LISTENING_LEVELS_KEY = "eng_passed_listening_levels_v1";
const LEVEL_PASSED_EVENT = "listening-level-passed-changed";

export function readPassedListeningLevels(): ListeningLevel[] {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(PASSED_LISTENING_LEVELS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is ListeningLevel => typeof item === "string",
    );
  } catch {
    return [];
  }
}

export function markListeningLevelPassed(level: ListeningLevel): void {
  if (!canUseStorage()) {
    return;
  }
  const current = new Set(readPassedListeningLevels());
  current.add(level);
  window.localStorage.setItem(
    PASSED_LISTENING_LEVELS_KEY,
    JSON.stringify([...current]),
  );
  window.dispatchEvent(
    new CustomEvent(LEVEL_PASSED_EVENT, { detail: [...current] }),
  );
}

export const LISTENING_LEVEL_PASSED_EVENT = LEVEL_PASSED_EVENT;
