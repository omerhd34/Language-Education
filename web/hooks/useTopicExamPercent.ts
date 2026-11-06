"use client";

import { useEffect, useState } from "react";
import { TOPIC_PROGRESS_CHANGED_EVENT } from "@/lib/topicProgressStorage";
import {
  TOPIC_EXAM_DRAFT_EVENT,
  readTopicExamPercent,
} from "@/lib/topicExamDraftStorage";

export function useTopicExamPercent(topicId: string): number {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function refresh() {
      setPercent(readTopicExamPercent(topicId));
    }

    refresh();
    window.addEventListener(TOPIC_EXAM_DRAFT_EVENT, refresh);
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_EXAM_DRAFT_EVENT, refresh);
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [topicId]);

  return percent;
}
