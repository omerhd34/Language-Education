export type ContinueActivityKind =
  | "vocabulary_category"
  | "vocabulary_exercises"
  | "vocabulary_quiz"
  | "topic_lesson"
  | "topic_exercises"
  | "topic_exam"
  | "combined_exercise"
  | "reading_text"
  | "reading_exercises"
  | "listening_audio"
  | "listening_exercises"
  | "writing_model"
  | "writing_exercises"
  | "skill_hub";

export type ContinueActivitySkill =
  | "reading"
  | "listening"
  | "writing"
  | "speaking"
  | "topics"
  | "vocabulary";

export type ContinueActivity = {
  kind: ContinueActivityKind;
  href: string;
  topicId?: string;
  categoryId?: string;
  combinedId?: string;
  readingId?: string;
  listeningId?: string;
  writingId?: string;
  skill?: ContinueActivitySkill;
  updatedAt: string;
};

const STORAGE_KEY = "pylmor-continue-activity";
export const CONTINUE_ACTIVITY_CHANGED_EVENT =
  "pylmor:continue-activity-changed";
export const CONTINUE_ACTIVITY_LIMIT = 2;

const CONTINUE_ACTIVITY_KINDS: readonly ContinueActivityKind[] = [
  "vocabulary_category",
  "vocabulary_exercises",
  "vocabulary_quiz",
  "topic_lesson",
  "topic_exercises",
  "topic_exam",
  "combined_exercise",
  "reading_text",
  "reading_exercises",
  "listening_audio",
  "listening_exercises",
  "writing_model",
  "writing_exercises",
  "skill_hub",
];

const CONTINUE_ACTIVITY_SKILLS: readonly ContinueActivitySkill[] = [
  "reading",
  "listening",
  "writing",
  "speaking",
  "topics",
  "vocabulary",
];

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
    typeof value === "string" &&
    (CONTINUE_ACTIVITY_KINDS as readonly string[]).includes(value)
  );
}

function isContinueActivitySkill(
  value: unknown,
): value is ContinueActivitySkill {
  return (
    typeof value === "string" &&
    (CONTINUE_ACTIVITY_SKILLS as readonly string[]).includes(value)
  );
}

export function activitySkill(
  activity: Pick<ContinueActivity, "kind" | "skill">,
): ContinueActivitySkill | null {
  if (activity.kind === "skill_hub") {
    return activity.skill ?? null;
  }

  switch (activity.kind) {
    case "vocabulary_category":
    case "vocabulary_exercises":
    case "vocabulary_quiz":
      return "vocabulary";
    case "topic_lesson":
    case "topic_exercises":
    case "topic_exam":
    case "combined_exercise":
      return "topics";
    case "reading_text":
    case "reading_exercises":
      return "reading";
    case "listening_audio":
    case "listening_exercises":
      return "listening";
    case "writing_model":
    case "writing_exercises":
      return "writing";
  }
}

export function continueActivitySectionKey(
  activity: Pick<
    ContinueActivity,
    | "kind"
    | "href"
    | "topicId"
    | "categoryId"
    | "combinedId"
    | "readingId"
    | "listeningId"
    | "writingId"
    | "skill"
  >,
): string {
  if (activity.kind === "skill_hub" && activity.skill) {
    return `skill:${activity.skill}`;
  }
  if (
    activity.readingId &&
    (activity.kind === "reading_text" || activity.kind === "reading_exercises")
  ) {
    return `reading:${activity.readingId}`;
  }
  if (
    activity.listeningId &&
    (activity.kind === "listening_audio" ||
      activity.kind === "listening_exercises")
  ) {
    return `listening:${activity.listeningId}`;
  }
  if (
    activity.writingId &&
    (activity.kind === "writing_model" || activity.kind === "writing_exercises")
  ) {
    return `writing:${activity.writingId}`;
  }
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
  if (typeof record.readingId === "string" && record.readingId.length > 0) {
    activity.readingId = record.readingId;
  }
  if (typeof record.listeningId === "string" && record.listeningId.length > 0) {
    activity.listeningId = record.listeningId;
  }
  if (typeof record.writingId === "string" && record.writingId.length > 0) {
    activity.writingId = record.writingId;
  }
  if (isContinueActivitySkill(record.skill)) {
    activity.skill = record.skill;
  }

  if (kind === "skill_hub" && !activity.skill) {
    return null;
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

  if (activity.kind === "skill_hub") {
    const skill = activity.skill;
    if (skill) {
      const relatedIndex = current.findIndex(
        (item) => item.kind !== "skill_hub" && activitySkill(item) === skill,
      );
      if (relatedIndex >= 0) {
        if (relatedIndex === 0) {
          return current;
        }
        const related = current[relatedIndex];
        const rest = current.filter((_, index) => index !== relatedIndex);
        const next = dedupeBySection([
          { ...related, updatedAt: new Date().toISOString() },
          ...rest,
        ]);
        writeAll(next);
        return next;
      }
    }
  }

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

  const skill = activitySkill(activity);
  const rest = current.filter((item) => {
    if (sameSection(item, activity)) {
      return false;
    }
    if (
      item.kind === "skill_hub" &&
      activity.kind !== "skill_hub" &&
      item.skill === skill
    ) {
      return false;
    }
    return true;
  });
  const next = dedupeBySection([nextItem, ...rest]);
  writeAll(next);
  return next;
}

export function clearContinueActivity(): void {
  writeAll([]);
}
