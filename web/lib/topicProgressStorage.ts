import { getTopicContent } from "@/data/topics";
import type { ExerciseType } from "@/data/topics/types";

const STORAGE_KEY = "pylmor-topic-progress";
export const TOPIC_PROGRESS_CHANGED_EVENT = "pylmor:topic-progress-changed";

export const LESSON_VIEW_REQUIRED_MS = 3 * 60 * 1000;

export type TopicProgressRecord = {
  lessonViewed?: boolean;
  lessonViewMs?: number;
  completedTypes?: ExerciseType[];
  examPassed?: boolean;
};

type TopicProgressMap = Record<string, TopicProgressRecord>;

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(TOPIC_PROGRESS_CHANGED_EVENT));
}

function readAll(): TopicProgressMap {
  if (!canUseDom()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as TopicProgressMap;
  } catch {
    return {};
  }
}

function writeAll(map: TopicProgressMap): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  emitChanged();
}

function normalizeRecord(record: TopicProgressRecord): TopicProgressRecord {
  // Legacy: lesson was marked instantly without the 3-minute requirement.
  if (record.lessonViewed && record.lessonViewMs === undefined) {
    return {
      ...record,
      lessonViewed: false,
      lessonViewMs: 0,
    };
  }
  return record;
}

export function getTopicProgressRecord(topicId: string): TopicProgressRecord {
  return normalizeRecord(readAll()[topicId] ?? {});
}

export function getTopicLessonViewMs(topicId: string): number {
  const record = getTopicProgressRecord(topicId);
  if (isLessonProgressEarned(record)) {
    return LESSON_VIEW_REQUIRED_MS;
  }
  return Math.max(0, record.lessonViewMs ?? 0);
}

export function getTopicLessonViewRemainingMs(topicId: string): number {
  return Math.max(0, LESSON_VIEW_REQUIRED_MS - getTopicLessonViewMs(topicId));
}

export function addTopicLessonViewMs(
  topicId: string,
  deltaMs: number,
): boolean {
  if (deltaMs <= 0) {
    return isLessonProgressEarned(getTopicProgressRecord(topicId));
  }

  const all = readAll();
  const current = normalizeRecord(all[topicId] ?? {});
  if (isLessonProgressEarned(current)) {
    return true;
  }

  const nextMs = Math.min(
    LESSON_VIEW_REQUIRED_MS,
    (current.lessonViewMs ?? 0) + deltaMs,
  );
  const lessonViewed = nextMs >= LESSON_VIEW_REQUIRED_MS;

  writeAll({
    ...all,
    [topicId]: {
      ...current,
      lessonViewMs: nextMs,
      lessonViewed,
    },
  });

  return lessonViewed;
}

export function markTopicLessonViewed(topicId: string): void {
  const all = readAll();
  const current = normalizeRecord(all[topicId] ?? {});
  if (isLessonProgressEarned(current)) {
    return;
  }
  writeAll({
    ...all,
    [topicId]: {
      ...current,
      lessonViewed: true,
      lessonViewMs: LESSON_VIEW_REQUIRED_MS,
    },
  });
}

export function markTopicExerciseTypeCompleted(
  topicId: string,
  type: ExerciseType,
): void {
  const all = readAll();
  const current = all[topicId] ?? {};
  const completed = new Set(current.completedTypes ?? []);
  if (completed.has(type)) {
    return;
  }
  completed.add(type);
  writeAll({
    ...all,
    [topicId]: {
      ...current,
      completedTypes: Array.from(completed),
    },
  });
}

export function isTopicExerciseTypeCompleted(
  topicId: string,
  type: ExerciseType,
): boolean {
  const completed = getTopicProgressRecord(topicId).completedTypes ?? [];
  return completed.includes(type);
}

export function getCompletedTopicExerciseTypes(
  topicId: string,
): ExerciseType[] {
  return getTopicProgressRecord(topicId).completedTypes ?? [];
}

export function markTopicExamPassed(topicId: string): void {
  const all = readAll();
  const current = all[topicId] ?? {};
  if (current.examPassed) {
    return;
  }
  writeAll({
    ...all,
    [topicId]: {
      ...current,
      examPassed: true,
    },
  });
}

export function isTopicExamPassed(topicId: string): boolean {
  return getTopicProgressRecord(topicId).examPassed === true;
}

function getAvailableExerciseTypes(topicId: string): ExerciseType[] {
  const content = getTopicContent(topicId);
  if (!content) {
    return [];
  }

  const types = new Set<ExerciseType>();
  for (const exercise of content.exercises) {
    types.add(exercise.type);
  }
  return Array.from(types);
}

function topicHasExam(topicId: string): boolean {
  const content = getTopicContent(topicId);
  if (!content) {
    return false;
  }
  if (content.examExercises && content.examExercises.length > 0) {
    return true;
  }
  return content.exercises.some((item) => item.type === "multiple_choice");
}

function isLessonProgressEarned(record: TopicProgressRecord): boolean {
  return (
    record.lessonViewed === true &&
    (record.lessonViewMs ?? 0) >= LESSON_VIEW_REQUIRED_MS
  );
}

export function computeTopicProgressPercent(topicId: string): number {
  const record = getTopicProgressRecord(topicId);
  const availableTypes = getAvailableExerciseTypes(topicId);
  const hasExam = topicHasExam(topicId);
  const totalParts = 1 + availableTypes.length + (hasExam ? 1 : 0);

  if (totalParts <= 0) {
    return 0;
  }

  let done = 0;
  if (isLessonProgressEarned(record)) {
    done += 1;
  }

  const completed = new Set(record.completedTypes ?? []);
  for (const type of availableTypes) {
    if (completed.has(type)) {
      done += 1;
    }
  }

  if (hasExam && record.examPassed) {
    done += 1;
  }

  return Math.round((done / totalParts) * 100);
}

export function clearTopicProgressStorage(): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  emitChanged();
}
