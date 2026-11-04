import { vocabularyCategory1 } from "./1";
import { vocabularyCategory2 } from "./2";
import { vocabularyCategory3 } from "./3";
import { vocabularyCategory4 } from "./4";
import { vocabularyCategory5 } from "./5";
import { vocabularyCategory6 } from "./6";
import { vocabularyCategory7 } from "./7";
import { vocabularyCategory8 } from "./8";
import { vocabularyCategory9 } from "./9";
import { vocabularyCategory11 } from "./11";
import { vocabularyCategory12 } from "./12";
import { vocabularyCategory13 } from "./13";
import { vocabularyCategory14 } from "./14";
import { vocabularyCategory15 } from "./15";
import { vocabularyCategory16 } from "./16";
import { vocabularyCategory17 } from "./17";
import { vocabularyCategory19 } from "./19";
import { vocabularyCategory20 } from "./20";
import { vocabularyCategory22 } from "./22";
import { vocabularyCategory23 } from "./23";
import { vocabularyCategory24 } from "./24";
import { vocabularyCategory25 } from "./25";
import { vocabularyCategory26 } from "./26";
import { vocabularyCategory27 } from "./27";
import type { VocabularyCategory } from "@/data/vocabulary/types";

export type {
  VocabularyCategory,
  VocabularyExample,
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
