import {
  READING_LEVEL_ORDER,
  getReadingSectionsByLevel,
} from "@/lib/readingContent";
import type { ReadingLevel } from "@/data/readings/types";
import {
  isReadingSectionComplete,
  markReadingLevelPassed,
  readPassedReadingLevels,
} from "@/lib/readingProgressStorage";

export function getPreviousReadingLevel(
  level: ReadingLevel,
): ReadingLevel | null {
  const index = READING_LEVEL_ORDER.indexOf(level);
  if (index <= 0) {
    return null;
  }
  return READING_LEVEL_ORDER[index - 1] ?? null;
}

export function getRequiredReadingLevelToUnlock(
  level: ReadingLevel,
): ReadingLevel | null {
  return getPreviousReadingLevel(level);
}

export function isReadingLevelComplete(level: ReadingLevel): boolean {
  const sections = getReadingSectionsByLevel(level);
  if (sections.length === 0) {
    return false;
  }
  return sections.every((section) => isReadingSectionComplete(section.id));
}

export function tryMarkReadingLevelPassed(level: ReadingLevel): void {
  if (isReadingLevelComplete(level)) {
    markReadingLevelPassed(level);
  }
}

export function canAccessReadingLevel(level: ReadingLevel): boolean {
  if (level === "A1") {
    return true;
  }
  const previous = getPreviousReadingLevel(level);
  if (!previous) {
    return true;
  }
  const passed = readPassedReadingLevels();
  if (passed.includes(previous)) {
    return true;
  }
  return isReadingLevelComplete(previous);
}
