import type { VocabularyExample, VocabularyWord } from "@/data/vocabulary";

const MAX_SIMILAR = 3;

export type SimilarWordItem = {
  label: string;
  labelTr: string;
  targetWordId: string | null;
  example: VocabularyExample;
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
  if (!word.similar || word.similar.length === 0) {
    return [];
  }

  return word.similar.slice(0, limit).map((item) => {
    const match = findCategoryWordByEnglish(categoryWords, item.en, word.id);
    return {
      label: item.en,
      labelTr: item.tr,
      targetWordId: match?.id ?? null,
      example: item.example,
    };
  });
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
