"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReadingLevel } from "@/data/readings/types";
import { canAccessReadingLevel } from "@/lib/readingAccess";
import {
  READING_LEVEL_PASSED_EVENT,
  READING_PROGRESS_EVENT,
} from "@/lib/readingProgressStorage";

export function useReadingLevelUnlockedCheck(): (
  level: ReadingLevel,
) => boolean {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function refresh() {
      setTick((value) => value + 1);
    }

    window.addEventListener(READING_PROGRESS_EVENT, refresh);
    window.addEventListener(READING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(READING_PROGRESS_EVENT, refresh);
      window.removeEventListener(READING_LEVEL_PASSED_EVENT, refresh);
    };
  }, []);

  return useCallback(
    (level: ReadingLevel) => {
      void tick;
      return canAccessReadingLevel(level);
    },
    [tick],
  );
}

export function useCanAccessReadingLevel(level: ReadingLevel): boolean {
  const compute = useCallback(() => canAccessReadingLevel(level), [level]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(compute());

    function refresh() {
      setUnlocked(compute());
    }

    window.addEventListener(READING_PROGRESS_EVENT, refresh);
    window.addEventListener(READING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(READING_PROGRESS_EVENT, refresh);
      window.removeEventListener(READING_LEVEL_PASSED_EVENT, refresh);
    };
  }, [compute]);

  return unlocked;
}
