import type { CefrLevel } from "@/data/grammar/dashboardTopics";
import { readPassedLevelExams } from "@/lib/levelExamStorage";
import { getLevelExamParts, type LevelExamPart } from "@/lib/topicExam";

const STORAGE_KEY = "pylmor-level-exam-progress";
export const LEVEL_EXAM_PROGRESS_EVENT = "pylmor:level-exam-progress";

type LevelExamPartProgress = {
  percent: number;
  passed: boolean;
};

type LevelExamProgress = {
  parts: Partial<Record<LevelExamPart, LevelExamPartProgress>>;
};

type LevelExamProgressMap = Partial<Record<CefrLevel, LevelExamProgress>>;

const PARTS: readonly LevelExamPart[] = ["fill_blank", "crossword"];

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(LEVEL_EXAM_PROGRESS_EVENT));
}

function isPartProgress(value: unknown): value is LevelExamPartProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.percent === "number" &&
    Number.isFinite(item.percent) &&
    typeof item.passed === "boolean"
  );
}

function normalizeProgress(value: unknown): LevelExamProgress | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const partsValue = raw.parts;
  if (
    !partsValue ||
    typeof partsValue !== "object" ||
    Array.isArray(partsValue)
  ) {
    return { parts: {} };
  }

  const parts: LevelExamProgress["parts"] = {};
  for (const part of PARTS) {
    const item = (partsValue as Record<string, unknown>)[part];
    if (!isPartProgress(item)) {
      continue;
    }
    parts[part] = {
      percent: Math.min(100, Math.max(0, Math.round(item.percent))),
      passed: item.passed,
    };
  }
  return { parts };
}

function readAll(): LevelExamProgressMap {
  if (!canUseDom()) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    const map: LevelExamProgressMap = {};
    for (const [level, value] of Object.entries(parsed)) {
      const progress = normalizeProgress(value);
      if (progress) {
        map[level as CefrLevel] = progress;
      }
    }
    return map;
  } catch {
    return {};
  }
}

function writeAll(map: LevelExamProgressMap): void {
  if (!canUseDom()) {
    return;
  }
  if (Object.keys(map).length === 0) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }
  emitChanged();
}

export function readLevelExamProgress(level: CefrLevel): LevelExamProgress {
  return readAll()[level] ?? { parts: {} };
}

export function writeLevelExamPartProgress(
  level: CefrLevel,
  part: LevelExamPart,
  progress: LevelExamPartProgress,
): void {
  const all = readAll();
  const current = all[level] ?? { parts: {} };
  const next = {
    percent: Math.min(100, Math.max(0, Math.round(progress.percent))),
    passed: progress.passed,
  };
  const previous = current.parts[part];
  if (
    previous &&
    previous.percent === next.percent &&
    previous.passed === next.passed
  ) {
    return;
  }
  writeAll({
    ...all,
    [level]: {
      parts: {
        ...current.parts,
        [part]: next,
      },
    },
  });
}

export function resetUnpassedLevelExamParts(level: CefrLevel): void {
  const all = readAll();
  const current = all[level] ?? { parts: {} };
  const parts: LevelExamProgress["parts"] = { ...current.parts };
  for (const part of getLevelExamParts(level)) {
    if (parts[part]?.passed) {
      parts[part] = { percent: 100, passed: true };
      continue;
    }
    parts[part] = { percent: 0, passed: false };
  }
  writeAll({
    ...all,
    [level]: { parts },
  });
}

export function clearLevelExamProgress(): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  emitChanged();
}

export function computeLevelExamPercent(level: CefrLevel): number {
  if (readPassedLevelExams().includes(level)) {
    return 100;
  }

  const parts = getLevelExamParts(level);
  if (parts.length === 0) {
    return 0;
  }

  const saved = readLevelExamProgress(level);
  const total = parts.reduce((sum, part) => {
    const item = saved.parts[part];
    if (!item) {
      return sum;
    }
    return sum + (item.passed ? 100 : item.percent);
  }, 0);
  return Math.min(100, Math.max(0, Math.round(total / parts.length)));
}
