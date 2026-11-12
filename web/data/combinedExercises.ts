import {
  dashboardTopics,
  type CefrLevel,
  type DashboardTopic,
} from "@/data/grammar/dashboardTopics";
import { getTopicContent } from "@/data/grammar";
import type { TopicExercise } from "@/data/grammar/types";
import { CEFR_LEVEL_ORDER } from "@/lib/topicAccess";

export type CombinedExercise = {
  id: string;
  level: CefrLevel;
  index: number;
  topicIds: string[];
  topics: DashboardTopic[];
};

export type TopicGridItem =
  | { kind: "topic"; topic: DashboardTopic }
  | { kind: "combined"; combined: CombinedExercise };

export const TOPIC_BATCH_INTERVAL = 3;

const CEFR_LEVEL_SLUG: Record<CefrLevel, string> = {
  A1: "a1",
  A2: "a2",
  B1: "b1",
  B2: "b2",
  C1: "c1",
  C2: "c2",
};

const LEGACY_COMBINED_ID: Record<string, string> = {
  "baslangic-1": "a1-1",
};

function getCombinedInterval(_level: CefrLevel): number {
  return TOPIC_BATCH_INTERVAL;
}

function buildCombinedId(level: CefrLevel, index: number): string {
  return `${CEFR_LEVEL_SLUG[level]}-${index}`;
}

export function getCombinedExercisesForLevel(
  level: CefrLevel,
): CombinedExercise[] {
  const regularTopics = dashboardTopics.filter(
    (topic) => topic.level === level && !topic.isExam,
  );
  const interval = getCombinedInterval(level);
  const result: CombinedExercise[] = [];

  for (let i = interval; i <= regularTopics.length; i += interval) {
    const topics = regularTopics.slice(i - interval, i);
    const index = result.length + 1;

    result.push({
      id: buildCombinedId(level, index),
      level,
      index,
      topicIds: topics.map((topic) => topic.id),
      topics,
    });
  }

  return result;
}

export function getCombinedExerciseById(
  combinedId: string,
): CombinedExercise | undefined {
  const decoded = decodeURIComponent(combinedId);
  const normalizedId = LEGACY_COMBINED_ID[decoded] ?? decoded;

  for (const level of CEFR_LEVEL_ORDER) {
    const match = getCombinedExercisesForLevel(level).find(
      (item) => item.id === normalizedId,
    );
    if (match) {
      return match;
    }
  }
  return undefined;
}

export function getAllCombinedExercises(): CombinedExercise[] {
  return CEFR_LEVEL_ORDER.flatMap((level) =>
    getCombinedExercisesForLevel(level),
  );
}

export function buildTopicGridItems(level: CefrLevel): TopicGridItem[] {
  const levelTopics = dashboardTopics.filter((topic) => topic.level === level);
  const regularTopics = levelTopics.filter((topic) => !topic.isExam);
  const examTopics = levelTopics.filter((topic) => topic.isExam);
  const interval = getCombinedInterval(level);
  const items: TopicGridItem[] = [];
  let batch: DashboardTopic[] = [];
  let combinedIndex = 0;

  for (const topic of regularTopics) {
    items.push({ kind: "topic", topic });
    batch.push(topic);

    if (batch.length === interval) {
      combinedIndex += 1;
      items.push({
        kind: "combined",
        combined: {
          id: buildCombinedId(level, combinedIndex),
          level,
          index: combinedIndex,
          topicIds: batch.map((item) => item.id),
          topics: [...batch],
        },
      });
      batch = [];
    }
  }

  for (const topic of examTopics) {
    items.push({ kind: "topic", topic });
  }

  return items;
}

export function combinedExerciseStorageId(combinedId: string): string {
  return `combined:${combinedId}`;
}

export function getCombinedExerciseQuestions(
  combined: CombinedExercise,
): TopicExercise[] {
  return combined.topicIds.flatMap((topicId) => {
    const content = getTopicContent(topicId);
    return content?.exercises ?? [];
  });
}
