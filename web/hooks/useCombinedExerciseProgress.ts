"use client";

import { useEffect, useState } from "react";
import {
  combinedExerciseStorageId,
  getCombinedExerciseById,
  getCombinedExerciseQuestions,
  type CombinedExercise,
} from "@/data/combinedExercises";
import { computeExerciseTypeProgress } from "@/lib/exerciseTypeProgress";
import {
  TOPIC_PROGRESS_CHANGED_EVENT,
  getCompletedTopicExerciseTypes,
} from "@/lib/topicProgressStorage";

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

export function useCombinedExerciseProgress(combinedId: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function refresh() {
      const combined = getCombinedExerciseById(combinedId);
      setProgress(combined ? computeCombinedExerciseProgress(combined) : 0);
    }

    refresh();
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [combinedId]);

  return progress;
}
