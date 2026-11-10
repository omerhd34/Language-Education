"use client";

import { useEffect, useMemo, useState } from "react";
import { EXERCISE_DRAFT_EVENT } from "@/lib/exerciseDraftStorage";
import { LEVEL_EXAM_PROGRESS_EVENT } from "@/lib/levelExamProgressStorage";
import { PASSED_LEVEL_EXAMS_CHANGED_EVENT } from "@/lib/levelExamStorage";
import { getLevelStatus, type LevelStatus } from "@/lib/levelStatus";
import { LISTENING_PROGRESS_EVENT } from "@/lib/listeningProgressStorage";
import { READING_PROGRESS_EVENT } from "@/lib/readingProgressStorage";
import { SPEAKING_PROGRESS_EVENT } from "@/lib/speakingProgressStorage";
import { WRITING_PROGRESS_EVENT } from "@/lib/writingProgressStorage";
import { TOPIC_EXAM_DRAFT_EVENT } from "@/lib/topicExamDraftStorage";
import { TOPIC_PROGRESS_CHANGED_EVENT } from "@/lib/topicProgressStorage";
import { VOCABULARY_ACTIVITY_EVENT } from "@/lib/vocabularyActivityStorage";
import { usePassedLevelExams } from "@/hooks/usePassedLevelExams";
import { useKnownVocabularyWordsQuery } from "@/store/api";

export type { LevelStatus } from "@/lib/levelStatus";
export {
  computeLevelCompletionPercent,
  getLevelStatus,
} from "@/lib/levelStatus";

export function useLevelStatus(): LevelStatus {
  const passedExams = usePassedLevelExams();
  const { data: knownWords } = useKnownVocabularyWordsQuery();
  const knownWordIds = useMemo(
    () => new Set((knownWords?.words ?? []).map((word) => word.id)),
    [knownWords],
  );
  const [status, setStatus] = useState<LevelStatus>(() =>
    getLevelStatus(passedExams, knownWordIds),
  );

  useEffect(() => {
    function refresh() {
      setStatus(getLevelStatus(passedExams, knownWordIds));
    }

    refresh();
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener(TOPIC_EXAM_DRAFT_EVENT, refresh);
    window.addEventListener(EXERCISE_DRAFT_EVENT, refresh);
    window.addEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
    window.addEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, refresh);
    window.addEventListener(READING_PROGRESS_EVENT, refresh);
    window.addEventListener(LISTENING_PROGRESS_EVENT, refresh);
    window.addEventListener(WRITING_PROGRESS_EVENT, refresh);
    window.addEventListener(SPEAKING_PROGRESS_EVENT, refresh);
    window.addEventListener(VOCABULARY_ACTIVITY_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener(TOPIC_EXAM_DRAFT_EVENT, refresh);
      window.removeEventListener(EXERCISE_DRAFT_EVENT, refresh);
      window.removeEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
      window.removeEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, refresh);
      window.removeEventListener(READING_PROGRESS_EVENT, refresh);
      window.removeEventListener(LISTENING_PROGRESS_EVENT, refresh);
      window.removeEventListener(WRITING_PROGRESS_EVENT, refresh);
      window.removeEventListener(SPEAKING_PROGRESS_EVENT, refresh);
      window.removeEventListener(VOCABULARY_ACTIVITY_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [passedExams, knownWordIds]);

  return status;
}
