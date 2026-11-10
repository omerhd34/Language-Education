"use client";

import { useCallback, useEffect, useState } from "react";
import type { ListeningSection } from "@/data/listenings/types";
import {
  LISTENING_PROGRESS_EVENT,
  isListeningListened,
  isListeningPracticeDone,
  listeningSectionPercent,
} from "@/lib/listeningProgressStorage";

export function useListeningSectionPercent(section: ListeningSection): number {
  const compute = useCallback(
    () => listeningSectionPercent(section.id),
    [section.id],
  );

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(compute());

    function onChange() {
      setPercent(compute());
    }

    window.addEventListener(LISTENING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(LISTENING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return percent;
}

export function useListeningSectionStatus(sectionId: string) {
  const compute = useCallback(() => {
    const listened = isListeningListened(sectionId);
    const practiceDone = isListeningPracticeDone(sectionId);
    return {
      listened,
      practiceDone,
      complete: listened && practiceDone,
      percent: listeningSectionPercent(sectionId),
    };
  }, [sectionId]);

  const [status, setStatus] = useState(() => ({
    listened: false,
    practiceDone: false,
    complete: false,
    percent: 0,
  }));

  useEffect(() => {
    setStatus(compute());

    function onChange() {
      setStatus(compute());
    }

    window.addEventListener(LISTENING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(LISTENING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return status;
}
