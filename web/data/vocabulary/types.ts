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
  words: VocabularyWord[];
};
