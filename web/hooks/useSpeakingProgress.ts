"use client";

import { useCallback, useEffect, useState } from "react";
import type { SpeakingSection } from "@/data/speakings/types";
import {
  SPEAKING_PROGRESS_EVENT,
  isSpeakingModelListened,
  isSpeakingModelTranslationShown,
  isSpeakingModelViewed,
  isSpeakingPracticeAllDone,
  isSpeakingPracticeDone,
  readSpeakingProgress,
  speakingSectionPercent,
} from "@/lib/speakingProgressStorage";

export function useSpeakingSectionPercent(section: SpeakingSection): number {
  const compute = useCallback(
    () => speakingSectionPercent(section.id),
    [section.id],
  );

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(compute());

    function onChange() {
      setPercent(compute());
    }

    window.addEventListener(SPEAKING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(SPEAKING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return percent;
}

export function useSpeakingSectionStatus(sectionId: string) {
  const compute = useCallback(() => {
    const modelTranslationShown = isSpeakingModelTranslationShown(sectionId);
    const modelListened = isSpeakingModelListened(sectionId);
    const modelViewed = isSpeakingModelViewed(sectionId);
    const practiceAllDone = isSpeakingPracticeAllDone(sectionId);
    const practiceDone = isSpeakingPracticeDone(sectionId);
    return {
      modelTranslationShown,
      modelListened,
      modelViewed,
      practiceAllDone,
      practiceDone,
      complete: modelViewed && practiceAllDone && practiceDone,
      percent: speakingSectionPercent(sectionId),
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

    window.addEventListener(SPEAKING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(SPEAKING_PROGRESS_EVENT, onChange);
  }, [compute]);

  return status;
}

export function useSpeakingProgressSnapshot() {
  const [map, setMap] = useState(readSpeakingProgress);

  useEffect(() => {
    function onChange() {
      setMap(readSpeakingProgress());
    }
    window.addEventListener(SPEAKING_PROGRESS_EVENT, onChange);
    return () => window.removeEventListener(SPEAKING_PROGRESS_EVENT, onChange);
  }, []);

  return map;
}
