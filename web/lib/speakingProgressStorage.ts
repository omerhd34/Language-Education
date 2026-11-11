import type { SpeakingLevel } from "@/data/speakings/types";
import { getSpeakingSectionById } from "@/lib/speakingContent";

const STORAGE_KEY = "eng_speaking_progress_v1";
const PASSED_EVENT = "speaking-progress-changed";

export type SpeakingProgressEntry = {
  modelViewed?: boolean;
  modelTranslationShown?: boolean;
  modelListened?: boolean;
  modelSpokenMessageIds?: string[];
  practiceAllDone?: boolean;
  practiceDone?: boolean;
};

function allModelMessageIdsForSection(sectionId: string): string[] {
  const section = getSpeakingSectionById(sectionId);
  if (!section) {
    return [];
  }
  return section.model.messages.map((message) => message.id);
}

export type SpeakingProgressMap = Record<string, SpeakingProgressEntry>;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function readRaw(): SpeakingProgressMap {
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
    return parsed as SpeakingProgressMap;
  } catch {
    return {};
  }
}

function writeRaw(map: SpeakingProgressMap): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(PASSED_EVENT, { detail: map }));
}

export function readSpeakingProgress(): SpeakingProgressMap {
  return readRaw();
}

export function markSpeakingModelTranslationShown(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], modelTranslationShown: true };
  writeRaw(next);
}

export function markSpeakingModelListened(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], modelListened: true };
  writeRaw(next);
}

export function markSpeakingPracticeAllDone(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = { ...next[sectionId], practiceAllDone: true };
  writeRaw(next);
}

export function markSpeakingPracticeDone(sectionId: string): void {
  const next = { ...readRaw() };
  next[sectionId] = {
    ...next[sectionId],
    practiceAllDone: true,
    practiceDone: true,
  };
  writeRaw(next);
}

export function clearSpeakingPracticeProgress(sectionId: string): void {
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

export function isSpeakingPracticeAllDone(sectionId: string): boolean {
  const entry = readRaw()[sectionId];
  if (!entry) {
    return false;
  }
  return entry.practiceAllDone === true || entry.practiceDone === true;
}

export function isSpeakingModelTranslationShown(sectionId: string): boolean {
  const entry = readRaw()[sectionId];
  if (!entry) {
    return false;
  }
  return entry.modelTranslationShown === true || entry.modelViewed === true;
}

export function getSpeakingRecordedMessageIds(sectionId: string): string[] {
  const entry = readRaw()[sectionId];
  return entry?.modelSpokenMessageIds ?? [];
}

export function clearSpeakingModelDialogueProgress(sectionId: string): void {
  const next = { ...readRaw() };
  const entry = next[sectionId];
  if (!entry) {
    return;
  }
  next[sectionId] = {
    ...entry,
    modelSpokenMessageIds: [],
    modelListened: false,
  };
  writeRaw(next);
}

export function clearSpeakingLinePassed(
  sectionId: string,
  messageId: string,
): void {
  const allIds = allModelMessageIdsForSection(sectionId);
  if (!allIds.includes(messageId)) {
    return;
  }
  const next = { ...readRaw() };
  const entry = next[sectionId];
  if (!entry) {
    return;
  }
  const spokenIds = (entry.modelSpokenMessageIds ?? []).filter(
    (id) => id !== messageId,
  );
  next[sectionId] = {
    ...entry,
    modelSpokenMessageIds: spokenIds,
    modelListened: false,
  };
  writeRaw(next);
}

export function markSpeakingLinePassed(
  sectionId: string,
  messageId: string,
): void {
  const allIds = allModelMessageIdsForSection(sectionId);
  if (!allIds.includes(messageId)) {
    return;
  }
  const next = { ...readRaw() };
  const entry = next[sectionId] ?? {};
  const ids = new Set(entry.modelSpokenMessageIds ?? []);
  ids.add(messageId);
  const spokenIds = [...ids];
  const allSpoken = allIds.every((id) => spokenIds.includes(id));
  next[sectionId] = {
    ...entry,
    modelSpokenMessageIds: spokenIds,
    ...(allSpoken ? { modelListened: true } : {}),
  };
  writeRaw(next);
}

/** @deprecated use markSpeakingLinePassed */
export function markSpeakingLineHeard(
  sectionId: string,
  messageId: string,
): void {
  markSpeakingLinePassed(sectionId, messageId);
}

export function isSpeakingModelListened(sectionId: string): boolean {
  const entry = readRaw()[sectionId];
  if (!entry) {
    return false;
  }
  if (entry.modelListened === true || entry.modelViewed === true) {
    return true;
  }
  const allIds = allModelMessageIdsForSection(sectionId);
  if (allIds.length === 0) {
    return false;
  }
  const recorded = new Set(entry.modelSpokenMessageIds ?? []);
  return allIds.every((id) => recorded.has(id));
}

export function isSpeakingModelViewed(sectionId: string): boolean {
  return (
    isSpeakingModelTranslationShown(sectionId) &&
    isSpeakingModelListened(sectionId)
  );
}

export function isSpeakingPracticeDone(sectionId: string): boolean {
  return readRaw()[sectionId]?.practiceDone === true;
}

export function isSpeakingSectionComplete(sectionId: string): boolean {
  return (
    isSpeakingModelViewed(sectionId) &&
    isSpeakingPracticeAllDone(sectionId) &&
    isSpeakingPracticeDone(sectionId)
  );
}

export function speakingSectionPercent(sectionId: string): number {
  let percent = 0;
  if (isSpeakingModelTranslationShown(sectionId)) {
    percent += 25;
  }
  if (isSpeakingModelListened(sectionId)) {
    percent += 25;
  }
  if (isSpeakingPracticeDone(sectionId)) {
    percent += 50;
  }
  return percent;
}

export const SPEAKING_PROGRESS_EVENT = PASSED_EVENT;

export const PASSED_SPEAKING_LEVELS_KEY = "eng_passed_speaking_levels_v1";
const LEVEL_PASSED_EVENT = "speaking-level-passed-changed";

export function readPassedSpeakingLevels(): SpeakingLevel[] {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(PASSED_SPEAKING_LEVELS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is SpeakingLevel => typeof item === "string",
    );
  } catch {
    return [];
  }
}

export function markSpeakingLevelPassed(level: SpeakingLevel): void {
  if (!canUseStorage()) {
    return;
  }
  const current = new Set(readPassedSpeakingLevels());
  current.add(level);
  window.localStorage.setItem(
    PASSED_SPEAKING_LEVELS_KEY,
    JSON.stringify([...current]),
  );
  window.dispatchEvent(
    new CustomEvent(LEVEL_PASSED_EVENT, { detail: [...current] }),
  );
}

export const SPEAKING_LEVEL_PASSED_EVENT = LEVEL_PASSED_EVENT;

export function clearSpeakingProgressStorage(): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(PASSED_SPEAKING_LEVELS_KEY);
  window.dispatchEvent(new CustomEvent(PASSED_EVENT, { detail: {} }));
  window.dispatchEvent(new CustomEvent(LEVEL_PASSED_EVENT, { detail: [] }));
}
