import type { VocabularyWord } from "@/data/vocabulary";
import type {
  CrosswordClue,
  CrosswordExercise,
  FillBlankExercise,
  ListeningExercise,
  MultipleChoiceExercise,
  TopicExercise,
} from "@/data/topics/types";

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

function pickDistractors(
  words: VocabularyWord[],
  excludeId: string,
  count: number,
  field: "en" | "tr",
): string[] {
  const pool = shuffle(
    words.filter((word) => word.id !== excludeId).map((word) => word[field]),
  );
  return pool.slice(0, count);
}

export function generateMultipleChoiceExercises(
  words: VocabularyWord[],
  categoryId: string,
): MultipleChoiceExercise[] {
  if (words.length < 2) {
    return [];
  }

  return words.map((word) => {
    const distractors = pickDistractors(words, word.id, 3, "en");
    while (distractors.length < 3) {
      distractors.push(`Option ${distractors.length + 1}`);
    }

    const options = shuffle([word.en, ...distractors.slice(0, 3)]);
    const correctIndex = options.indexOf(word.en);

    return {
      id: `vocab-mc-${categoryId}-${word.id}`,
      subtopicId: categoryId,
      type: "multiple_choice",
      prompt: `"${word.tr}" kelimesinin İngilizcesi nedir?`,
      options,
      correctIndex,
    };
  });
}

export function generateFillBlankExercises(
  words: VocabularyWord[],
  categoryId: string,
): FillBlankExercise[] {
  return words.map((word) => ({
    id: `vocab-fb-${categoryId}-${word.id}`,
    subtopicId: categoryId,
    type: "fill_blank",
    prompt: `"${word.tr}" kelimesinin İngilizcesi nedir?`,
    answer: word.en,
    acceptedAnswers: [word.en.toLowerCase()],
  }));
}

export function generateListeningExercises(
  words: VocabularyWord[],
  categoryId: string,
): ListeningExercise[] {
  if (words.length < 2) {
    return [];
  }

  return words.map((word) => {
    const englishDistractors = pickDistractors(words, word.id, 3, "en");
    while (englishDistractors.length < 3) {
      englishDistractors.push(`Option ${englishDistractors.length + 1}`);
    }

    const turkishDistractors = pickDistractors(words, word.id, 3, "tr");
    while (turkishDistractors.length < 3) {
      turkishDistractors.push(`Seçenek ${turkishDistractors.length + 1}`);
    }

    const englishOptions = shuffle([
      word.en,
      ...englishDistractors.slice(0, 3),
    ]);
    const turkishOptions = shuffle([
      word.tr,
      ...turkishDistractors.slice(0, 3),
    ]);

    return {
      id: `vocab-listen-${categoryId}-${word.id}`,
      subtopicId: categoryId,
      type: "listening",
      prompt: "Dinlediğin kelimenin İngilizce ve Türkçe karşılığını seç.",
      speakText: word.en,
      englishOptions,
      englishCorrectIndex: englishOptions.indexOf(word.en),
      turkishOptions,
      turkishCorrectIndex: turkishOptions.indexOf(word.tr),
    };
  });
}

type PlacedWord = {
  word: VocabularyWord;
  row: number;
  col: number;
  direction: "across" | "down";
  number: number;
};

