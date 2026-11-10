"use client";

import { useCallback, useEffect, useState } from "react";
import type { ListeningLevel } from "@/data/listenings/types";
import { canAccessListeningLevel } from "@/lib/listeningAccess";
import {
  LISTENING_LEVEL_PASSED_EVENT,
  LISTENING_PROGRESS_EVENT,
} from "@/lib/listeningProgressStorage";

export function useListeningLevelUnlockedCheck(): (
  level: ListeningLevel,
) => boolean {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    function refresh() {
      setTick((value) => value + 1);
    }

    window.addEventListener(LISTENING_PROGRESS_EVENT, refresh);
    window.addEventListener(LISTENING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(LISTENING_PROGRESS_EVENT, refresh);
      window.removeEventListener(LISTENING_LEVEL_PASSED_EVENT, refresh);
    };
  }, []);

  return useCallback(
    (level: ListeningLevel) => {
      void tick;
      return canAccessListeningLevel(level);
    },
    [tick],
  );
}

export function useCanAccessListeningLevel(level: ListeningLevel): boolean {
  const compute = useCallback(() => canAccessListeningLevel(level), [level]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(compute());

    function refresh() {
      setUnlocked(compute());
    }

    window.addEventListener(LISTENING_PROGRESS_EVENT, refresh);
    window.addEventListener(LISTENING_LEVEL_PASSED_EVENT, refresh);
    return () => {
      window.removeEventListener(LISTENING_PROGRESS_EVENT, refresh);
      window.removeEventListener(LISTENING_LEVEL_PASSED_EVENT, refresh);
    };
  }, [compute]);

  return unlocked;
}
