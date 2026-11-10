"use client";

import { useTranslations } from "next-intl";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import type {
  CrosswordDirection,
  CrosswordExercise,
} from "@/data/topics/types";
import {
  clearCrosswordDraft,
  readCrosswordDraft,
  writeCrosswordDraft,
} from "@/lib/exerciseDraftStorage";
import { isCrosswordClueSolved } from "@/lib/exerciseTypeProgress";
import { cn } from "@/lib/utils";

type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type CrosswordExerciseViewProps = {
  exercises: CrosswordExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  onProgress?: (percent: number) => void;
  draftKey?: string | null;
  progressShare?: number;
};

type CellStart = {
  number: number;
  direction: CrosswordDirection;
};

type GridCell = {
  letter: string;
  starts: CellStart[];
};

function buildSolutionGrid(exercise: CrosswordExercise) {
  const grid: Array<Array<GridCell | null>> = Array.from(
    { length: exercise.rows },
    () => Array.from({ length: exercise.cols }, () => null),
  );

  for (const clue of exercise.clues) {
    const answer = clue.answer.toUpperCase();

    for (let i = 0; i < answer.length; i += 1) {
      const row = clue.direction === "across" ? clue.row : clue.row + i;
      const col = clue.direction === "across" ? clue.col + i : clue.col;
      const existing = grid[row]?.[col];
      const letter = answer[i];

      if (existing && existing.letter !== letter) {
        throw new Error(
          `Crossword conflict at ${row},${col}: ${existing.letter} vs ${letter}`,
        );
      }

      const starts = existing?.starts ? [...existing.starts] : [];
      if (
        i === 0 &&
        !starts.some(
          (start) =>
            start.number === clue.number && start.direction === clue.direction,
        )
      ) {
        starts.push({ number: clue.number, direction: clue.direction });
        starts.sort((a, b) => a.number - b.number);
      }

      grid[row][col] = { letter, starts };
    }
  }

  return grid;
}

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function normalizeCrosswordCellInput(value: string): string {
  const chars = [...value];
  const last = chars.at(-1);
  if (!last) {
    return "";
  }

  if (/[a-zA-Z]/.test(last)) {
    return last.toUpperCase();
  }

  if (last === "ı" || last === "İ") {
    return "I";
  }

  return "";
}

function stepCell(
  row: number,
  col: number,
  direction: CrosswordDirection,
  delta: 1 | -1,
) {
  return {
    row: direction === "down" ? row + delta : row,
    col: direction === "across" ? col + delta : col,
  };
}

function getClueCellKeys(clue: CrosswordExercise["clues"][number]): string[] {
  const answer = clue.answer.toUpperCase();
  return Array.from({ length: answer.length }, (_, index) => {
    const row = clue.direction === "across" ? clue.row : clue.row + index;
    const col = clue.direction === "across" ? clue.col + index : clue.col;
    return cellKey(row, col);
  });
}

function isClueFullyTyped(
  clue: CrosswordExercise["clues"][number],
  values: Record<string, string>,
): boolean {
  return getClueCellKeys(clue).every((key) => (values[key] ?? "").length > 0);
}

function isClueAnswerCorrect(
  clue: CrosswordExercise["clues"][number],
  values: Record<string, string>,
): boolean {
  const answer = clue.answer.toUpperCase();
  return getClueCellKeys(clue).every(
    (key, index) => (values[key] ?? "").toUpperCase() === answer[index],
  );
}

function isGridCorrect(
  exercise: CrosswordExercise,
  solution: Array<Array<GridCell | null>>,
  values: Record<string, string>,
): boolean {
  for (let row = 0; row < exercise.rows; row += 1) {
    for (let col = 0; col < exercise.cols; col += 1) {
      const cell = solution[row]?.[col];
      if (!cell) {
        continue;
      }
      if ((values[cellKey(row, col)] ?? "").toUpperCase() !== cell.letter) {
        return false;
      }
    }
  }
  return true;
}

