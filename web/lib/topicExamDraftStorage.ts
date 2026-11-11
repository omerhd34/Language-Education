import { isTopicExamPassed } from "@/lib/topicProgressStorage";

const STORAGE_KEY = "pylmor-topic-exam-drafts";
export const TOPIC_EXAM_DRAFT_EVENT = "pylmor:topic-exam-draft";

export type TopicQuizPart =
  | "multiple_choice"
  | "fill_blank"
  | "crossword"
  | "mixed";

export type TopicExamSlot = {
  selected: number | null;
  answer: string;
  checked: boolean;
};

export type TopicExamPartDraft = {
  active: boolean;
  index: number;
  correct: number;
  total: number;
  slots: TopicExamSlot[];
};

export type TopicExamDraft = {
  requiredParts: TopicQuizPart[];
  passedParts: TopicQuizPart[];
  parts: Partial<Record<TopicQuizPart, TopicExamPartDraft>>;
  quizOrderByPart?: Partial<Record<TopicQuizPart, string[]>>;
};

type TopicExamDraftMap = Record<string, TopicExamDraft>;

const QUIZ_PARTS: readonly TopicQuizPart[] = [
  "multiple_choice",
  "fill_blank",
  "crossword",
  "mixed",
];

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(TOPIC_EXAM_DRAFT_EVENT));
}

function isQuizPart(value: unknown): value is TopicQuizPart {
  return (
    value === "multiple_choice" ||
    value === "fill_blank" ||
    value === "crossword" ||
    value === "mixed"
  );
}

function isSlot(value: unknown): value is TopicExamSlot {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const slot = value as Record<string, unknown>;
  const selectedOk =
    slot.selected === null ||
    slot.selected === undefined ||
    (typeof slot.selected === "number" &&
      Number.isInteger(slot.selected) &&
      slot.selected >= 0);
  const answerOk = slot.answer === undefined || typeof slot.answer === "string";
  return selectedOk && answerOk && typeof slot.checked === "boolean";
}

function normalizeSlot(value: TopicExamSlot): TopicExamSlot {
  return {
    selected:
      typeof value.selected === "number" && value.selected >= 0
        ? value.selected
        : null,
    answer: typeof value.answer === "string" ? value.answer : "",
    checked: value.checked,
  };
}

function isPartDraft(value: unknown): value is TopicExamPartDraft {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return (
    typeof item.active === "boolean" &&
    typeof item.index === "number" &&
    Number.isInteger(item.index) &&
    item.index >= 0 &&
    typeof item.correct === "number" &&
    Number.isInteger(item.correct) &&
    item.correct >= 0 &&
    typeof item.total === "number" &&
    Number.isInteger(item.total) &&
    item.total >= 0 &&
    Array.isArray(item.slots) &&
    item.slots.every(isSlot)
  );
}

function normalizePart(value: TopicExamPartDraft): TopicExamPartDraft {
  return {
    active: value.active,
    index: value.index,
    correct: value.correct,
    total: value.total,
    slots: value.slots.map((slot) => normalizeSlot(slot)),
  };
}

function emptyDraft(): TopicExamDraft {
  return { requiredParts: [], passedParts: [], parts: {}, quizOrderByPart: {} };
}

function normalizeOrderIds(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const ids = value.filter((item): item is string => typeof item === "string");
  return ids.length > 0 ? ids : undefined;
}

function normalizeQuizOrderByPart(
  value: unknown,
): TopicExamDraft["quizOrderByPart"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  const source = value as Record<string, unknown>;
  const next: NonNullable<TopicExamDraft["quizOrderByPart"]> = {};
  for (const part of QUIZ_PARTS) {
    const ids = normalizeOrderIds(source[part]);
    if (ids) {
      next[part] = ids;
    }
  }
  return next;
}

function normalizeDraft(value: unknown): TopicExamDraft | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const item = value as Record<string, unknown>;

  if (isPartDraft(item)) {
    return {
      requiredParts: ["multiple_choice"],
      passedParts: [],
      parts: { multiple_choice: normalizePart(item) },
    };
  }

  if (
    !item.parts ||
    typeof item.parts !== "object" ||
    Array.isArray(item.parts)
  ) {
    return null;
  }

  const parts: TopicExamDraft["parts"] = {};
  for (const [key, part] of Object.entries(item.parts)) {
    if (isQuizPart(key) && isPartDraft(part)) {
      parts[key] = normalizePart(part);
    }
  }

  const requiredParts = Array.isArray(item.requiredParts)
    ? item.requiredParts.filter(isQuizPart)
    : [];
  const passedParts = Array.isArray(item.passedParts)
    ? item.passedParts.filter(isQuizPart)
    : [];

  const quizOrderByPart = normalizeQuizOrderByPart(item.quizOrderByPart);

  return { requiredParts, passedParts, parts, quizOrderByPart };
}

function readAll(): TopicExamDraftMap {
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

    const map: TopicExamDraftMap = {};
    for (const [topicId, value] of Object.entries(parsed)) {
      const draft = normalizeDraft(value);
      if (draft) {
        map[topicId] = draft;
      }
    }
    return map;
  } catch {
    return {};
  }
}

function writeAll(map: TopicExamDraftMap): void {
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

export function toExamPercent(correct: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
}

export function readTopicExamDraft(topicId: string): TopicExamDraft | null {
  return readAll()[topicId] ?? null;
}

export function writeTopicExamDraft(
  topicId: string,
  draft: TopicExamDraft,
): void {
  const all = readAll();
  writeAll({
    ...all,
    [topicId]: draft,
  });
}

export function clearTopicExamDraft(topicId: string): void {
  const all = readAll();
  if (!all[topicId]) {
    return;
  }
  delete all[topicId];
  writeAll(all);
}

export function clearTopicExamDrafts(): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  emitChanged();
}

function partPercent(draft: TopicExamDraft, part: TopicQuizPart): number {
  if (draft.passedParts.includes(part)) {
    return 100;
  }
  return 0;
}

export function readTopicQuizPartPercents(
  topicId: string,
  parts: readonly TopicQuizPart[],
): number[] {
  if (parts.length === 0) {
    return [];
  }

  const draft = readTopicExamDraft(topicId);
  const passed = isTopicExamPassed(topicId);
  if (!draft) {
    return parts.map(() => (passed ? 100 : 0));
  }

  const anyActive = parts.some((part) => draft.parts[part]?.active);
  if (!anyActive && draft.passedParts.length === 0 && passed) {
    return parts.map(() => 100);
  }

  return parts.map((part) => partPercent(draft, part));
}

export function readTopicExamPercent(topicId: string): number {
  const draft = readTopicExamDraft(topicId);
  if (!draft) {
    return isTopicExamPassed(topicId) ? 100 : 0;
  }

  const required =
    draft.requiredParts.length > 0
      ? draft.requiredParts
      : QUIZ_PARTS.filter((part) => draft.parts[part]);

  if (required.length === 0) {
    return isTopicExamPassed(topicId) ? 100 : 0;
  }

  const anyActive = required.some((part) => draft.parts[part]?.active);
  if (
    !anyActive &&
    draft.passedParts.length === 0 &&
    isTopicExamPassed(topicId)
  ) {
    return 100;
  }

  const total = required.reduce(
    (sum, part) => sum + partPercent(draft, part),
    0,
  );
  return Math.round(total / required.length);
}

export function emptyTopicExamDraft(): TopicExamDraft {
  return emptyDraft();
}
