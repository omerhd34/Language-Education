import type {
  CrosswordClue,
  CrosswordDirection,
  CrosswordExercise,
} from "@/data/topics/types";

export type CrosswordCandidate = {
  answer: string;
  text: string;
};

type PlacedWord = {
  answer: string;
  text: string;
  row: number;
  col: number;
  direction: CrosswordDirection;
  number: number;
};

function normalizeAnswer(value: string): string {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

function cellInBounds(
  grid: Array<Array<string | null>>,
  row: number,
  col: number,
): boolean {
  return (
    row >= 0 && col >= 0 && row < grid.length && col < (grid[0]?.length ?? 0)
  );
}

function canPlace(
  grid: Array<Array<string | null>>,
  answer: string,
  row: number,
  col: number,
  direction: CrosswordDirection,
  requireOverlap: boolean,
): boolean {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let overlaps = 0;

  const beforeRow = direction === "across" ? row : row - 1;
  const beforeCol = direction === "across" ? col - 1 : col;
  if (
    cellInBounds(grid, beforeRow, beforeCol) &&
    grid[beforeRow]?.[beforeCol]
  ) {
    return false;
  }

  const afterRow = direction === "across" ? row : row + answer.length;
  const afterCol = direction === "across" ? col + answer.length : col;
  if (cellInBounds(grid, afterRow, afterCol) && grid[afterRow]?.[afterCol]) {
    return false;
  }

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
    } else {
      if (direction === "down") {
        if (
          (cellInBounds(grid, r, c - 1) && grid[r]?.[c - 1]) ||
          (cellInBounds(grid, r, c + 1) && grid[r]?.[c + 1])
        ) {
          return false;
        }
      } else if (
        (cellInBounds(grid, r - 1, c) && grid[r - 1]?.[c]) ||
        (cellInBounds(grid, r + 1, c) && grid[r + 1]?.[c])
      ) {
        return false;
      }
    }
  }

  return requireOverlap ? overlaps > 0 : true;
}

function placeWord(
  grid: Array<Array<string | null>>,
  answer: string,
  row: number,
  col: number,
  direction: CrosswordDirection,
) {
  for (let i = 0; i < answer.length; i += 1) {
    const r = direction === "across" ? row : row + i;
    const c = direction === "across" ? col + i : col;
    grid[r]![c] = answer[i]!;
  }
}

export function buildCrosswordFromCandidates(
  candidates: CrosswordCandidate[],
  options: {
    id: string;
    subtopicId: string;
    targetClues: number;
    minClues?: number;
  },
): CrosswordExercise | null {
  const normalized = candidates
    .map((item) => ({
      answer: normalizeAnswer(item.answer),
      text: item.text.trim(),
    }))
    .filter((item) => item.answer.length >= 2 && item.text.length > 0);

  const unique: CrosswordCandidate[] = [];
  const seen = new Set<string>();
  for (const item of normalized) {
    if (seen.has(item.answer)) {
      continue;
    }
    seen.add(item.answer);
    unique.push(item);
  }

  const sorted = [...unique].sort((a, b) => b.answer.length - a.answer.length);
  if (sorted.length === 0) {
    return null;
  }

  const longest = Math.max(...sorted.map((item) => item.answer.length));
  const size = Math.min(
    22,
    Math.max(longest + 3, 14 + Math.ceil(options.targetClues / 4)),
  );
  const grid: Array<Array<string | null>> = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );

  const placed: PlacedWord[] = [];
  const first = sorted[0]!;
  const startCol = Math.max(0, Math.floor((size - first.answer.length) / 2));
  const startRow = Math.floor(size / 2);
  placeWord(grid, first.answer, startRow, startCol, "across");
  placed.push({
    answer: first.answer,
    text: first.text,
    row: startRow,
    col: startCol,
    direction: "across",
    number: 1,
  });

  let nextNumber = 2;
  const target = Math.min(options.targetClues, sorted.length);
  const remaining = sorted.slice(1);

  function tryPlaceCandidate(
    candidate: CrosswordCandidate,
    requireOverlap: boolean,
  ): PlacedWord | null {
    for (
      let letterIndex = 0;
      letterIndex < candidate.answer.length;
      letterIndex += 1
    ) {
      const letter = candidate.answer[letterIndex]!;

      for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
          if (requireOverlap && grid[row]?.[col] !== letter) {
            continue;
          }
          if (!requireOverlap && grid[row]?.[col]) {
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
                requireOverlap,
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
            return {
              answer: candidate.answer,
              text: candidate.text,
              row: startRowPos,
              col: startColPos,
              direction,
              number: nextNumber,
            };
          }
        }
      }
    }
    return null;
  }

  const unused: CrosswordCandidate[] = [];
  for (const candidate of remaining) {
    if (placed.length >= target) {
      break;
    }
    const placedWord = tryPlaceCandidate(candidate, true);
    if (placedWord) {
      placed.push(placedWord);
      nextNumber += 1;
    } else {
      unused.push(candidate);
    }
  }

  for (const candidate of unused) {
    if (placed.length >= target) {
      break;
    }
    const placedWord = tryPlaceCandidate(candidate, false);
    if (placedWord) {
      placed.push(placedWord);
      nextNumber += 1;
    }
  }

  const minClues = options.minClues ?? Math.min(3, options.targetClues);
  if (placed.length < minClues) {
    return null;
  }

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

  placed.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    if (a.col !== b.col) return a.col - b.col;
    if (a.direction === b.direction) return 0;
    return a.direction === "across" ? -1 : 1;
  });
  placed.forEach((item, index) => {
    item.number = index + 1;
  });

  const clues: CrosswordClue[] = placed.map((item) => ({
    number: item.number,
    direction: item.direction,
    text: item.text,
    answer: item.answer,
    row: item.row - minRow,
    col: item.col - minCol,
  }));

  return {
    id: options.id,
    subtopicId: options.subtopicId,
    type: "crossword",
    rows: maxRow - minRow + 1,
    cols: maxCol - minCol + 1,
    clues,
  };
}
