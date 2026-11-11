import type { TopicQuizPart } from "@/lib/topicExamDraftStorage";
import { shuffleRandom } from "@/lib/seededRandom";

export function orderItemsByIds<T extends { id: string }>(
  items: readonly T[],
  ids: readonly string[],
): T[] {
  const map = new Map(items.map((item) => [item.id, item]));
  const ordered: T[] = [];
  for (const id of ids) {
    const item = map.get(id);
    if (item) {
      ordered.push(item);
    }
  }
  return ordered.length === items.length ? ordered : [...items];
}

export function buildQuizOrderIds<T extends { id: string }>(
  items: readonly T[],
  savedOrder: readonly string[] | undefined,
  resumeSession: boolean,
): string[] {
  if (resumeSession && savedOrder && savedOrder.length === items.length) {
    return [...savedOrder];
  }
  return shuffleRandom(items).map((item) => item.id);
}

type QuizPartDraftLike =
  | {
      active: boolean;
      index: number;
      correct: number;
      total: number;
      slots: { checked: boolean }[];
    }
  | undefined;

/** Quiz tamamlanmadan yüzde göstermemek için; oturum sürdürme (sıra, slot) için kullanılır. */
export function quizPartSessionStarted(
  part: TopicQuizPart,
  partDraft: QuizPartDraftLike,
): boolean {
  if (!partDraft?.active) {
    return false;
  }
  if (partDraft.index > 0) {
    return true;
  }
  if (part === "crossword" || partDraft.slots.length === 0) {
    return partDraft.correct > 0;
  }
  return partDraft.slots.some((slot) => slot.checked);
}

export function quizPartProgressPercent(
  _part: TopicQuizPart,
  _partDraft: QuizPartDraftLike,
  passed: boolean,
): number {
  return passed ? 100 : 0;
}
