import {
  SPEAKING_LEVEL_ORDER,
  getSpeakingSectionsByLevel,
} from "@/lib/speakingContent";
import type { SpeakingLevel } from "@/data/speakings/types";
import {
  isSpeakingSectionComplete,
  markSpeakingLevelPassed,
  readPassedSpeakingLevels,
} from "@/lib/speakingProgressStorage";

export function getPreviousSpeakingLevel(
  level: SpeakingLevel,
): SpeakingLevel | null {
  const index = SPEAKING_LEVEL_ORDER.indexOf(level);
  if (index <= 0) {
    return null;
  }
  return SPEAKING_LEVEL_ORDER[index - 1] ?? null;
}

export function getRequiredSpeakingLevelToUnlock(
  level: SpeakingLevel,
): SpeakingLevel | null {
  return getPreviousSpeakingLevel(level);
}

export function isSpeakingLevelComplete(level: SpeakingLevel): boolean {
  const sections = getSpeakingSectionsByLevel(level);
  if (sections.length === 0) {
    return false;
  }
  return sections.every((section) => isSpeakingSectionComplete(section.id));
}

export function tryMarkSpeakingLevelPassed(level: SpeakingLevel): void {
  if (isSpeakingLevelComplete(level)) {
    markSpeakingLevelPassed(level);
  }
}

export function canAccessSpeakingLevel(level: SpeakingLevel): boolean {
  if (level === "A1") {
    return true;
  }
  const previous = getPreviousSpeakingLevel(level);
  if (!previous) {
    return true;
  }
  const passed = readPassedSpeakingLevels();
  if (passed.includes(previous)) {
    return true;
  }
  return isSpeakingLevelComplete(previous);
}
