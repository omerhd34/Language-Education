import {
  VOCABULARY_LEVEL_ORDER,
  getVocabularyCategoriesByLevel,
  vocabularyCategories,
  type VocabularyCategory,
  type VocabularyLevel,
} from "@/data/vocabulary";

export const ACTIVE_VOCABULARY_WINDOW = 3;

export function getVocabularyCategoryLevel(
  categoryId: string,
): VocabularyLevel | null {
  const category = vocabularyCategories.find((item) => item.id === categoryId);
  return category?.level ?? null;
}

export function getVocabularyCategoriesForLevel(
  level: VocabularyLevel,
): VocabularyCategory[] {
  return getVocabularyCategoriesByLevel(level);
}

export function getVocabularyCategoryIndexInLevel(categoryId: string): number {
  const level = getVocabularyCategoryLevel(categoryId);
  if (!level) {
    return -1;
  }
  return getVocabularyCategoriesForLevel(level).findIndex(
    (category) => category.id === categoryId,
  );
}

export function getVocabularyCategoryDisplayIndex(categoryId: string): number {
  return getVocabularyCategoryIndexInLevel(categoryId) + 1;
}

export function isVocabularyCategoryComplete(
  category: VocabularyCategory,
  knownWordIds: ReadonlySet<string>,
): boolean {
  if (category.words.length === 0) {
    return true;
  }
  return category.words.every((word) => knownWordIds.has(word.id));
}

export function countCompletedVocabularyCategoriesInLevel(
  level: VocabularyLevel,
  knownWordIds: ReadonlySet<string>,
): number {
  return getVocabularyCategoriesForLevel(level).reduce((count, category) => {
    return isVocabularyCategoryComplete(category, knownWordIds)
      ? count + 1
      : count;
  }, 0);
}

export function isVocabularyLevelComplete(
  level: VocabularyLevel,
  knownWordIds: ReadonlySet<string>,
): boolean {
  const categories = getVocabularyCategoriesForLevel(level);
  if (categories.length === 0) {
    return false;
  }
  return categories.every((category) =>
    isVocabularyCategoryComplete(category, knownWordIds),
  );
}

export function getPreviousVocabularyLevel(
  level: VocabularyLevel,
): VocabularyLevel | null {
  const index = VOCABULARY_LEVEL_ORDER.indexOf(level);
  if (index <= 0) {
    return null;
  }
  return VOCABULARY_LEVEL_ORDER[index - 1] ?? null;
}

export function getRequiredVocabularyLevelToUnlock(
  level: VocabularyLevel,
): VocabularyLevel | null {
  return getPreviousVocabularyLevel(level);
}

export function canAccessVocabularyLevel(
  level: VocabularyLevel,
  knownWordIds: ReadonlySet<string>,
): boolean {
  const previous = getPreviousVocabularyLevel(level);
  if (!previous) {
    return true;
  }
  return isVocabularyLevelComplete(previous, knownWordIds);
}

export function getUnlockedVocabularyCategoryCountInLevel(
  level: VocabularyLevel,
  knownWordIds: ReadonlySet<string>,
): number {
  if (!canAccessVocabularyLevel(level, knownWordIds)) {
    return 0;
  }

  const categories = getVocabularyCategoriesForLevel(level);
  const completed = countCompletedVocabularyCategoriesInLevel(
    level,
    knownWordIds,
  );
  return Math.min(categories.length, ACTIVE_VOCABULARY_WINDOW + completed);
}

export function canAccessVocabularyCategory(
  categoryId: string,
  knownWordIds: ReadonlySet<string>,
): boolean {
  const level = getVocabularyCategoryLevel(categoryId);
  if (!level) {
    return false;
  }

  const index = getVocabularyCategoryIndexInLevel(categoryId);
  if (index < 0) {
    return false;
  }

  return index < getUnlockedVocabularyCategoryCountInLevel(level, knownWordIds);
}
