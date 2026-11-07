export type ContinueActivityKind =
  | "vocabulary_category"
  | "vocabulary_exercises"
  | "vocabulary_quiz"
  | "topic_lesson"
  | "topic_exercises"
  | "topic_exam"
  | "combined_exercise";

export type ContinueActivity = {
  kind: ContinueActivityKind;
  href: string;
  topicId?: string;
  categoryId?: string;
  combinedId?: string;
  updatedAt: string;
};

const STORAGE_KEY = "pylmor-continue-activity";
export const CONTINUE_ACTIVITY_CHANGED_EVENT =
  "pylmor:continue-activity-changed";
export const CONTINUE_ACTIVITY_LIMIT = 2;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(): void {
  if (!canUseStorage()) {
    return;
  }
  window.dispatchEvent(new Event(CONTINUE_ACTIVITY_CHANGED_EVENT));
}

function isContinueActivityKind(value: unknown): value is ContinueActivityKind {
  return (
    value === "vocabulary_category" ||
    value === "vocabulary_exercises" ||
    value === "vocabulary_quiz" ||
    value === "topic_lesson" ||
    value === "topic_exercises" ||
    value === "topic_exam" ||
    value === "combined_exercise"
  );
}

export function continueActivitySectionKey(
  activity: Pick<
    ContinueActivity,
    "kind" | "href" | "topicId" | "categoryId" | "combinedId"
  >,
): string {
  if (
    activity.categoryId &&
    (activity.kind === "vocabulary_category" ||
      activity.kind === "vocabulary_exercises")
  ) {
    return `vocabulary:${activity.categoryId}`;
  }
  if (activity.topicId) {
    return `topic:${activity.kind}:${activity.topicId}`;
  }
  if (activity.combinedId) {
    return `combined:${activity.combinedId}`;
  }
  return `${activity.kind}:${activity.href}`;
}

function normalizeActivity(value: unknown): ContinueActivity | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (!isContinueActivityKind(record.kind)) {
    return null;
  }
  if (typeof record.href !== "string" || record.href.length === 0) {
    return null;
  }
  if (typeof record.updatedAt !== "string" || record.updatedAt.length === 0) {
    return null;
  }

  let kind = record.kind;
  const href = record.href;
  if (kind === "vocabulary_category" && href.includes("tab=exercises")) {
    kind = "vocabulary_exercises";
  }

  const activity: ContinueActivity = {
    kind,
    href,
    updatedAt: record.updatedAt,
  };

  if (typeof record.topicId === "string" && record.topicId.length > 0) {
    activity.topicId = record.topicId;
  }
  if (typeof record.categoryId === "string" && record.categoryId.length > 0) {
    activity.categoryId = record.categoryId;
  }
  if (typeof record.combinedId === "string" && record.combinedId.length > 0) {
    activity.combinedId = record.combinedId;
  }

  return activity;
}

function sameSection(
  left: ContinueActivity,
  right: Omit<ContinueActivity, "updatedAt">,
): boolean {
  return continueActivitySectionKey(left) === continueActivitySectionKey(right);
}

function dedupeBySection(activities: ContinueActivity[]): ContinueActivity[] {
  const seen = new Set<string>();
  const result: ContinueActivity[] = [];
  for (const item of activities) {
    const key = continueActivitySectionKey(item);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
    if (result.length >= CONTINUE_ACTIVITY_LIMIT) {
      break;
    }
  }
  return result;
}

function writeAll(activities: ContinueActivity[]): void {
  if (!canUseStorage()) {
    return;
  }
  if (activities.length === 0) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }
  emitChanged();
}

export function readContinueActivities(): ContinueActivity[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return dedupeBySection(
        parsed
          .map((item) => normalizeActivity(item))
          .filter((item): item is ContinueActivity => item !== null),
      );
    }

    const legacy = normalizeActivity(parsed);
    return legacy ? [legacy] : [];
  } catch {
    return [];
  }
}

/** @deprecated Prefer readContinueActivities */
export function readContinueActivity(): ContinueActivity | null {
  return readContinueActivities()[0] ?? null;
}

export function writeContinueActivity(
  activity: Omit<ContinueActivity, "updatedAt">,
): ContinueActivity[] {
  const current = readContinueActivities();
  const nextItem: ContinueActivity = {
    ...activity,
    updatedAt: new Date().toISOString(),
  };

  if (
    current[0] &&
    sameSection(current[0], activity) &&
    current[0].kind === activity.kind &&
    current[0].href === activity.href
  ) {
    return current;
  }

  const rest = current.filter((item) => !sameSection(item, activity));
  const next = dedupeBySection([nextItem, ...rest]);
  writeAll(next);
  return next;
}

export function clearContinueActivity(): void {
  writeAll([]);
}
