type StoredNotice = {
  id: string;
  type: string;
};

const QUIZ_READY_PREFIX = "quiz-ready-";

export function unseenQuizReadyWordIds(
  dueWordIds: string[],
  notifications: StoredNotice[],
): string[] {
  const seen = new Set<string>();

  for (const item of notifications) {
    if (item.type !== "quiz_ready" || !item.id.startsWith(QUIZ_READY_PREFIX)) {
      continue;
    }

    for (const id of item.id.slice(QUIZ_READY_PREFIX.length).split("|")) {
      if (id) {
        seen.add(id);
      }
    }
  }

  return dueWordIds.filter((id) => !seen.has(id));
}
