import { getCombinedExercisesForLevel } from "@/data/combinedExercises";
import { dashboardTopics, type CefrLevel } from "@/data/grammar/dashboardTopics";
import { computeCombinedExerciseProgress } from "@/lib/combinedExerciseProgress";
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

function asVocabularyLevel(level: CefrLevel): VocabularyLevel {
  return level;
}

function grammarPercents(
  level: CefrLevel,
  passedExams: readonly CefrLevel[],
): number[] {
  const topicPercents = dashboardTopics
    .filter((topic) => topic.level === level)
    .map((topic) => {
      if (topic.isExam) {
        return isLevelExamPassed(level, passedExams)
          ? 100
          : computeLevelExamPercent(level);
      }
      return computeDisplayedTopicProgress(topic.id);
    });

  const combinedPercents = getCombinedExercisesForLevel(level).map((combined) =>
    computeCombinedExerciseProgress(combined),
  );

  return [...topicPercents, ...combinedPercents];
}

function vocabularyPercents(
  level: CefrLevel,
  knownWordIds: ReadonlySet<string>,
): number[] {
  return getVocabularyCategoriesByLevel(asVocabularyLevel(level)).map(
    (category) => vocabularySectionPercent(category, knownWordIds),
  );
}

function readingPercents(level: CefrLevel): number[] {
  return getReadingSectionsByLevel(level).map((section) =>
    readingSectionPercent(section.id),
  );
}

function listeningPercents(level: CefrLevel): number[] {
  return getListeningSectionsByLevel(level).map((section) =>
    listeningSectionPercent(section.id),
  );
}

function writingPercents(level: CefrLevel): number[] {
  return getWritingSectionsByLevel(level).map((section) =>
    writingSectionPercent(section.id),
  );
}

function speakingPercents(level: CefrLevel): number[] {
  return getSpeakingSectionsByLevel(level).map((section) =>
    speakingSectionPercent(section.id),
  );
}

/** Panel menüsündeki altı çalışma alanı (eşit ağırlık). */
const LEVEL_SKILL_COUNT = 6;

function padBandToTargetSize(band: number[], targetSize: number): number[] {
  if (band.length >= targetSize) {
    return band;
  }
  return [...band, ...Array<number>(targetSize - band.length).fill(0)];
}

function skillBandPercent(band: number[], targetSize: number): number {
  const units = band.length > 0 ? band : [0];
  return averagePercents(padBandToTargetSize(units, targetSize));
}

function levelSkillPercents(
  level: CefrLevel,
  passedExams: readonly CefrLevel[],
  knownWordIds: ReadonlySet<string>,
): number[] {
  const bands = [
    grammarPercents(level, passedExams),
    vocabularyPercents(level, knownWordIds),
    readingPercents(level),
    listeningPercents(level),
    writingPercents(level),
    speakingPercents(level),
  ];

  const targetSize = Math.max(...bands.map((band) => band.length), 1);
  return bands.map((band) => skillBandPercent(band, targetSize));
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
  const skillPercents = levelSkillPercents(level, passedExams, knownWordIds);
  if (skillPercents.length !== LEVEL_SKILL_COUNT) {
    return 0;
  }
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
