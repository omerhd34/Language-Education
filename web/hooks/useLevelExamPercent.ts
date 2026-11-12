"use client";

import { useEffect, useState } from "react";
import type { CefrLevel } from "@/data/grammar/dashboardTopics";
import {
  LEVEL_EXAM_PROGRESS_EVENT,
  computeLevelExamPercent,
} from "@/lib/levelExamProgressStorage";
import { PASSED_LEVEL_EXAMS_CHANGED_EVENT } from "@/lib/levelExamStorage";

export function useLevelExamPercent(level: CefrLevel): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function refresh() {
      setProgress(computeLevelExamPercent(level));
    }

    refresh();
    window.addEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
    window.addEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
      window.removeEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [level]);

  return progress;
}
