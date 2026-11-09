import { dashboardTopics, type CefrLevel } from "@/data/dashboardTopics";
import type { ReadingLevel } from "@/data/readings/types";
import {
  getVocabularyCategoriesByLevel,
  type VocabularyLevel,
} from "@/data/vocabulary";
import { computeLevelExamPercent } from "@/lib/levelExamProgressStorage";
import { getReadingSectionsByLevel } from "@/lib/readingContent";
import { readingSectionPercent } from "@/lib/readingProgressStorage";
import { computeDisplayedTopicProgress } from "@/lib/topicCardProgress";
import {
  canAccessLevel,
  CEFR_LEVEL_ORDER,
  isLevelComplete,
  isLevelExamPassed,
} from "@/lib/topicAccess";
import { vocabularySectionPercent } from "@/lib/vocabularySectionProgress";

export type LevelStatusCtaSection = "dilbilgisi" | "kelimeler" | "okuma";

export type LevelStatus = {
  level: CefrLevel;
  percent: number;
  complete: boolean;
  ctaSection: LevelStatusCtaSection;
};

function averagePercents(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.min(100, Math.max(0, Math.round(total / values.length)));
}

function asVocabularyLevel(level: CefrLevel): VocabularyLevel | null {
  if (level === "Başlangıç") {
    return null;
  }
  return level;
}

function asReadingLevel(level: CefrLevel): ReadingLevel | null {
  if (level === "Başlangıç") {
    return null;
  }
  return level;
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
  const readingLevel = asReadingLevel(level);
  if (!readingLevel) {
    return [];
  }
  return getReadingSectionsByLevel(readingLevel).map((section) =>
    readingSectionPercent(section.id),
  );
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
  ]
    .filter((parts) => parts.length > 0)
    .map((parts) => averagePercents(parts));

  return averagePercents(skillPercents);
}

export function getLevelStatusCtaSection(
  level: CefrLevel,
  passedExams: readonly CefrLevel[] = [],
  knownWordIds: ReadonlySet<string> = new Set(),
): LevelStatusCtaSection {
  const grammar = grammarPercents(level, passedExams);
  if (grammar.length > 0 && averagePercents(grammar) < 100) {
    return "dilbilgisi";
  }

  const vocabulary = vocabularyPercents(level, knownWordIds);
  if (vocabulary.length > 0 && averagePercents(vocabulary) < 100) {
    return "kelimeler";
  }

  const reading = readingPercents(level);
  if (reading.length > 0 && averagePercents(reading) < 100) {
    return "okuma";
  }

  return "dilbilgisi";
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
    ctaSection: getLevelStatusCtaSection(level, passedExams, knownWordIds),
  };
}
