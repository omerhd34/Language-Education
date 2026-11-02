"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type {
  CrosswordDirection,
  CrosswordExercise,
} from "@/data/topics/types";
import { cn } from "@/lib/utils";

type CrosswordExerciseViewProps = {
  exercises: CrosswordExercise[];
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

export function CrosswordExerciseView({
  exercises,
}: CrosswordExerciseViewProps) {
  const t = useTranslations("Topic");
  const exercise = exercises[0];
  const solution = useMemo(
    () => (exercise ? buildSolutionGrid(exercise) : null),
    [exercise],
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!exercise || !solution) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExercisesForType")}
      </p>
    );
  }

  const clues = [...exercise.clues].sort((a, b) => a.number - b.number);

  function resetAll() {
    setValues({});
    setChecked(false);
    setFinished(false);
  }

  function handleCheck() {
    if (!solution) {
      return;
    }

    let allCorrect = true;

    for (let row = 0; row < exercise.rows; row += 1) {
      for (let col = 0; col < exercise.cols; col += 1) {
        const cell = solution[row][col];
        if (!cell) {
          continue;
        }
        const typed = (values[cellKey(row, col)] ?? "").toUpperCase();
        if (typed !== cell.letter) {
          allCorrect = false;
        }
      }
    }

    setChecked(true);
    if (allCorrect) {
      setFinished(true);
    }
  }

  if (finished) {
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
        <h2 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
          {t("crosswordComplete")}
        </h2>
        <Button type="button" onClick={resetAll}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <article className="dashboard-panel space-y-5">
        <div
          className="mx-auto grid w-fit gap-1"
          style={{
            gridTemplateColumns: `repeat(${exercise.cols}, minmax(2rem, 2.5rem))`,
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
              const showCorrect = checked && typed === cell.letter;
              const showWrong =
                checked && typed.length > 0 && typed !== cell.letter;
              const showEmpty = checked && typed.length === 0;

              return (
                <label
                  key={key}
                  className={cn(
                    "relative aspect-square rounded-md border bg-background",
                    showCorrect && "border-emerald-500/70 bg-emerald-500/10",
                    (showWrong || showEmpty) &&
                      "border-red-500/70 bg-red-500/10",
                    !checked && "border-border",
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
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={typed}
                    spellCheck={false}
                    autoComplete="off"
                    aria-label={`${row + 1},${col + 1}`}
                    onChange={(event) => {
                      const next = event.target.value
                        .replace(/[^a-zA-Z]/g, "")
                        .slice(-1)
                        .toUpperCase();
                      setChecked(false);
                      setValues((prev) => ({ ...prev, [key]: next }));
                    }}
                    className="size-full bg-transparent text-center font-display text-base font-semibold uppercase text-brand-950 outline-none dark:text-brand-100"
                  />
                </label>
              );
            }),
          )}
        </div>

        <ul className="space-y-1.5 text-sm text-brand-700 dark:text-brand-300">
          {clues.map((clue) => (
            <li key={`${clue.direction}-${clue.number}`}>
              {t("crosswordClue", {
                number: clue.number,
                arrow:
                  clue.direction === "across"
                    ? t("crosswordArrowAcross")
                    : t("crosswordArrowDown"),
                text: clue.text,
              })}
            </li>
          ))}
        </ul>

        {checked && !finished ? (
          <p className="text-sm text-red-700 dark:text-red-300">
            {t("crosswordIncomplete")}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={handleCheck}>
            {t("check")}
          </Button>
          <Button type="button" variant="outline" onClick={resetAll}>
            {t("restart")}
          </Button>
        </div>
      </article>
    </div>
  );
}
