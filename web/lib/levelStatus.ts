import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import type { ReadingLevel } from "@/data/readings/types";
import {
  getVocabularyCategoriesByLevel,
  type VocabularyLevel,
} from "@/data/vocabulary";
import { computeLevelExamPercent } from "@/lib/levelExamProgressStorage";
import { getListeningSectionsByLevel } from "@/lib/listeningContent";
import { listeningSectionPercent } from "@/lib/listeningProgressStorage";
import { getReadingSectionsByLevel } from "@/lib/readingContent";
import { readingSectionPercent } from "@/lib/readingProgressStorage";
import { getSpeakingSectionsByLevel } from "@/lib/speakingContent";
import { speakingSectionPercent } from "@/lib/speakingProgressStorage";
import { computeDisplayedTopicProgress } from "@/lib/topicCardProgress";
import {
  canAccessLevel,
  CEFR_LEVEL_ORDER,
  isLevelComplete,
  isLevelExamPassed,
} from "@/lib/topicAccess";
import { getWritingSectionsByLevel } from "@/lib/writingContent";
import { writingSectionPercent } from "@/lib/writingProgressStorage";
import { vocabularySectionPercent } from "@/lib/vocabularySectionProgress";

export type LevelStatus = {
  level: CefrLevel;
  percent: number;
  complete: boolean;
};

function averagePercents(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.min(100, Math.max(0, Math.round(total / values.length)));
}

type CefrSkillLevel = ReadingLevel;

function asCefrSkillLevel(level: CefrLevel): CefrSkillLevel | null {
  if (level === "Başlangıç") {
    return null;
  }
  return level;
}

function asVocabularyLevel(level: CefrLevel): VocabularyLevel | null {
  return asCefrSkillLevel(level);
}

function grammarPercents(
  level: CefrLevel,
  passedExams: readonly CefrLevel[],
): number[] {
  return dashboardTopics
    .filter((topic) => topic.level === level)
    .map((topic) => {
      if (topic.isExam) {
        return isLevelExamPassed(level, passedExams)
          ? 100
          : computeLevelExamPercent(level);
      }
      return computeDisplayedTopicProgress(topic.id);
    });
}

function vocabularyPercents(
  level: CefrLevel,
  knownWordIds: ReadonlySet<string>,
): number[] {
  const vocabularyLevel = asVocabularyLevel(level);
  if (!vocabularyLevel) {
    return [];
  }
  return getVocabularyCategoriesByLevel(vocabularyLevel).map((category) =>
    vocabularySectionPercent(category, knownWordIds),
  );
}

function readingPercents(level: CefrLevel): number[] {
  const readingLevel = asCefrSkillLevel(level);
  if (!readingLevel) {
    return [];
  }
  return getReadingSectionsByLevel(readingLevel).map((section) =>
    readingSectionPercent(section.id),
  );
}

function listeningPercents(level: CefrLevel): number[] {
  const skillLevel = asCefrSkillLevel(level);
  if (!skillLevel) {
    return [];
  }
  return getListeningSectionsByLevel(skillLevel).map((section) =>
    listeningSectionPercent(section.id),
  );
}

function writingPercents(level: CefrLevel): number[] {
  const skillLevel = asCefrSkillLevel(level);
  if (!skillLevel) {
    return [];
  }
  return getWritingSectionsByLevel(skillLevel).map((section) =>
    writingSectionPercent(section.id),
  );
}

function speakingPercents(level: CefrLevel): number[] {
  const skillLevel = asCefrSkillLevel(level);
  if (!skillLevel) {
    return [];
  }
  return getSpeakingSectionsByLevel(skillLevel).map((section) =>
    speakingSectionPercent(section.id),
  );
}

function skillBandAverage(parts: number[]): number | null {
  if (parts.length === 0) {
    return null;
  }
  return averagePercents(parts);
}

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

export function computeLevelCompletionPercent(
  level: CefrLevel,
  passedExams: readonly CefrLevel[] = [],
  knownWordIds: ReadonlySet<string> = new Set(),
): number {
  const skillPercents = [
    grammarPercents(level, passedExams),
    vocabularyPercents(level, knownWordIds),
    readingPercents(level),
    listeningPercents(level),
    writingPercents(level),
    speakingPercents(level),
  ]
    .map((parts) => skillBandAverage(parts))
    .filter((value): value is number => value !== null);

  return averagePercents(skillPercents);
}

export function getLevelStatus(
  passedExams: readonly CefrLevel[] = [],
  knownWordIds: ReadonlySet<string> = new Set(),
): LevelStatus {
  const level = getActiveCefrLevel(passedExams);
  const percent = computeLevelCompletionPercent(
    level,
    passedExams,
    knownWordIds,
  );
  return {
    level,
    percent,
    complete: percent >= 100,
  };
}
