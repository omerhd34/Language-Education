import type { VocabularyCategory, VocabularyWord } from "@/data/vocabulary";
import { getSimilarWords } from "@/lib/vocabulary/similarWords";

export type VocabularyStatusActivity = "known" | "learn" | "relearn";

export function vocabularyListenActivityId(
  wordId: string,
  target: string,
): string {
  return `${wordId}:listen:${target}`;
}

export function vocabularyStatusActivityId(
  wordId: string,
  activity: VocabularyStatusActivity,
): string {
  return `${wordId}:status:${activity}`;
}

export function listWordActivityIds(
  word: VocabularyWord,
  categoryWords: VocabularyWord[],
): string[] {
  const ids = [vocabularyListenActivityId(word.id, "word")];

  word.examples.forEach((_, index) => {
    ids.push(vocabularyListenActivityId(word.id, `example:${index}`));
  });

  getSimilarWords(word, categoryWords).forEach((_, index) => {
    ids.push(vocabularyListenActivityId(word.id, `similar:${index}`));
    ids.push(vocabularyListenActivityId(word.id, `similar-example:${index}`));
  });

  ids.push(vocabularyStatusActivityId(word.id, "known"));
  ids.push(vocabularyStatusActivityId(word.id, "relearn"));
  return ids;
}

export function countVocabularyActivities(
  category: VocabularyCategory,
  done: ReadonlySet<string>,
  knownWordIds: ReadonlySet<string>,
): { completed: number; total: number } {
  let total = 0;
  let completed = 0;

  for (const word of category.words) {
    for (const actionId of listWordActivityIds(word, category.words)) {
      total += 1;
      const known =
        actionId === vocabularyStatusActivityId(word.id, "known") &&
        knownWordIds.has(word.id);
      if (done.has(actionId) || known) {
        completed += 1;
      }
    }
  }

  return { completed, total };
}
