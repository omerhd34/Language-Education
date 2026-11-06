import type { ExerciseType } from "@/data/topics/types";

const STORAGE_KEY = "pylmor-exercise-drafts";

const EXERCISE_TYPES: readonly ExerciseType[] = [
  "multiple_choice",
  "fill_blank",
  "crossword",
  "listening",
];

export type CrosswordDraft = {
  exerciseId: string;
  puzzleIndex: number;
  solvedCount: number;
  finished: boolean;
  checked: boolean;
  values: Record<string, string>;
};

type ExerciseDraftStore = {
  crosswords: Record<string, CrosswordDraft>;
  selectedTypes: Record<string, ExerciseType | null>;
};

function emptyStore(): ExerciseDraftStore {
  return { crosswords: {}, selectedTypes: {} };
}

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function isExerciseType(value: unknown): value is ExerciseType {
  return (
    typeof value === "string" &&
    (EXERCISE_TYPES as readonly string[]).includes(value)
  );
}

function sanitizeValues(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, cell] of Object.entries(value)) {
    if (!/^\d+-\d+$/.test(key) || typeof cell !== "string") {
      continue;
    }
    const letter = cell.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase();
    if (letter) {
      result[key] = letter;
    }
  }
  return result;
}

function isCrosswordDraft(value: unknown): value is CrosswordDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.exerciseId === "string" &&
    typeof item.puzzleIndex === "number" &&
    Number.isInteger(item.puzzleIndex) &&
    item.puzzleIndex >= 0 &&
    typeof item.solvedCount === "number" &&
    Number.isInteger(item.solvedCount) &&
    item.solvedCount >= 0 &&
    typeof item.finished === "boolean" &&
    typeof item.checked === "boolean"
  );
}

function readStore(): ExerciseDraftStore {
  if (!canUseDom()) {
    return emptyStore();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return emptyStore();
    }

    const record = parsed as Record<string, unknown>;
    const crosswords: Record<string, CrosswordDraft> = {};
    const selectedTypes: Record<string, ExerciseType | null> = {};

    if (
      record.crosswords &&
      typeof record.crosswords === "object" &&
      !Array.isArray(record.crosswords)
    ) {
      for (const [key, value] of Object.entries(record.crosswords)) {
        if (!isCrosswordDraft(value)) {
          continue;
        }
        crosswords[key] = {
          exerciseId: value.exerciseId,
          puzzleIndex: value.puzzleIndex,
          solvedCount: value.solvedCount,
          finished: value.finished,
          checked: value.checked,
          values: sanitizeValues(value.values),
        };
      }
    }

    if (
      record.selectedTypes &&
      typeof record.selectedTypes === "object" &&
      !Array.isArray(record.selectedTypes)
    ) {
      for (const [key, value] of Object.entries(record.selectedTypes)) {
        if (value === null) {
          selectedTypes[key] = null;
        } else if (isExerciseType(value)) {
          selectedTypes[key] = value;
        }
      }
    }

    return { crosswords, selectedTypes };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ExerciseDraftStore): void {
  if (!canUseDom()) {
    return;
  }

  if (
    Object.keys(store.crosswords).length === 0 &&
    Object.keys(store.selectedTypes).length === 0
  ) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function isEmptyDraft(draft: CrosswordDraft): boolean {
  return (
    !draft.finished &&
    !draft.checked &&
    draft.puzzleIndex === 0 &&
    draft.solvedCount === 0 &&
    Object.keys(draft.values).length === 0
  );
}

export function readCrosswordDraft(key: string): CrosswordDraft | null {
  return readStore().crosswords[key] ?? null;
}

export function writeCrosswordDraft(key: string, draft: CrosswordDraft): void {
  const store = readStore();
  if (isEmptyDraft(draft)) {
    if (!store.crosswords[key]) {
      return;
    }
    delete store.crosswords[key];
    writeStore(store);
    return;
  }

  store.crosswords[key] = {
    ...draft,
    values: sanitizeValues(draft.values),
  };
  writeStore(store);
}

export function clearCrosswordDraft(key: string): void {
  const store = readStore();
  if (!store.crosswords[key]) {
    return;
  }
  delete store.crosswords[key];
  writeStore(store);
}

export function readSelectedExerciseType(
  topicId: string,
): ExerciseType | null {
  return readStore().selectedTypes[topicId] ?? null;
}

export function writeSelectedExerciseType(
  topicId: string,
  type: ExerciseType | null,
): void {
  const store = readStore();
  if (type === null) {
    if (!(topicId in store.selectedTypes)) {
      return;
    }
    delete store.selectedTypes[topicId];
    writeStore(store);
    return;
  }

  if (store.selectedTypes[topicId] === type) {
    return;
  }

  store.selectedTypes[topicId] = type;
  writeStore(store);
}

export function clearExerciseDraftStorage(): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
