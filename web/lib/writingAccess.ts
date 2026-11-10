import {
  WRITING_LEVEL_ORDER,
  getWritingSectionsByLevel,
} from "@/lib/writingContent";
import type { WritingLevel } from "@/data/writings/types";
import {
  isWritingSectionComplete,
  markWritingLevelPassed,
  readPassedWritingLevels,
} from "@/lib/writingProgressStorage";

export function getPreviousWritingLevel(
  level: WritingLevel,
): WritingLevel | null {
  const index = WRITING_LEVEL_ORDER.indexOf(level);
  if (index <= 0) {
    return null;
  }
  return WRITING_LEVEL_ORDER[index - 1] ?? null;
}

export function getRequiredWritingLevelToUnlock(
  level: WritingLevel,
): WritingLevel | null {
  return getPreviousWritingLevel(level);
}

export function isWritingLevelComplete(level: WritingLevel): boolean {
  const sections = getWritingSectionsByLevel(level);
  if (sections.length === 0) {
    return false;
  }
  return sections.every((section) => isWritingSectionComplete(section.id));
}

export function tryMarkWritingLevelPassed(level: WritingLevel): void {
  if (isWritingLevelComplete(level)) {
    markWritingLevelPassed(level);
  }
}

export function canAccessWritingLevel(level: WritingLevel): boolean {
  if (level === "A1") {
    return true;
  }
  const previous = getPreviousWritingLevel(level);
  if (!previous) {
    return true;
  }
  const passed = readPassedWritingLevels();
  if (passed.includes(previous)) {
    return true;
  }
  return isWritingLevelComplete(previous);
}
