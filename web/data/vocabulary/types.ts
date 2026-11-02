export type VocabularyWord = {
  id: string;
  en: string;
  tr: string;
};

export type VocabularyCategory = {
  id: string;
  title: string;
  words: VocabularyWord[];
};
