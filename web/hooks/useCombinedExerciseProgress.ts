"use client";

import { useEffect, useState } from "react";
import { getCombinedExerciseById } from "@/data/combinedExercises";
import { computeCombinedExerciseProgress } from "@/lib/combinedExerciseProgress";
import { TOPIC_PROGRESS_CHANGED_EVENT } from "@/lib/topicProgressStorage";

export { computeCombinedExerciseProgress } from "@/lib/combinedExerciseProgress";

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
