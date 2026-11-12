import type { ExerciseType } from "@/data/topics/types";

const STORAGE_KEY = "pylmor-exercise-drafts";
export const EXERCISE_DRAFT_EVENT = "pylmor:exercise-draft";

const EXERCISE_TYPES: readonly ExerciseType[] = [
  "multiple_choice",
  "true_false",
  "fill_blank",
  "crossword",
  "listening",
  "matching",
  "mixed",
];

export type CrosswordDraft = {
  exerciseId: string;
  puzzleIndex: number;
  solvedCount: number;
  finished: boolean;
  checked: boolean;
  values: Record<string, string>;
};

export type LinearVerbRowSlot = {
  v2Selected: number | null;
  v3Selected: number | null;
};

export type LinearSlot = {
  selected: number | null;
  answer: string;
  englishSelected: number | null;
  turkishSelected: number | null;
  v2Selected: number | null;
  verbRows?: LinearVerbRowSlot[];
  checked: boolean;
  matchingAssignments?: Record<string, number>;
  matchingRevealed?: boolean;
  matchingCorrect?: boolean;
};

export type LinearSessionDraft = {
  index: number;
  correct: number;
  total: number;
  slots: LinearSlot[];
};

type ExerciseDraftStore = {
  crosswords: Record<string, CrosswordDraft>;
  selectedTypes: Record<string, ExerciseType | null>;
  sessions: Record<string, LinearSessionDraft>;
  sessionOrders: Record<string, string[]>;
};

function emptyStore(): ExerciseDraftStore {
  return {
    crosswords: {},
    selectedTypes: {},
    sessions: {},
    sessionOrders: {},
  };
}

function sanitizeSessionOrder(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  const ids: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || item.length === 0) {
      return null;
    }
    ids.push(item);
  }
  return ids;
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(EXERCISE_DRAFT_EVENT));
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
    const letter = cell
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 1)
      .toUpperCase();
    if (letter) {
      result[key] = letter;
    }
  }
  return result;
}

function isNullableIndex(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === "number" && Number.isInteger(value) && value >= 0)
  );
}

function sanitizeMatchingAssignments(
  value: unknown,
): Record<string, number> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  const result: Record<string, number> = {};
  for (const [key, slot] of Object.entries(value)) {
    if (
      !/^\d+$/.test(key) ||
      typeof slot !== "number" ||
      !Number.isInteger(slot)
    ) {
      continue;
    }
    result[key] = slot;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function sanitizeVerbRowSlots(value: unknown): LinearVerbRowSlot[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const rows: LinearVerbRowSlot[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return undefined;
    }
    const row = item as Record<string, unknown>;
    if (
      !isNullableIndex(row.v2Selected ?? null) ||
      !isNullableIndex(row.v3Selected ?? null)
    ) {
      return undefined;
    }
    rows.push({
      v2Selected: isNullableIndex(row.v2Selected) ? row.v2Selected : null,
      v3Selected: isNullableIndex(row.v3Selected) ? row.v3Selected : null,
    });
  }

  return rows;
}

