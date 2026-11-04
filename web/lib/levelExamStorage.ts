import type { CefrLevel } from "@/data/dashboardTopics";
import { CEFR_LEVEL_ORDER } from "@/lib/topicAccess";

const STORAGE_KEY = "pylmor-passed-level-exams";
export const PASSED_LEVEL_EXAMS_COOKIE = "pylmor-passed-level-exams";
export const PASSED_LEVEL_EXAMS_CHANGED_EVENT =
  "pylmor:passed-level-exams-changed";

export const LEVEL_EXAM_PASS_RATIO = 0.75;

const CEFR_LEVEL_SET = new Set<string>(CEFR_LEVEL_ORDER);

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function isCefrLevel(value: unknown): value is CefrLevel {
  return typeof value === "string" && CEFR_LEVEL_SET.has(value);
}

function normalizeLevels(value: unknown): CefrLevel[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const filtered = value.filter(isCefrLevel);
  return CEFR_LEVEL_ORDER.filter((level) => filtered.includes(level));
}

export function parsePassedLevelExams(
  raw: string | undefined | null,
): CefrLevel[] {
  if (!raw) {
    return [];
  }

  const candidates = [raw];
  try {
    candidates.push(decodeURIComponent(raw));
  } catch {
    // keep original only
  }

  for (const candidate of candidates) {
    try {
      return normalizeLevels(JSON.parse(candidate));
    } catch {
      // try next
    }
  }

  return [];
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(PASSED_LEVEL_EXAMS_CHANGED_EVENT));
}

function syncCookie(levels: readonly CefrLevel[]): void {
  if (!canUseDom()) {
    return;
  }

  const value = encodeURIComponent(JSON.stringify(levels));
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${PASSED_LEVEL_EXAMS_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function readFromCookie(): CefrLevel[] {
  if (!canUseDom()) {
    return [];
  }

  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${PASSED_LEVEL_EXAMS_COOKIE}=`));

  if (!match) {
    return [];
  }

  return parsePassedLevelExams(
    match.slice(PASSED_LEVEL_EXAMS_COOKIE.length + 1),
  );
}

export function readPassedLevelExams(): CefrLevel[] {
  if (!canUseDom()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      return parsePassedLevelExams(raw);
    }
  } catch {
    // fall through to cookie
  }

  return readFromCookie();
}

export function writePassedLevelExams(levels: readonly CefrLevel[]): void {
  if (!canUseDom()) {
    return;
  }

  const unique = normalizeLevels([...levels]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  syncCookie(unique);
  emitChanged();
}

export function markLevelExamPassed(level: CefrLevel): CefrLevel[] {
  const current = readPassedLevelExams();
  if (current.includes(level)) {
    return current;
  }
  const next = [...current, level];
  writePassedLevelExams(next);
  return next;
}

export function clearPassedLevelExams(): void {
  if (!canUseDom()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${PASSED_LEVEL_EXAMS_COOKIE}=; path=/; max-age=0; samesite=lax`;
  emitChanged();
}

export function didPassExamScore(correct: number, total: number): boolean {
  if (total <= 0) {
    return false;
  }
  return correct / total >= LEVEL_EXAM_PASS_RATIO;
}
