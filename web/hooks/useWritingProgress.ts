"use client";

import { useCallback, useEffect, useState } from "react";
import type { WritingSection } from "@/data/writings/types";
import {
  WRITING_PROGRESS_EVENT,
  isWritingModelListened,
  isWritingModelTranslationShown,
  isWritingModelViewed,
  isWritingPracticeAllDone,
  isWritingPracticeDone,
  readWritingProgress,
  writingSectionPercent,
} from "@/lib/writingProgressStorage";

export function useWritingSectionPercent(section: WritingSection): number {
  const compute = useCallback(
    () => writingSectionPercent(section.id),
    [section.id],
  );

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(compute());

    function onChange() {
      setPercent(compute());
    }

    window.addEventListener(WRITING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(WRITING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return percent;
}

export function useWritingProgressSnapshot() {
  const [map, setMap] = useState(readWritingProgress);

  useEffect(() => {
    function onChange() {
      setMap(readWritingProgress());
    }
    window.addEventListener(WRITING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(WRITING_PROGRESS_EVENT, onChange);
  }, []);

  return map;
}

export function useWritingSectionStatus(sectionId: string) {
  const compute = useCallback(() => {
    const modelTranslationShown = isWritingModelTranslationShown(sectionId);
    const modelListened = isWritingModelListened(sectionId);
    const modelViewed = isWritingModelViewed(sectionId);
    const practiceAllDone = isWritingPracticeAllDone(sectionId);
    const practiceDone = isWritingPracticeDone(sectionId);
    return {
      modelTranslationShown,
      modelListened,
      modelViewed,
      practiceAllDone,
      practiceDone,
      complete: modelViewed && practiceAllDone && practiceDone,
      percent: writingSectionPercent(sectionId),
    };
  }, [sectionId]);

  const [status, setStatus] = useState(() => ({
    modelTranslationShown: false,
    modelListened: false,
    modelViewed: false,
    practiceAllDone: false,
    practiceDone: false,
    complete: false,
    percent: 0,
  }));

  useEffect(() => {
    setStatus(compute());

    function onChange() {
      setStatus(compute());
    }

    window.addEventListener(WRITING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(WRITING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return status;
}
