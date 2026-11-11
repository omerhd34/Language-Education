"use client";

import { useEffect, useState } from "react";
import { EXERCISE_DRAFT_EVENT } from "@/lib/exerciseDraftStorage";
import { TOPIC_EXAM_DRAFT_EVENT } from "@/lib/topicExamDraftStorage";
import { TOPIC_PROGRESS_CHANGED_EVENT } from "@/lib/topicProgressStorage";

export function useTopicItemAccessVersion(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    function bump() {
      setVersion((current) => current + 1);
    }

    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, bump);
    window.addEventListener(TOPIC_EXAM_DRAFT_EVENT, bump);
    window.addEventListener(EXERCISE_DRAFT_EVENT, bump);
    window.addEventListener("storage", bump);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, bump);
      window.removeEventListener(TOPIC_EXAM_DRAFT_EVENT, bump);
      window.removeEventListener(EXERCISE_DRAFT_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  return version;
}
