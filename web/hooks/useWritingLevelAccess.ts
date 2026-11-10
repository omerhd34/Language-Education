"use client";

import { useCallback, useEffect, useState } from "react";
import type { WritingLevel } from "@/data/writings/types";
import { canAccessWritingLevel } from "@/lib/writingAccess";
import {
  WRITING_LEVEL_PASSED_EVENT,
  WRITING_PROGRESS_EVENT,
} from "@/lib/writingProgressStorage";

export function useWritingLevelUnlockedCheck(): (
  level: WritingLevel,
) => boolean {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function refresh() {
      setTick((value) => value + 1);
    }

    window.addEventListener(WRITING_PROGRESS_EVENT, refresh);
    window.addEventListener(WRITING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(WRITING_PROGRESS_EVENT, refresh);
      window.removeEventListener(WRITING_LEVEL_PASSED_EVENT, refresh);
    };
  }, []);

  return useCallback(
    (level: WritingLevel) => {
      void tick;
      return canAccessWritingLevel(level);
    },
    [tick],
  );
}

export function useCanAccessWritingLevel(level: WritingLevel): boolean {
  const compute = useCallback(() => canAccessWritingLevel(level), [level]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(compute());

    function refresh() {
      setUnlocked(compute());
    }

    window.addEventListener(WRITING_PROGRESS_EVENT, refresh);
    window.addEventListener(WRITING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(WRITING_PROGRESS_EVENT, refresh);
      window.removeEventListener(WRITING_LEVEL_PASSED_EVENT, refresh);
    };
  }, [compute]);

  return unlocked;
}
