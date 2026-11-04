import {
  vocabularyCategories,
  type VocabularyCategory,
} from "@/data/vocabulary";

export const ACTIVE_VOCABULARY_WINDOW = 3;

export function getVocabularyCategoryIndex(categoryId: string): number {
  return vocabularyCategories.findIndex(
    (category) => category.id === categoryId,
  );
}

export function getVocabularyCategoryDisplayIndex(categoryId: string): number {
  return getVocabularyCategoryIndex(categoryId) + 1;
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

export function countCompletedVocabularyCategories(
  knownWordIds: ReadonlySet<string>,
): number {
  return vocabularyCategories.reduce((count, category) => {
    return isVocabularyCategoryComplete(category, knownWordIds)
      ? count + 1
      : count;
  }, 0);
}

export function getUnlockedVocabularyCategoryCount(
  knownWordIds: ReadonlySet<string>,
): number {
  const completed = countCompletedVocabularyCategories(knownWordIds);
  return Math.min(
    vocabularyCategories.length,
    ACTIVE_VOCABULARY_WINDOW + completed,
  );
}

export function canAccessVocabularyCategory(
  categoryId: string,
  knownWordIds: ReadonlySet<string>,
): boolean {
  const index = getVocabularyCategoryIndex(categoryId);
  if (index < 0) {
    return false;
  }
  return index < getUnlockedVocabularyCategoryCount(knownWordIds);
}
