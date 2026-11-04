"use client";

import { useSyncExternalStore } from "react";
import type { CefrLevel } from "@/data/dashboardTopics";
import {
  PASSED_LEVEL_EXAMS_CHANGED_EVENT,
  readPassedLevelExams,
} from "@/lib/levelExamStorage";

let cachedKey = "";
let cachedLevels: CefrLevel[] = [];

function getCachedLevels(): CefrLevel[] {
  const levels = readPassedLevelExams();
  const key = levels.join("|");
  if (key === cachedKey) {
    return cachedLevels;
  }
  cachedKey = key;
  cachedLevels = levels;
  return cachedLevels;
}

function subscribe(onStoreChange: () => void): () => void {
  const handleChange = () => {
    cachedKey = "";
    onStoreChange();
  };
  window.addEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  return () => {
    window.removeEventListener(PASSED_LEVEL_EXAMS_CHANGED_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

function getServerSnapshot(): CefrLevel[] {
  return cachedLevels.length === 0 ? cachedLevels : [];
}

const EMPTY: CefrLevel[] = [];

export function usePassedLevelExams(): CefrLevel[] {
  return useSyncExternalStore(subscribe, getCachedLevels, () => EMPTY);
}
