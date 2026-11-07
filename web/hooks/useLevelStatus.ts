"use client";

import { useEffect, useState } from "react";
import {
  buildTopicGridItems,
  getCombinedExerciseById,
} from "@/data/combinedExercises";
import type { CefrLevel } from "@/data/dashboardTopics";
import { computeCombinedExerciseProgress } from "@/hooks/useCombinedExerciseProgress";
import { usePassedLevelExams } from "@/hooks/usePassedLevelExams";
import { EXERCISE_DRAFT_EVENT } from "@/lib/exerciseDraftStorage";
import {
  LEVEL_EXAM_PROGRESS_EVENT,
  computeLevelExamPercent,
} from "@/lib/levelExamProgressStorage";
import { PASSED_LEVEL_EXAMS_CHANGED_EVENT } from "@/lib/levelExamStorage";
import { getActiveCefrLevel } from "@/lib/levelStatus";
import { computeDisplayedTopicProgress } from "@/lib/topicCardProgress";
import { TOPIC_EXAM_DRAFT_EVENT } from "@/lib/topicExamDraftStorage";
import { isLevelComplete, isLevelExamPassed } from "@/lib/topicAccess";
import { TOPIC_PROGRESS_CHANGED_EVENT } from "@/lib/topicProgressStorage";

export type LevelStatus = {
  level: CefrLevel;
  percent: number;
  complete: boolean;
};

export function computeLevelCompletionPercent(
  level: CefrLevel,
  passedExams: readonly CefrLevel[] = [],
): number {
  if (isLevelExamPassed(level, passedExams)) {
    return 100;
  }

  const items = buildTopicGridItems(level);
  if (items.length === 0) {
    return 0;
  }

  const parts = items.map((item) => {
    if (item.kind === "combined") {
      const combined =
        getCombinedExerciseById(item.combined.id) ?? item.combined;
      return computeCombinedExerciseProgress(combined);
    }

    if (item.topic.isExam) {
      return computeLevelExamPercent(level);
    }

    return computeDisplayedTopicProgress(item.topic.id);
  });

  const total = parts.reduce((sum, value) => sum + value, 0);
  return Math.min(100, Math.max(0, Math.round(total / parts.length)));
}

export function getLevelStatus(
  passedExams: readonly CefrLevel[] = [],
): LevelStatus {
  const level = getActiveCefrLevel(passedExams);
  return {
    level,
    percent: computeLevelCompletionPercent(level, passedExams),
    complete: isLevelComplete(level, passedExams),
  };
}

export function useLevelStatus(): LevelStatus {
  const passedExams = usePassedLevelExams();
  const [status, setStatus] = useState<LevelStatus>(() =>
    getLevelStatus(passedExams),
  );

  useEffect(() => {
    function refresh() {
      setStatus(getLevelStatus(passedExams));
    }

    refresh();
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener(TOPIC_EXAM_DRAFT_EVENT, refresh);
    window.addEventListener(EXERCISE_DRAFT_EVENT, refresh);
    window.addEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
    window.addEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener(TOPIC_EXAM_DRAFT_EVENT, refresh);
      window.removeEventListener(EXERCISE_DRAFT_EVENT, refresh);
      window.removeEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
      window.removeEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [passedExams]);

  return status;
}
