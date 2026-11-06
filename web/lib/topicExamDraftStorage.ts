import { isTopicExamPassed } from "@/lib/topicProgressStorage";

const STORAGE_KEY = "pylmor-topic-exam-drafts";
export const TOPIC_EXAM_DRAFT_EVENT = "pylmor:topic-exam-draft";

export type TopicExamSlot = {
  selected: number | null;
  checked: boolean;
};

export type TopicExamDraft = {
  active: boolean;
  index: number;
  correct: number;
  total: number;
  slots: TopicExamSlot[];
};

type TopicExamDraftMap = Record<string, TopicExamDraft>;

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(TOPIC_EXAM_DRAFT_EVENT));
}

function isSlot(value: unknown): value is TopicExamSlot {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const slot = value as Record<string, unknown>;
  const selectedOk =
    slot.selected === null ||
    (typeof slot.selected === "number" &&
      Number.isInteger(slot.selected) &&
      slot.selected >= 0);
  return selectedOk && typeof slot.checked === "boolean";
}

function isDraft(value: unknown): value is TopicExamDraft {
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
      if (isDraft(value)) {
        map[topicId] = value;
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
  const current = all[topicId];
  if (
    current &&
    current.active === draft.active &&
    current.index === draft.index &&
    current.correct === draft.correct &&
    current.total === draft.total &&
    current.slots.length === draft.slots.length &&
    current.slots.every(
      (slot, index) =>
        slot.selected === draft.slots[index]?.selected &&
        slot.checked === draft.slots[index]?.checked,
    )
  ) {
    return;
  }

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

export function readTopicExamPercent(topicId: string): number {
  const draft = readTopicExamDraft(topicId);
  if (draft?.active) {
    return toExamPercent(draft.correct, draft.total);
  }
  if (isTopicExamPassed(topicId)) {
    return 100;
  }
  return 0;
}
