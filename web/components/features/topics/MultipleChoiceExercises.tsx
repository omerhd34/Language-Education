"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { MultipleChoiceExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import { cn } from "@/lib/utils";

export type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type ChoiceSlot = {
  selected: number | null;
  checked: boolean;
};

type MultipleChoiceExercisesProps = {
  exercises: MultipleChoiceExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: ChoiceSlot[];
  progressShare?: number;
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: ChoiceSlot[];
  }) => void;
};

function createChoiceSlot(): ChoiceSlot {
  return { selected: null, checked: false };
}

function countCorrect(
  exercises: MultipleChoiceExercise[],
  slots: ChoiceSlot[],
) {
  return exercises.reduce((count, exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (slot?.checked && slot.selected === exercise.correctIndex) {
      return count + 1;
    }
    return count;
  }, 0);
}

export function MultipleChoiceExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  progressShare = 100,
  onSessionChange,
}: MultipleChoiceExercisesProps) {
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
    createSlot: createChoiceSlot,
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
        selected: slot.selected,
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
    current.checked && current.selected === exercise.correctIndex;
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

  function handleCheck() {
    if (current.selected === null || current.checked) {
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
    <div
      className={cn(
        "mx-auto space-y-4",
        exercises.some((item) => item.options.length >= 6)
          ? "max-w-3xl"
          : "max-w-2xl",
      )}
    >
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

        <ul
          className={cn(
            "grid gap-2",
            exercise.options.length >= 6 ? "sm:grid-cols-2" : "grid-cols-1",
          )}
          role="listbox"
          aria-label={t("optionsAria")}
        >
          {exercise.options.map((option, optionIndex) => {
            const isSelected = current.selected === optionIndex;
            const showCorrect =
              current.checked && optionIndex === exercise.correctIndex;
            const showWrong =
              current.checked &&
              isSelected &&
              optionIndex !== exercise.correctIndex;

            return (
              <li key={`${optionIndex}-${option}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={current.checked}
                  onClick={() => updateCurrent({ selected: optionIndex })}
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
            <Button
              type="button"
              disabled={current.selected === null}
              onClick={handleCheck}
            >
              {t("check")}
            </Button>
          ) : null}
        </ExerciseStepNav>
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
