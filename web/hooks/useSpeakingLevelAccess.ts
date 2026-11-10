"use client";

import { useCallback, useEffect, useState } from "react";
import type { SpeakingLevel } from "@/data/speakings/types";
import { canAccessSpeakingLevel } from "@/lib/speakingAccess";
import {
  SPEAKING_LEVEL_PASSED_EVENT,
  SPEAKING_PROGRESS_EVENT,
} from "@/lib/speakingProgressStorage";

export function useSpeakingLevelUnlockedCheck(): (
  level: SpeakingLevel,
) => boolean {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function refresh() {
      setTick((value) => value + 1);
    }

    window.addEventListener(SPEAKING_PROGRESS_EVENT, refresh);
    window.addEventListener(SPEAKING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(SPEAKING_PROGRESS_EVENT, refresh);
      window.removeEventListener(SPEAKING_LEVEL_PASSED_EVENT, refresh);
    };
  }, []);

  return useCallback(
    (level: SpeakingLevel) => {
      void tick;
      return canAccessSpeakingLevel(level);
    },
    [tick],
  );
}

export function useCanAccessSpeakingLevel(level: SpeakingLevel): boolean {
  const compute = useCallback(() => canAccessSpeakingLevel(level), [level]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(compute());

    function refresh() {
      setUnlocked(compute());
    }

    window.addEventListener(SPEAKING_PROGRESS_EVENT, refresh);
    window.addEventListener(SPEAKING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(SPEAKING_PROGRESS_EVENT, refresh);
      window.removeEventListener(SPEAKING_LEVEL_PASSED_EVENT, refresh);
    };
  }, [compute]);

  return unlocked;
}
