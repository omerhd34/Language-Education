import {
  combinedExerciseStorageId,
  getCombinedExerciseById,
  getCombinedExerciseQuestions,
  type CombinedExercise,
} from "@/data/combinedExercises";
import { computeExerciseTypeProgress } from "@/lib/exerciseTypeProgress";
import { getCompletedTopicExerciseTypes } from "@/lib/topicProgressStorage";

export function computeCombinedExerciseProgress(
  combined: CombinedExercise,
): number {
  const exercises = getCombinedExerciseQuestions(combined);
  const storageId = combinedExerciseStorageId(combined.id);
  const progress = computeExerciseTypeProgress({
    topicId: storageId,
    exercises,
    completedTypes: getCompletedTopicExerciseTypes(storageId),
  });
  const types = [...new Set(exercises.map((item) => item.type))];
  if (types.length === 0) {
    return 0;
  }

  const total = types.reduce((sum, type) => sum + (progress[type] ?? 0), 0);
  return Math.min(100, Math.max(0, Math.round(total / types.length)));
}

export function isCombinedExerciseComplete(combinedId: string): boolean {
  const combined = getCombinedExerciseById(combinedId);
  if (!combined) {
    return false;
  }
  return computeCombinedExerciseProgress(combined) >= 100;
}
