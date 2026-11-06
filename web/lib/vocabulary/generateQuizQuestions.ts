export type VocabularyQuizWordInput = {
  id: string;
  en: string;
  tr: string;
  passed?: {
    multiple_choice: boolean;
    fill_blank: boolean;
    listening: boolean;
  };
};

export type VocabularyQuizType = "multiple_choice" | "fill_blank" | "listening";

export type VocabularyQuizItem = {
  id: string;
  type: VocabularyQuizType;
  wordId: string;
  prompt: string;
  speakText?: string;
  options?: string[];
  inputMode?: "choice" | "text";
  answerValue: string;
  expectedDisplay: string;
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j]!;
    copy[j] = tmp!;
  }
  return copy;
}

function distractors(
  words: VocabularyQuizWordInput[],
  excludeId: string,
  field: "en" | "tr",
  count: number,
): string[] {
  const pool = shuffle(
    words.filter((word) => word.id !== excludeId).map((word) => word[field]),
  );
  const picked = pool.slice(0, count);
  while (picked.length < count) {
    picked.push(`Seçenek ${picked.length + 1}`);
  }
  return picked;
}

export function generateMixedQuizItems(
  words: VocabularyQuizWordInput[],
): VocabularyQuizItem[] {
  if (words.length === 0) {
    return [];
  }

  const pool = [
    ...generateQuizItemsByType(words, "multiple_choice"),
    ...generateQuizItemsByType(words, "fill_blank"),
    ...generateQuizItemsByType(words, "listening"),
  ];

  return shuffle(pool);
}

export function generateQuizItemsByType(
  words: VocabularyQuizWordInput[],
  type: VocabularyQuizType,
): VocabularyQuizItem[] {
  if (words.length === 0) {
    return [];
  }

  if (type === "multiple_choice") {
    return words.map((word) => {
      const options = shuffle([
        word.en,
        ...distractors(words, word.id, "en", 3),
      ]);
      return {
        id: `mc-${word.id}`,
        type,
        wordId: word.id,
        prompt: `"${word.tr}" kelimesinin İngilizcesi nedir?`,
        options,
        inputMode: "choice" as const,
        answerValue: word.en,
        expectedDisplay: word.en,
      };
    });
  }

  if (type === "fill_blank") {
    return words.map((word) => ({
      id: `fb-${word.id}`,
      type,
      wordId: word.id,
      prompt: `"${word.tr}" kelimesinin İngilizcesi nedir?`,
      inputMode: "text" as const,
      answerValue: word.en,
      expectedDisplay: word.en,
    }));
  }

  return words.map((word) => {
    const options = shuffle([word.tr, ...distractors(words, word.id, "tr", 3)]);
    return {
      id: `listen-${word.id}`,
      type,
      wordId: word.id,
      prompt: "Dinlediğin kelimenin Türkçesi nedir?",
      speakText: word.en,
      options,
      inputMode: "choice" as const,
      answerValue: word.tr,
      expectedDisplay: word.tr,
    };
  });
}

export function countQuizTypes(words: VocabularyQuizWordInput[]) {
  return {
    multiple_choice: words.filter(
      (word) => !word.passed || !word.passed.multiple_choice,
    ).length,
    fill_blank: words.filter((word) => !word.passed || !word.passed.fill_blank)
      .length,
    listening: words.filter((word) => !word.passed || !word.passed.listening)
      .length,
  };
}

export function wordsForQuizType(
  words: VocabularyQuizWordInput[],
  type: VocabularyQuizType,
): VocabularyQuizWordInput[] {
  return words.filter((word) => !word.passed || !word.passed[type]);
}
