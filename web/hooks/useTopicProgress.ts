"use client";

import { useEffect, useState } from "react";
import {
  TOPIC_PROGRESS_CHANGED_EVENT,
  computeTopicProgressPercent,
} from "@/lib/topicProgressStorage";

export function useTopicProgress(topicId: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function refresh() {
      setProgress(computeTopicProgressPercent(topicId));
    }

    refresh();
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [topicId]);

  return progress;
}
