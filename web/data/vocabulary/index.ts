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
import type { VocabularyCategory } from "@/data/vocabulary/types";

export type {
  VocabularyCategory,
  VocabularyExample,
  VocabularySimilarWord,
  VocabularyWord,
} from "@/data/vocabulary/types";

export const vocabularyCategories: VocabularyCategory[] = [
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
];

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
