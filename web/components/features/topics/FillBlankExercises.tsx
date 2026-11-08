"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, type FormEvent } from "react";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { FillBlankExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import { cn } from "@/lib/utils";

type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type FillBlankExercisesProps = {
  exercises: FillBlankExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: BlankSlot[];
  progressShare?: number;
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: BlankSlot[];
  }) => void;
};

type BlankSlot = {
  answer: string;
  checked: boolean;
};

function createBlankSlot(): BlankSlot {
  return { answer: "", checked: false };
}

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

function countCorrect(exercises: FillBlankExercise[], slots: BlankSlot[]) {
  return exercises.reduce((count, exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (slot?.checked && isAnswerCorrect(exercise, slot.answer)) {
      return count + 1;
    }
    return count;
  }, 0);
}

export function FillBlankExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  progressShare = 100,
  onSessionChange,
}: FillBlankExercisesProps) {
  const t = useTranslations("Topic");
  const skipSessionSave = useRef(true);
  const {
    index,
    slots,
    current,
    finished,
    resultOpen,
    setResultOpen,
    nextLabelKey,
    canGoPrevious,
    canGoNext,
    updateCurrent,
    handlePrevious,
    handleAdvance,
    resetSession,
  } = useExerciseNavigation({
    length: exercises.length,
    createSlot: createBlankSlot,
    initialIndex,
    initialSlots,
  });

  useEffect(() => {
    if (!onSessionChange) {
      return;
    }
    if (skipSessionSave.current) {
      skipSessionSave.current = false;
      return;
    }

    onSessionChange({
      index,
      correct: countCorrect(exercises, slots),
      total: exercises.length,
      slots: slots.map((slot) => ({
        answer: slot.answer,
        checked: slot.checked,
      })),
    });
  }, [exercises, index, onSessionChange, slots]);

  if (exercises.length === 0 || !current) {
    return (
      <p className="page-subtitle mt-0">
        {t("noExercisesForType")}
      </p>
    );
  }

  const exercise = exercises[index];
  if (!exercise) {
    return null;
  }

  const isCorrect =
    current.checked && isAnswerCorrect(exercise, current.answer);
  const canRestart = index > 0;
  const continueLabel = t(nextLabelKey);
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    exercises.length === 0
      ? 0
      : Math.round((answered / exercises.length) * progressShare);

  if (finished) {
    const correctCount = countCorrect(exercises, slots);
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
        <h2 className="page-title">
          {t("finishedTitle")}
        </h2>
        <p className="page-subtitle mt-0">
          {t("finishedScore", {
            correct: correctCount,
            total: exercises.length,
          })}
        </p>
        <Button type="button" onClick={resetSession}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  function handleCheck(event?: FormEvent) {
    event?.preventDefault();
    if (!current || !current.answer.trim() || current.checked) {
      return;
    }
    updateCurrent({ checked: true });
    setResultOpen(true);
  }

  function handleNext() {
    handleAdvance((answered) => {
      onComplete?.({
        correct: countCorrect(exercises, answered),
        total: exercises.length,
      });
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brand-500 dark:text-brand-400">
          {t("progress", { current: index + 1, total: exercises.length })}
        </p>
        <ExercisePercentBadge percent={percent} />
      </div>

      <article className="dashboard-panel space-y-5">
        <h2 className="section-title">
          {exercise.prompt}
        </h2>

        <form className="space-y-4" onSubmit={handleCheck}>
          <label className="flex w-full flex-col gap-1.5 text-sm">
            <input
              type="text"
              value={current.answer}
              disabled={current.checked}
              onChange={(event) =>
                updateCurrent({ answer: event.target.value })
              }
              placeholder={t("answerPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "h-11 rounded-lg border bg-surface px-3 text-brand-950 outline-none transition-colors",
                "placeholder:text-brand-600/60 focus:ring-2",
                "dark:bg-brand-900 dark:text-brand-100 dark:placeholder:text-brand-400/70",
                current.checked &&
                  isCorrect &&
                  "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/20",
                current.checked &&
                  !isCorrect &&
                  "border-red-500/60 focus:border-red-500 focus:ring-red-500/20",
                !current.checked &&
                  "border-brand-400/70 focus:border-brand-800 focus:ring-brand-800/20 dark:border-brand-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20",
              )}
            />
          </label>

          <ExerciseStepNav
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            nextLabel={continueLabel}
            nextVariant={current.checked ? "default" : "outline"}
            onPrevious={handlePrevious}
            onNext={handleNext}
            trailing={
              canRestart ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onRestart?.();
                    resetSession();
                  }}
                >
                  {t("restart")}
                </Button>
              ) : null
            }
          >
            {!current.checked ? (
              <Button type="submit" disabled={!current.answer.trim()}>
                {t("check")}
              </Button>
            ) : null}
          </ExerciseStepNav>
        </form>
      </article>

      <ExerciseResultDialog
        open={resultOpen && current.checked}
        variant={isCorrect ? "correct" : "incorrect"}
        explanation={exercise.explanation}
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}
