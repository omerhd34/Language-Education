import type { CefrLevel } from "@/data/dashboardTopics";
import {
  canAccessLevel,
  CEFR_LEVEL_ORDER,
  isLevelComplete,
} from "@/lib/topicAccess";

export function getActiveCefrLevel(
  passedExams: readonly CefrLevel[] = [],
): CefrLevel {
  for (const level of CEFR_LEVEL_ORDER) {
    if (!canAccessLevel(level, passedExams)) {
      continue;
    }
    if (!isLevelComplete(level, passedExams)) {
      return level;
    }
  }

  return CEFR_LEVEL_ORDER[CEFR_LEVEL_ORDER.length - 1]!;
}