export function CrosswordExerciseView({
  exercises,
  onComplete,
  onRestart,
  onProgress,
  draftKey,
  progressShare = 100,
}: CrosswordExerciseViewProps) {
  const t = useTranslations("Topic");
  const storageKey =
    draftKey === null
      ? null
      : (draftKey ?? `crossword:${exercises.map((item) => item.id).join(",")}`);
  const exerciseIds = exercises.map((item) => item.id).join("\u0000");
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [ready, setReady] = useState(draftKey === null);
  const exercise = exercises[puzzleIndex];
  const solution = useMemo(
    () => (exercise ? buildSolutionGrid(exercise) : null),
    [exercise],
  );
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const directionRef = useRef<CrosswordDirection>("across");
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const restoredKeyRef = useRef<string | null>(null);
  const progressPercent = useMemo(() => {
    if (!exercise || finished) {
      return finished ? progressShare : 0;
    }
    const totalClues = exercises.reduce(
      (sum, item) => sum + item.clues.length,
      0,
    );
    const solvedBefore = exercises
      .slice(0, puzzleIndex)
      .reduce((sum, item) => sum + item.clues.length, 0);
    const solvedClues =
      solvedBefore +
      exercise.clues.filter((clue) => isCrosswordClueSolved(clue, values))
        .length;
    if (totalClues === 0) {
      return 0;
    }
    return Math.round((solvedClues / totalClues) * progressShare);
  }, [exercise, exercises, finished, progressShare, puzzleIndex, values]);

  useEffect(() => {
    if (!ready || !exercise) {
      return;
    }
    onProgress?.(progressPercent);
  }, [exercise, onProgress, progressPercent, ready]);

  useEffect(() => {
    if (storageKey === null) {
      setReady(true);
      return;
    }

    if (restoredKeyRef.current === storageKey) {
      return;
    }
    restoredKeyRef.current = storageKey;

    const draft = readCrosswordDraft(storageKey);
    const matchIndex = draft
      ? exercises.findIndex((item) => item.id === draft.exerciseId)
      : -1;

    if (draft && matchIndex >= 0) {
      const matched = exercises[matchIndex];
      let correct = false;
      try {
        correct =
          draft.checked &&
          isGridCorrect(matched, buildSolutionGrid(matched), draft.values);
      } catch {
        correct = false;
      }
      setPuzzleIndex(matchIndex);
      setSolvedCount(Math.min(draft.solvedCount, exercises.length));
      setFinished(draft.finished);
      setChecked(draft.checked);
      setIsCorrect(correct);
      setValues(draft.values);
      setResultOpen(false);
    }

    setReady(true);
  }, [exerciseIds, exercises, storageKey]);

  useEffect(() => {
    if (!ready || !storageKey || !exercise) {
      return;
    }
    if (restoredKeyRef.current !== storageKey) {
      return;
    }

    writeCrosswordDraft(storageKey, {
      exerciseId: exercise.id,
      puzzleIndex,
      solvedCount,
      finished,
      checked,
      values,
    });
  }, [
    checked,
    exercise,
    finished,
    puzzleIndex,
    ready,
    solvedCount,
    storageKey,
    values,
  ]);

  const cluesByCell = useMemo(() => {
    const map = new Map<string, CrosswordExercise["clues"]>();
    if (!exercise) return map;
    for (const clue of exercise.clues) {
      for (const key of getClueCellKeys(clue)) {
        const list = map.get(key) ?? [];
        list.push(clue);
        map.set(key, list);
      }
    }
    return map;
  }, [exercise]);

  if (!ready) {
    return null;
  }

  if (!exercise || !solution) {
    return <p className="page-subtitle mt-0">{t("noExercisesForType")}</p>;
  }

  const clues = [...exercise.clues].sort((a, b) => a.number - b.number);
  const percent = progressPercent;
  const clueColumnCount = 3;
  const clueRowCount = Math.ceil(clues.length / clueColumnCount);
  const isLastPuzzle = puzzleIndex >= exercises.length - 1;
  const continueLabel = isLastPuzzle ? t("seeResult") : t("next");

  function setDirection(next: CrosswordDirection) {
    directionRef.current = next;
  }

  function focusCell(row: number, col: number) {
    const input = inputRefs.current[cellKey(row, col)];
    if (!input) {
      return;
    }
    input.focus();
    input.select();
  }

  function moveFocus(
    row: number,
    col: number,
    activeDirection: CrosswordDirection,
    delta: 1 | -1,
  ) {
    if (!solution) {
      return;
    }

    const next = stepCell(row, col, activeDirection, delta);
    if (solution[next.row]?.[next.col]) {
      focusCell(next.row, next.col);
    }
  }

  function resolveDirection(
    cell: GridCell,
    current: CrosswordDirection,
    cellClues: CrosswordExercise["clues"],
  ) {
    const throughDirections = new Set(cellClues.map((clue) => clue.direction));
    if (throughDirections.has(current)) {
      return current;
    }
    if (throughDirections.size === 1 && cellClues[0]) {
      return cellClues[0].direction;
    }

    const startDirections = cell.starts.map((start) => start.direction);
    if (startDirections.includes(current)) {
      return current;
    }
    if (startDirections.length === 1) {
      return startDirections[0];
    }
    return current;
  }

  function resetPuzzleState() {
    setValues({});
    setChecked(false);
    setIsCorrect(false);
    setResultOpen(false);
    setDirection("across");
  }

  function resetAll() {
    if (storageKey) {
      clearCrosswordDraft(storageKey);
    }
    setPuzzleIndex(0);
    setSolvedCount(0);
    setFinished(false);
    resetPuzzleState();
  }

  function handleCheck() {
    if (!solution || resultOpen) {
      return;
    }

    const allCorrect = isGridCorrect(exercise, solution, values);

    setChecked(true);
    setIsCorrect(allCorrect);
    setResultOpen(true);
  }

  function handleContinue() {
    setResultOpen(false);
    if (!isCorrect) {
      return;
    }

    const nextSolved = solvedCount + 1;
    setSolvedCount(nextSolved);

    if (!isLastPuzzle) {
      setPuzzleIndex((value) => value + 1);
      resetPuzzleState();
      return;
    }

    setFinished(true);
    onComplete?.({ correct: nextSolved, total: exercises.length });
  }

  if (finished) {
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
        <h2 className="page-title">{t("crosswordComplete")}</h2>
        <p className="page-subtitle mt-0">
          {t("finishedScore", {
            correct: solvedCount,
            total: exercises.length,
          })}
        </p>
        <Button type="button" onClick={resetAll}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4">
      <div
        className={cn(
          "flex items-center gap-3",
          exercises.length > 1 ? "justify-between" : "justify-end",
        )}
      >
        {exercises.length > 1 ? (
          <p className="text-sm text-brand-500 dark:text-brand-400">
            {t("crosswordProgress", {
              current: puzzleIndex + 1,
              total: exercises.length,
            })}
          </p>
        ) : null}
        <ExercisePercentBadge percent={percent} />
      </div>
      <article className="dashboard-panel space-y-5">
        <ExerciseQuestionHeader
          title={t("typeCrossword")}
          fallbackKey="topicCrossword"
        />
        <div className="overflow-x-auto">
          <div
            className="mx-auto grid w-fit gap-0.5 sm:gap-1"
            style={{
              gridTemplateColumns: `repeat(${exercise.cols}, minmax(0, 1fr))`,
              width: `min(100%, ${Math.min(exercise.cols * 2.75, exercise.cols >= 14 ? 64 : 52)}rem)`,
            }}
            role="group"
            aria-label={t("typeCrossword")}
          >
            {solution.map((rowCells, row) =>
              rowCells.map((cell, col) => {
                if (!cell) {
                  return (
                    <div
                      key={cellKey(row, col)}
                      className="aspect-square rounded-md bg-brand-900/80 dark:bg-brand-950"
                      aria-hidden
                    />
                  );
                }

                const key = cellKey(row, col);
                const typed = (values[key] ?? "").toUpperCase();
                const relatedClues = cluesByCell.get(key) ?? [];
                const typedClues = relatedClues.filter((clue) =>
                  isClueFullyTyped(clue, values),
                );
                const clueHasError = typedClues.some(
                  (clue) => !isClueAnswerCorrect(clue, values),
                );
                const allTypedCluesCorrect =
                  typedClues.length > 0 &&
                  typedClues.every((clue) => isClueAnswerCorrect(clue, values));
                const showCorrect =
                  allTypedCluesCorrect &&
                  typed.length > 0 &&
                  typed === cell.letter;
                const showWrong =
                  typedClues.length > 0 && clueHasError && typed.length > 0;
                const showEmpty = checked && typed.length === 0;

                return (
                  <label
                    key={key}
                    className={cn(
                      "relative aspect-square rounded-md border bg-background",
                      showCorrect &&
                        "border-emerald-600 bg-emerald-500/35 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-500/30 dark:text-emerald-100",
                      (showWrong || showEmpty) &&
                        "border-red-600 bg-red-500/35 text-red-950 dark:border-red-400 dark:bg-red-500/30 dark:text-red-100",
                      !showCorrect &&
                        !showWrong &&
                        !showEmpty &&
                        "border-border",
                    )}
                  >
                    {cell.starts.length > 0 ? (
                      <span className="absolute top-0.5 left-0.5 flex flex-col text-[9px] leading-tight text-brand-500">
                        {cell.starts.map((start) => (
                          <span key={`${start.number}-${start.direction}`}>
                            {start.number}
                            {start.direction === "across"
                              ? t("crosswordArrowAcross")
                              : t("crosswordArrowDown")}
                          </span>
                        ))}
                      </span>
                    ) : null}
                    <input
                      ref={(element) => {
                        inputRefs.current[key] = element;
                      }}
                      type="text"
                      inputMode="text"
                      maxLength={1}
                      value={typed}
                      spellCheck={false}
                      autoComplete="off"
                      aria-label={`${row + 1},${col + 1}`}
                      onFocus={() => {
                        setDirection(
                          resolveDirection(
                            cell,
                            directionRef.current,
                            cluesByCell.get(key) ?? [],
                          ),
                        );
                      }}
                      onChange={(event) => {
                        const next = normalizeCrosswordCellInput(
                          event.target.value,
                        );
                        setChecked(false);
                        setValues((prev) => ({ ...prev, [key]: next }));
                        if (next) {
                          moveFocus(row, col, directionRef.current, 1);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Backspace" && typed.length === 0) {
                          event.preventDefault();
                          moveFocus(row, col, directionRef.current, -1);
                          return;
                        }

                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          setDirection("across");
                          moveFocus(row, col, "across", 1);
                          return;
                        }

                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          setDirection("across");
                          moveFocus(row, col, "across", -1);
                          return;
                        }

                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setDirection("down");
                          moveFocus(row, col, "down", 1);
                          return;
                        }

                        if (event.key === "ArrowUp") {
                          event.preventDefault();
                          setDirection("down");
                          moveFocus(row, col, "down", -1);
                        }
                      }}
                      className="size-full bg-transparent text-center font-display text-sm font-semibold uppercase text-brand-950 outline-none sm:text-base dark:text-brand-100"
                    />
                  </label>
                );
              }),
            )}
          </div>
        </div>

        <ul
          className="grid grid-flow-col grid-cols-3 gap-x-3 gap-y-2 text-xs text-brand-700 sm:gap-x-4 sm:text-sm dark:text-brand-300"
          style={{ gridTemplateRows: `repeat(${clueRowCount}, auto)` }}
        >
          {clues.map((clue) => (
            <li
              key={`${clue.direction}-${clue.number}`}
              className="flex items-start gap-1.5"
            >
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-brand-400 text-[10px] leading-none font-semibold tabular-nums text-brand-950 sm:size-6 sm:text-[11px] dark:border-brand-500 dark:text-brand-100">
                {clue.number}
              </span>
              <span className="min-w-0 pt-0.5">{clue.text}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {!checked || !isCorrect ? (
            <Button type="button" disabled={resultOpen} onClick={handleCheck}>
              <Check aria-hidden />
              {t("check")}
            </Button>
          ) : !resultOpen ? (
            <Button type="button" onClick={handleContinue}>
              {continueLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onRestart?.();
              resetAll();
            }}
          >
            <RotateCcw aria-hidden />
            {t("restart")}
          </Button>
        </div>
      </article>

      <ExerciseResultDialog
        open={resultOpen && checked}
        variant={isCorrect ? "correct" : "incorrect"}
        title={isCorrect ? t("crosswordComplete") : undefined}
        explanation={isCorrect ? undefined : t("crosswordIncomplete")}
        onOpenChange={setResultOpen}
        onContinue={handleContinue}
        continueLabel={isCorrect ? continueLabel : t("dialogOk")}
      />
    </div>
  );
}
