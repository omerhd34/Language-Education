import { getTopicContent } from "@/data/grammar";
import { getTopicPracticeExercises } from "@/data/grammar/topicExercises";
import type { ExerciseType } from "@/data/grammar/types";
import { computeExerciseTypeProgress } from "@/lib/exerciseTypeProgress";
import {
  resolveMixedTopicQuiz,
  toTopicQuizExercises,
  topicPracticeUsesMixedFormat,
  topicQuizUsesMixedFormat,
  resolveTopicExamExercises,
  topicQuizUsesErrorCorrectionFormat,
  resolveTopicErrorCorrectionQuiz,
  topicQuizUsesListeningFormat,
  resolveTopicListeningQuiz,
} from "@/lib/topicExam";
import type { TopicQuizPart } from "@/lib/topicExamDraftStorage";
import {
  getLessonViewRequiredMs,
  getTopicProgressRecord,
  isTopicExamPassed,
} from "@/lib/topicProgressStorage";

export type TopicProgressWeights = {
  pillarCount: number;
  pillarPercent: number;
  exerciseTypeCount: number;
  quizPartCount: number;
};

function availableExerciseTypes(topicId: string): ExerciseType[] {
  const content = getTopicContent(topicId);
  if (!content) {
    return [];
  }

  if (topicPracticeUsesMixedFormat(content)) {
    const types: ExerciseType[] = [];
    const exercises = getTopicPracticeExercises(content);
    if (toTopicQuizExercises(exercises).length > 0) {
      types.push("mixed");
    }
    if (exercises.some((item) => item.type === "matching")) {
      types.push("matching");
    }
    return types;
  }

  return [
    ...new Set(getTopicPracticeExercises(content).map((item) => item.type)),
  ];
}

function availableQuizParts(topicId: string): TopicQuizPart[] {
  const content = getTopicContent(topicId);
  if (!content) {
    return [];
  }

  if (topicQuizUsesListeningFormat(content)) {
    return resolveTopicListeningQuiz(content).length > 0 ? ["listening"] : [];
  }

  if (topicQuizUsesErrorCorrectionFormat(content)) {
    return resolveTopicErrorCorrectionQuiz(content).length > 0
      ? ["error_correction"]
      : [];
  }

  if (topicQuizUsesMixedFormat(content)) {
    return resolveMixedTopicQuiz(content).length > 0 ? ["mixed"] : [];
  }

  const parts: TopicQuizPart[] = [];
  if (resolveTopicExamExercises(content).length > 0) {
    parts.push("multiple_choice");
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

function pillarShareFromItemPercents(
  pillarPoints: number,
  itemPercents: readonly number[],
): number {
  if (itemPercents.length === 0) {
    return 0;
  }

  const sharePerItem = pillarPoints / itemPercents.length;
  return itemPercents.reduce((sum, value) => {
    const clamped = Math.min(100, Math.max(0, value));
    return sum + sharePerItem * (clamped / 100);
  }, 0);
}

function topicProgressPillarCount(topicId: string): number {
  const hasLesson = getTopicContent(topicId) !== undefined;
  const hasExercises = availableExerciseTypes(topicId).length > 0;
  const hasQuiz = availableQuizParts(topicId).length > 0;

  let count = 0;
  if (hasLesson) {
    count += 1;
  }
  if (hasExercises) {
    count += 1;
  }
  if (hasQuiz) {
    count += 1;
  }
  return Math.max(count, 1);
}

/** Konu başına dilim: Konu (ders) + Alıştırma (tüm türler) + Quiz (tüm bölümler). */
export function getTopicProgressWeights(topicId: string): TopicProgressWeights {
  const exerciseTypeCount = availableExerciseTypes(topicId).length;
  const quizPartCount = availableQuizParts(topicId).length;
  const pillarCount = topicProgressPillarCount(topicId);

  return {
    pillarCount,
    pillarPercent: 100 / pillarCount,
    exerciseTypeCount,
    quizPartCount,
  };
}

export function topicExerciseTypeWeightPercent(topicId: string): number {
  const { pillarPercent, exerciseTypeCount } = getTopicProgressWeights(topicId);
  if (exerciseTypeCount <= 0) {
    return 0;
  }
  return pillarPercent / exerciseTypeCount;
}

export function topicQuizPartWeightPercent(topicId: string): number {
  const { pillarPercent, quizPartCount } = getTopicProgressWeights(topicId);
  if (quizPartCount <= 0) {
    return 0;
  }
  return pillarPercent / quizPartCount;
}

function pointsFromPercent(share: number, percent: number): number {
  const clamped = Math.min(100, Math.max(0, percent));
  return share * (clamped / 100);
}

export function computeDisplayedTopicProgress(topicId: string): number {
  const content = getTopicContent(topicId);
  const record = getTopicProgressRecord(topicId);
  const { pillarPercent, exerciseTypeCount, quizPartCount } =
    getTopicProgressWeights(topicId);

  const lessonPoints =
    content !== undefined
      ? pointsFromPercent(pillarPercent, lessonPercent(topicId))
      : 0;

  const types = availableExerciseTypes(topicId);
  const typeProgress = computeExerciseTypeProgress({
    topicId,
    exercises: content ? getTopicPracticeExercises(content) : [],
    completedTypes: record.completedTypes ?? [],
  });
  const exerciseTypePercents = types.map((type) => typeProgress[type] ?? 0);
  const exercisePoints =
    exerciseTypeCount > 0
      ? pillarShareFromItemPercents(pillarPercent, exerciseTypePercents)
      : 0;

  const quizPoints =
    quizPartCount > 0 && isTopicExamPassed(topicId) ? pillarPercent : 0;

  const total = lessonPoints + exercisePoints + quizPoints;
  return Math.min(100, Math.max(0, Math.round(total)));
}
