"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReadingSection } from "@/data/readings/types";
import {
  READING_PROGRESS_EVENT,
  isReadingListened,
  isReadingPracticeComplete,
  readReadingProgress,
  readingSectionPercent,
} from "@/lib/readingProgressStorage";

export function passagePercent(sectionId: string): number {
  return readingSectionPercent(sectionId);
}

export function useReadingSectionPercent(section: ReadingSection): number {
  const compute = useCallback(() => passagePercent(section.id), [section.id]);

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(compute());

    function onChange() {
      setPercent(compute());
    }

    window.addEventListener(READING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(READING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return percent;
}

export function useReadingProgressSnapshot() {
  const [map, setMap] = useState(readReadingProgress);

  useEffect(() => {
    function onChange() {
      setMap(readReadingProgress());
    }
    window.addEventListener(READING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(READING_PROGRESS_EVENT, onChange);
  }, []);

  return map;
}

export function useReadingSectionStatus(sectionId: string) {
  const compute = useCallback(() => {
    const listened = isReadingListened(sectionId);
    const practiceDone = isReadingPracticeComplete(sectionId);
    return {
      listened,
      practiceDone,
      complete: listened && practiceDone,
      percent: passagePercent(sectionId),
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

    window.addEventListener(READING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(READING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return status;
}