function normalizeCrosswordAnswer(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function canPlace(
  grid: Array<Array<string | null>>,
  answer: string,
  row: number,
  col: number,
  direction: "across" | "down",
  requireOverlap: boolean,
): boolean {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let overlaps = 0;

  for (let i = 0; i < answer.length; i += 1) {
    const r = direction === "across" ? row : row + i;
    const c = direction === "across" ? col + i : col;
    if (r < 0 || c < 0 || r >= rows || c >= cols) {
      return false;
    }

    const existing = grid[r]?.[c];
    const letter = answer[i]!;
    if (existing && existing !== letter) {
      return false;
    }
    if (existing === letter) {
      overlaps += 1;
    }
  }

  return requireOverlap ? overlaps > 0 : true;
}

function placeWord(
  grid: Array<Array<string | null>>,
  answer: string,
  row: number,
  col: number,
  direction: "across" | "down",
) {
  for (let i = 0; i < answer.length; i += 1) {
    const r = direction === "across" ? row : row + i;
    const c = direction === "across" ? col + i : col;
    grid[r]![c] = answer[i]!;
  }
}

export function generateCrosswordExercise(
  words: VocabularyWord[],
  categoryId: string,
): CrosswordExercise | null {
  const candidates = words
    .map((word) => ({
      word,
      answer: normalizeCrosswordAnswer(word.en),
    }))
    .filter((item) => item.answer.length >= 3)
    .sort((a, b) => b.answer.length - a.answer.length)
    .slice(0, 8);

  if (candidates.length < 3) {
    return null;
  }

  const size = Math.min(
    16,
    Math.max(10, Math.max(...candidates.map((item) => item.answer.length)) + 4),
  );
  const grid: Array<Array<string | null>> = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );

  const placed: PlacedWord[] = [];
  const first = candidates[0]!;
  const startCol = Math.max(0, Math.floor((size - first.answer.length) / 2));
  const startRow = Math.floor(size / 2);
  placeWord(grid, first.answer, startRow, startCol, "across");
  placed.push({
    word: first.word,
    row: startRow,
    col: startCol,
    direction: "across",
    number: 1,
  });

  let nextNumber = 2;

  for (const candidate of candidates.slice(1)) {
    let placedWord: PlacedWord | null = null;

    outer: for (
      let letterIndex = 0;
      letterIndex < candidate.answer.length;
      letterIndex += 1
    ) {
      const letter = candidate.answer[letterIndex]!;

      for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
          if (grid[row]?.[col] !== letter) {
            continue;
          }

          for (const direction of ["down", "across"] as const) {
            const startRowPos =
              direction === "across" ? row : row - letterIndex;
            const startColPos =
              direction === "across" ? col - letterIndex : col;

            if (
              !canPlace(
                grid,
                candidate.answer,
                startRowPos,
                startColPos,
                direction,
                true,
              )
            ) {
              continue;
            }

            placeWord(
              grid,
              candidate.answer,
              startRowPos,
              startColPos,
              direction,
            );
            placedWord = {
              word: candidate.word,
              row: startRowPos,
              col: startColPos,
              direction,
              number: nextNumber,
            };
            nextNumber += 1;
            break outer;
          }
        }
      }
    }

    if (placedWord) {
      placed.push(placedWord);
    }
  }

  if (placed.length < 3) {
    return null;
  }

  // Trim empty borders.
  let minRow = size;
  let maxRow = 0;
  let minCol = size;
  let maxCol = 0;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row]?.[col]) {
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        minCol = Math.min(minCol, col);
        maxCol = Math.max(maxCol, col);
      }
    }
  }

  const clues: CrosswordClue[] = placed.map((item) => ({
    number: item.number,
    direction: item.direction,
    text: item.word.tr,
    answer: normalizeCrosswordAnswer(item.word.en),
    row: item.row - minRow,
    col: item.col - minCol,
  }));

  return {
    id: `vocab-cw-${categoryId}`,
    subtopicId: categoryId,
    type: "crossword",
    rows: maxRow - minRow + 1,
    cols: maxCol - minCol + 1,
    clues,
  };
}

export function generateVocabularyExercises(
  words: VocabularyWord[],
  categoryId: string,
): TopicExercise[] {
  const exercises: TopicExercise[] = [
    ...generateMultipleChoiceExercises(words, categoryId),
    ...generateFillBlankExercises(words, categoryId),
    ...generateListeningExercises(words, categoryId),
  ];

  const crossword = generateCrosswordExercise(words, categoryId);
  if (crossword) {
    exercises.push(crossword);
  }

  return exercises;
}
