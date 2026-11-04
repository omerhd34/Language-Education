export type VocabularyExample = {
  en: string;
  tr: string;
};

export type VocabularyWord = {
  id: string;
  en: string;
  tr: string;
  image?: string;
  similar?: string[];
  examples: [VocabularyExample, VocabularyExample, VocabularyExample];
};

export type VocabularyCategory = {
  id: string;
  title: string;
  words: VocabularyWord[];
};
