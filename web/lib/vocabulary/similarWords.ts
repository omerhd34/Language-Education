import type { VocabularyWord } from "@/data/vocabulary";

const MAX_SIMILAR = 3;

export type SimilarWordItem = {
  label: string;
  targetWordId: string | null;
};

export function getVocabularyWordElementId(wordId: string): string {
  return `vocab-word-${wordId}`;
}

function findCategoryWordByEnglish(
  categoryWords: VocabularyWord[],
  label: string,
  excludeId: string,
): VocabularyWord | undefined {
  const normalized = label.trim().toLocaleLowerCase("en-US");
  return categoryWords.find(
    (item) =>
      item.id !== excludeId &&
      item.en.trim().toLocaleLowerCase("en-US") === normalized,
  );
}

export function getSimilarWords(
  word: VocabularyWord,
  categoryWords: VocabularyWord[],
  limit = MAX_SIMILAR,
): SimilarWordItem[] {
  if (word.similar && word.similar.length > 0) {
    return word.similar.slice(0, limit).map((label) => {
      const match = findCategoryWordByEnglish(categoryWords, label, word.id);
      return {
        label,
        targetWordId: match?.id ?? null,
      };
    });
  }

  return categoryWords
    .filter((item) => item.id !== word.id)
    .slice(0, limit)
    .map((item) => ({
      label: item.en,
      targetWordId: item.id,
    }));
}

export function scrollToVocabularyWord(wordId: string): void {
  const element = document.getElementById(getVocabularyWordElementId(wordId));
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  element.classList.add("ring-2", "ring-sky-500/50");
  window.setTimeout(() => {
    element.classList.remove("ring-2", "ring-sky-500/50");
  }, 1200);
}