function normalizeLinearSession(value: unknown): LinearSessionDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (
    typeof item.index !== "number" ||
    !Number.isInteger(item.index) ||
    item.index < 0 ||
    typeof item.correct !== "number" ||
    !Number.isInteger(item.correct) ||
    item.correct < 0 ||
    typeof item.total !== "number" ||
    !Number.isInteger(item.total) ||
    item.total < 0 ||
    !Array.isArray(item.slots)
  ) {
    return null;
  }

  const slots: LinearSlot[] = [];
  for (const slotValue of item.slots) {
    if (
      !slotValue ||
      typeof slotValue !== "object" ||
      Array.isArray(slotValue)
    ) {
      return null;
    }
    const slot = slotValue as Record<string, unknown>;
    if (typeof slot.checked !== "boolean") {
      return null;
    }
    if (
      !isNullableIndex(slot.selected ?? null) ||
      !isNullableIndex(slot.englishSelected ?? null) ||
      !isNullableIndex(slot.turkishSelected ?? null) ||
      !isNullableIndex(slot.v2Selected ?? null) ||
      (slot.answer !== undefined && typeof slot.answer !== "string")
    ) {
      return null;
    }
    slots.push({
      selected: isNullableIndex(slot.selected) ? slot.selected : null,
      answer: typeof slot.answer === "string" ? slot.answer : "",
      englishSelected: isNullableIndex(slot.englishSelected)
        ? slot.englishSelected
        : null,
      turkishSelected: isNullableIndex(slot.turkishSelected)
        ? slot.turkishSelected
        : null,
      v2Selected: isNullableIndex(slot.v2Selected) ? slot.v2Selected : null,
      verbRows: sanitizeVerbRowSlots(slot.verbRows),
      checked: slot.checked,
      matchingAssignments: sanitizeMatchingAssignments(
        slot.matchingAssignments,
      ),
      matchingRevealed:
        typeof slot.matchingRevealed === "boolean"
          ? slot.matchingRevealed
          : undefined,
      matchingCorrect:
        typeof slot.matchingCorrect === "boolean"
          ? slot.matchingCorrect
          : undefined,
    });
  }

  return {
    index: item.index,
    correct: item.correct,
    total: item.total,
    slots,
  };
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
    const sessions: Record<string, LinearSessionDraft> = {};
    const sessionOrders: Record<string, string[]> = {};

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

    if (
      record.sessions &&
      typeof record.sessions === "object" &&
      !Array.isArray(record.sessions)
    ) {
      for (const [key, value] of Object.entries(record.sessions)) {
        const session = normalizeLinearSession(value);
        if (session) {
          sessions[key] = session;
        }
      }
    }

    if (
      record.sessionOrders &&
      typeof record.sessionOrders === "object" &&
      !Array.isArray(record.sessionOrders)
    ) {
      for (const [key, value] of Object.entries(record.sessionOrders)) {
        const order = sanitizeSessionOrder(value);
        if (order) {
          sessionOrders[key] = order;
        }
      }
    }

    return { crosswords, selectedTypes, sessions, sessionOrders };
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
    Object.keys(store.selectedTypes).length === 0 &&
    Object.keys(store.sessions).length === 0 &&
    Object.keys(store.sessionOrders).length === 0
  ) {
    window.localStorage.removeItem(STORAGE_KEY);
    emitChanged();
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  emitChanged();
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

export function readSelectedExerciseType(topicId: string): ExerciseType | null {
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

export function readLinearSession(key: string): LinearSessionDraft | null {
  return readStore().sessions[key] ?? null;
}

export function writeLinearSession(
  key: string,
  draft: LinearSessionDraft,
): void {
  const store = readStore();
  const next = normalizeLinearSession(draft);
  if (!next) {
    return;
  }

  const current = store.sessions[key];
  if (current && JSON.stringify(current) === JSON.stringify(next)) {
    return;
  }

  store.sessions[key] = next;
  writeStore(store);
}

export function readLinearSessionOrder(key: string): string[] | null {
  return readStore().sessionOrders[key] ?? null;
}

export function writeLinearSessionOrder(
  key: string,
  exerciseIds: string[],
): void {
  const order = sanitizeSessionOrder(exerciseIds);
  if (!order) {
    return;
  }
  const store = readStore();
  const current = store.sessionOrders[key];
  if (current && JSON.stringify(current) === JSON.stringify(order)) {
    return;
  }
  store.sessionOrders[key] = order;
  writeStore(store);
}

export function clearLinearSession(key: string): void {
  const store = readStore();
  const hadSession = Boolean(store.sessions[key]);
  const hadOrder = Boolean(store.sessionOrders[key]);
  if (!hadSession && !hadOrder) {
    return;
  }
  if (hadSession) {
    delete store.sessions[key];
  }
  if (hadOrder) {
    delete store.sessionOrders[key];
  }
  writeStore(store);
}

export function clearExerciseDraftStorage(): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}
