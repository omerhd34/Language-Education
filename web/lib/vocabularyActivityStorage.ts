export const VOCABULARY_ACTIVITY_EVENT = "pylmor:vocabulary-activity";

const STORAGE_KEY = "pylmor-vocabulary-activity";

type VocabularyActivityMap = Record<string, string[]>;

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function emitChanged(): void {
  if (!canUseDom()) {
    return;
  }
  window.dispatchEvent(new Event(VOCABULARY_ACTIVITY_EVENT));
}

function readAll(): VocabularyActivityMap {
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

    const map: VocabularyActivityMap = {};
    for (const [categoryId, value] of Object.entries(parsed)) {
      if (!Array.isArray(value)) {
        continue;
      }
      const ids = value.filter(
        (item): item is string => typeof item === "string",
      );
      if (ids.length > 0) {
        map[categoryId] = ids;
      }
    }
    return map;
  } catch {
    return {};
  }
}

function writeAll(map: VocabularyActivityMap): void {
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

export function readVocabularyActivityIds(
  categoryId: string,
): ReadonlySet<string> {
  return new Set(readAll()[categoryId] ?? []);
}

export function markVocabularyActivities(
  categoryId: string,
  actionIds: readonly string[],
): void {
  if (actionIds.length === 0) {
    return;
  }

  const all = readAll();
  const current = new Set(all[categoryId] ?? []);
  let changed = false;
  for (const actionId of actionIds) {
    if (!current.has(actionId)) {
      current.add(actionId);
      changed = true;
    }
  }
  if (!changed) {
    return;
  }

  writeAll({
    ...all,
    [categoryId]: Array.from(current),
  });
}

export function markVocabularyActivity(
  categoryId: string,
  actionId: string,
): void {
  markVocabularyActivities(categoryId, [actionId]);
}

export function clearVocabularyActivityStorage(): void {
  if (!canUseDom()) {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  emitChanged();
}
