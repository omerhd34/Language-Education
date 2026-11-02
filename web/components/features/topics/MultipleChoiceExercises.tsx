"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { MultipleChoiceExercise } from "@/data/topics/types";
import { cn } from "@/lib/utils";

type MultipleChoiceExercisesProps = {
  exercises: MultipleChoiceExercise[];
};

export function MultipleChoiceExercises({
  exercises,
}: MultipleChoiceExercisesProps) {
  const t = useTranslations("Topic");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  function resetAll() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setFinished(false);
  }

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExercisesForType")}
      </p>
    );
  }

  if (finished) {
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
        <h2 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
          {t("finishedTitle")}
        </h2>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("finishedScore", {
            correct: correctCount,
            total: exercises.length,
          })}
        </p>
        <Button type="button" onClick={resetAll}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  const exercise = exercises[index];
  const isCorrect = selected === exercise.correctIndex;
  const canRestart = index > 0 || selected !== null || checked;

  function handleCheck() {
    if (selected === null || checked) {
      return;
    }
    setChecked(true);
    if (selected === exercise.correctIndex) {
      setCorrectCount((value) => value + 1);
    }
  }

  function handleNext() {
    if (index >= exercises.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setChecked(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-brand-500 dark:text-brand-400">
        {t("progress", { current: index + 1, total: exercises.length })}
      </p>

      <article className="dashboard-panel space-y-5">
        <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
          {exercise.prompt}
        </h2>

        <ul className="space-y-2" role="listbox" aria-label={t("optionsAria")}>
          {exercise.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const showCorrect =
              checked && optionIndex === exercise.correctIndex;
            const showWrong =
              checked && isSelected && optionIndex !== exercise.correctIndex;

            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={checked}
                  onClick={() => setSelected(optionIndex)}
                  className={cn(
                    "w-full cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    "disabled:cursor-default",
                    showCorrect &&
                      "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                    showWrong &&
                      "border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-200",
                    !showCorrect &&
                      !showWrong &&
                      isSelected &&
                      "border-sky-500 bg-sky-500/10 text-brand-950 dark:text-brand-100",
                    !showCorrect &&
                      !showWrong &&
                      !isSelected &&
                      "border-border bg-background/50 text-brand-800 hover:border-brand-400 dark:bg-brand-950/40 dark:text-brand-200",
                  )}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>

        {checked ? (
          <p
            className={cn(
              "text-sm",
              isCorrect
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-red-700 dark:text-red-300",
            )}
          >
            {isCorrect ? t("correct") : t("incorrect")}
            {exercise.explanation ? ` ${exercise.explanation}` : null}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {!checked ? (
            <Button
              type="button"
              disabled={selected === null}
              onClick={handleCheck}
            >
              {t("check")}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              {index >= exercises.length - 1 ? t("seeResult") : t("next")}
            </Button>
          )}
          {canRestart ? (
            <Button type="button" variant="outline" onClick={resetAll}>
              {t("restart")}
            </Button>
          ) : null}
        </div>
      </article>
    </div>
  );
}
