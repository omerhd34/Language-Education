"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { FillBlankExercise } from "@/data/topics/types";
import { cn } from "@/lib/utils";

type FillBlankExercisesProps = {
  exercises: FillBlankExercise[];
};

function normalizeAnswer(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

function isAnswerCorrect(exercise: FillBlankExercise, value: string) {
  const normalized = normalizeAnswer(value);
  const accepted = [exercise.answer, ...(exercise.acceptedAnswers ?? [])].map(
    normalizeAnswer,
  );

  return accepted.includes(normalized);
}

export function FillBlankExercises({ exercises }: FillBlankExercisesProps) {
  const t = useTranslations("Topic");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  function resetAll() {
    setIndex(0);
    setAnswer("");
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
  const isCorrect = isAnswerCorrect(exercise, answer);
  const canRestart = index > 0 || answer.length > 0 || checked;

  function handleCheck(event?: FormEvent) {
    event?.preventDefault();
    if (!answer.trim() || checked) {
      return;
    }
    setChecked(true);
    if (isAnswerCorrect(exercise, answer)) {
      setCorrectCount((value) => value + 1);
    }
  }

  function handleNext() {
    if (index >= exercises.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer("");
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

        <form className="space-y-4" onSubmit={handleCheck}>
          <label className="flex w-full flex-col gap-1.5 text-sm">
            <span className="font-medium text-brand-900 dark:text-brand-100">
              {t("answerLabel")}
            </span>
            <input
              type="text"
              value={answer}
              disabled={checked}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={t("answerPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "h-11 rounded-lg border bg-surface px-3 text-brand-950 outline-none transition-colors",
                "placeholder:text-brand-600/60 focus:ring-2",
                "dark:bg-brand-900 dark:text-brand-100 dark:placeholder:text-brand-400/70",
                checked &&
                  isCorrect &&
                  "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/20",
                checked &&
                  !isCorrect &&
                  "border-red-500/60 focus:border-red-500 focus:ring-red-500/20",
                !checked &&
                  "border-brand-400/70 focus:border-brand-800 focus:ring-brand-800/20 dark:border-brand-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20",
              )}
            />
          </label>

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
              <Button type="submit" disabled={!answer.trim()}>
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
        </form>
      </article>
    </div>
  );
}
