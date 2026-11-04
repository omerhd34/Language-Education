import { vocabularyCategory1 } from "./a1/1";
import { vocabularyCategory2 } from "./a1/2";
import { vocabularyCategory3 } from "./a1/3";
import { vocabularyCategory4 } from "./a1/4";
import { vocabularyCategory5 } from "./a1/5";
import { vocabularyCategory6 } from "./a1/6";
import { vocabularyCategory7 } from "./a1/7";
import { vocabularyCategory8 } from "./a1/8";
import { vocabularyCategory9 } from "./a1/9";
import { vocabularyCategory11 } from "./a1/11";
import { vocabularyCategory12 } from "./a1/12";
import { vocabularyCategory13 } from "./a1/13";
import { vocabularyCategory14 } from "./a1/14";
import { vocabularyCategory15 } from "./a1/15";
import { vocabularyCategory16 } from "./a1/16";
import { vocabularyCategory17 } from "./a1/17";
import { vocabularyCategory19 } from "./a1/19";
import { vocabularyCategory20 } from "./a1/20";
import { vocabularyCategory21 } from "./a1/21";
import { vocabularyCategory22 } from "./a1/22";
import { vocabularyCategory23 } from "./a1/23";
import { vocabularyCategory24 } from "./a1/24";
import { vocabularyCategory25 } from "./a1/25";
import { vocabularyCategory26 } from "./a1/26";
import { vocabularyCategory27 } from "./a1/27";
import { vocabularyCategory1 as a2Category1 } from "./a2/1";
import { vocabularyCategory2 as a2Category2 } from "./a2/2";
import { vocabularyCategory3 as a2Category3 } from "./a2/3";
import { vocabularyCategory4 as a2Category4 } from "./a2/4";
import { vocabularyCategory5 as a2Category5 } from "./a2/5";
import { vocabularyCategory6 as a2Category6 } from "./a2/6";
import { vocabularyCategory7 as a2Category7 } from "./a2/7";
import { vocabularyCategory8 as a2Category8 } from "./a2/8";
import { vocabularyCategory9 as a2Category9 } from "./a2/9";
import { vocabularyCategory10 as a2Category10 } from "./a2/10";
import { vocabularyCategory11 as a2Category11 } from "./a2/11";
import { getVocabularyTitleEn } from "@/data/vocabulary/titlesEn";
import type {
  VocabularyCategory,
  VocabularyLevel,
} from "@/data/vocabulary/types";

export type {
  VocabularyCategory,
  VocabularyExample,
  VocabularyLevel,
  VocabularySimilarWord,
  VocabularyWord,
} from "@/data/vocabulary/types";

export const VOCABULARY_LEVEL_ORDER: VocabularyLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

function withLevel(
  category: VocabularyCategory,
  level: VocabularyLevel,
  options?: { prefixIds?: boolean },
): VocabularyCategory {
  const titleEn =
    category.titleEn ?? getVocabularyTitleEn(level, category.id) ?? category.title;

  if (!options?.prefixIds) {
    return { ...category, level, titleEn };
  }

  const prefix = level.toLowerCase();
  return {
    ...category,
    level,
    titleEn,
    id: `${prefix}-${category.id}`,
    words: category.words.map((word) => ({
      ...word,
      id: `${prefix}-${word.id}`,
    })),
  };
}

const a1Categories: VocabularyCategory[] = [
  vocabularyCategory1,
  vocabularyCategory2,
  vocabularyCategory3,
  vocabularyCategory4,
  vocabularyCategory5,
  vocabularyCategory6,
  vocabularyCategory7,
  vocabularyCategory8,
  vocabularyCategory9,
  vocabularyCategory11,
  vocabularyCategory12,
  vocabularyCategory13,
  vocabularyCategory14,
  vocabularyCategory15,
  vocabularyCategory16,
  vocabularyCategory17,
  vocabularyCategory19,
  vocabularyCategory20,
  vocabularyCategory21,
  vocabularyCategory22,
  vocabularyCategory23,
  vocabularyCategory24,
  vocabularyCategory25,
  vocabularyCategory26,
  vocabularyCategory27,
].map((category) => withLevel(category, "A1"));

const a2Categories: VocabularyCategory[] = [
  a2Category1,
  a2Category2,
  a2Category3,
  a2Category4,
  a2Category5,
  a2Category6,
  a2Category7,
  a2Category8,
  a2Category9,
  a2Category10,
  a2Category11,
].map((category) => withLevel(category, "A2", { prefixIds: true }));

export const vocabularyByLevel: Record<VocabularyLevel, VocabularyCategory[]> =
  {
    A1: a1Categories,
    A2: a2Categories,
    B1: [],
    B2: [],
    C1: [],
    C2: [],
  };

export const vocabularyCategories: VocabularyCategory[] =
  VOCABULARY_LEVEL_ORDER.flatMap((level) => vocabularyByLevel[level]);

export function getVocabularyCategoriesByLevel(
  level: VocabularyLevel,
): VocabularyCategory[] {
  return vocabularyByLevel[level];
}

export function getVocabularyCategoryById(
  categoryId: string,
): VocabularyCategory | undefined {
  return vocabularyCategories.find((category) => category.id === categoryId);
}

export function getVocabularyWordById(wordId: string) {
  for (const category of vocabularyCategories) {
    const word = category.words.find((item) => item.id === wordId);
    if (word) {
      return { category, word };
    }
  }
  return undefined;
}
