import {
  LISTENING_LEVEL_ORDER,
  getListeningSectionsByLevel,
} from "@/lib/listeningContent";
import type { ListeningLevel } from "@/data/listenings/types";
import {
  isListeningSectionComplete,
  markListeningLevelPassed,
  readPassedListeningLevels,
} from "@/lib/listeningProgressStorage";

export function getPreviousListeningLevel(
  level: ListeningLevel,
): ListeningLevel | null {
  const index = LISTENING_LEVEL_ORDER.indexOf(level);
  if (index <= 0) {
    return null;
  }
  return LISTENING_LEVEL_ORDER[index - 1] ?? null;
}

export function getRequiredListeningLevelToUnlock(
  level: ListeningLevel,
): ListeningLevel | null {
  return getPreviousListeningLevel(level);
}

export function isListeningLevelComplete(level: ListeningLevel): boolean {
  const sections = getListeningSectionsByLevel(level);
  if (sections.length === 0) {
    return false;
  }
  return sections.every((section) => isListeningSectionComplete(section.id));
}

export function tryMarkListeningLevelPassed(level: ListeningLevel): void {
  if (isListeningLevelComplete(level)) {
    markListeningLevelPassed(level);
  }
}

export function canAccessListeningLevel(level: ListeningLevel): boolean {
  if (level === "A1") {
    return true;
  }
  const previous = getPreviousListeningLevel(level);
  if (!previous) {
    return true;
  }
  const passed = readPassedListeningLevels();
  if (passed.includes(previous)) {
    return true;
  }
  return isListeningLevelComplete(previous);
}
