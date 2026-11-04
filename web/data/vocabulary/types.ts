export type VocabularyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type VocabularyExample = {
  en: string;
  tr: string;
};

export type VocabularySimilarWord = {
  en: string;
  tr: string;
  example: VocabularyExample;
};

export type VocabularyWord = {
  id: string;
  en: string;
  tr: string;
  image?: string;
  similar?: VocabularySimilarWord[];
  examples: [VocabularyExample, VocabularyExample, VocabularyExample];
};

export type VocabularyCategory = {
  id: string;
  title: string;
  titleEn?: string;
  level?: VocabularyLevel;
  words: VocabularyWord[];
};
