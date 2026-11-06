import { getTopicContent } from "@/data/topics";
import type { ExerciseType } from "@/data/topics/types";
import { computeExerciseTypeProgress } from "@/lib/exerciseTypeProgress";
import {
  resolveTopicExamExercises,
  resolveTopicExamFillBlanks,
} from "@/lib/topicExam";
import {
  readTopicQuizPartPercents,
  type TopicQuizPart,
} from "@/lib/topicExamDraftStorage";
import {
  getLessonViewRequiredMs,
  getTopicProgressRecord,
} from "@/lib/topicProgressStorage";

function availableExerciseTypes(topicId: string): ExerciseType[] {
  const content = getTopicContent(topicId);
  if (!content) {
    return [];
  }

  return [...new Set(content.exercises.map((item) => item.type))];
}

function availableQuizParts(topicId: string): TopicQuizPart[] {
  const content = getTopicContent(topicId);
  if (!content) {
    return [];
  }

  const parts: TopicQuizPart[] = [];
  if (resolveTopicExamExercises(content).length > 0) {
    parts.push("multiple_choice");
  }
  if (resolveTopicExamFillBlanks(content).length > 0) {
    parts.push("fill_blank");
  }
  return parts;
}

function lessonPercent(topicId: string): number {
  const requiredMs = getLessonViewRequiredMs(topicId);
  const record = getTopicProgressRecord(topicId);
  if (requiredMs <= 0) {
    return record.lessonViewed ? 100 : 0;
  }

  const viewed = Math.max(0, record.lessonViewMs ?? 0);
  return viewed >= requiredMs ? 100 : 0;
}

function lessonSectionPercents(topicId: string): number[] {
  const sections = getTopicContent(topicId)?.lesson.sections ?? [];
  if (sections.length === 0) {
    return [];
  }

  const percent = lessonPercent(topicId);
  return sections.map(() => percent);
}

export function computeDisplayedTopicProgress(topicId: string): number {
  const content = getTopicContent(topicId);
  const record = getTopicProgressRecord(topicId);
  const types = availableExerciseTypes(topicId);
  const typeProgress = computeExerciseTypeProgress({
    topicId,
    exercises: content?.exercises ?? [],
    completedTypes: record.completedTypes ?? [],
  });

  const parts: number[] = [
    ...lessonSectionPercents(topicId),
    ...types.map((type) => typeProgress[type] ?? 0),
    ...readTopicQuizPartPercents(topicId, availableQuizParts(topicId)),
  ];

  if (parts.length === 0) {
    return 0;
  }

  const total = parts.reduce((sum, value) => sum + value, 0);
  return Math.min(100, Math.max(0, Math.round(total / parts.length)));
}
