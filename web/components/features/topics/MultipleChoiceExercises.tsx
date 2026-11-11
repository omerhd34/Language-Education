"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { ExerciseFinishedActions } from "@/components/features/exercises/ExerciseFinishedActions";
import { ExerciseListenWordButton } from "@/components/features/exercises/ExerciseListenWordButton";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { InstantMultipleChoiceOptions } from "@/components/features/exercises/InstantMultipleChoiceOptions";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { MultipleChoiceExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import { multipleChoiceSpeakText } from "@/lib/exerciseSpeakText";
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
  showHint?: boolean;
  onBackToTypes?: () => void;
  liveProgressPercent?: boolean;
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

const CORRECT_ANSWER_AUTO_ADVANCE_MS = 480;

export function MultipleChoiceExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  progressShare = 100,
  onSessionChange,
  showHint = true,
  onBackToTypes,
  liveProgressPercent = true,
}: MultipleChoiceExercisesProps) {
  const t = useTranslations("Topic");
  const skipSessionSave = useRef(true);
  const shouldAutoAdvanceRef = useRef(false);
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

  const exercise = exercises[index];

  const finishOrAdvance = useCallback(() => {
    handleAdvance((answered) => {
      onComplete?.({
        correct: countCorrect(exercises, answered),
        total: exercises.length,
      });
    });
  }, [exercises, handleAdvance, onComplete]);

  useEffect(() => {
    if (!exercise || !shouldAutoAdvanceRef.current) {
      return;
    }
    if (!current?.checked || current.selected !== exercise.correctIndex) {
      shouldAutoAdvanceRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      shouldAutoAdvanceRef.current = false;
      finishOrAdvance();
    }, CORRECT_ANSWER_AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [current?.checked, current?.selected, exercise, index, finishOrAdvance]);

  if (exercises.length === 0 || !current) {
    return <p className="page-subtitle mt-0">{t("noExercisesForType")}</p>;
  }

  if (!exercise) {
    return null;
  }

  const promptId = `${exercise.id}-prompt`;
  const listenWord = multipleChoiceSpeakText(exercise);

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
        <h2 className="page-title">{t("finishedTitle")}</h2>
        <p className="page-subtitle mt-0">
          {t("finishedScore", {
            correct: correctCount,
            total: exercises.length,
          })}
        </p>
        <ExerciseFinishedActions
          onRetry={resetSession}
          onBackToTypes={onBackToTypes}
        />
      </div>
    );
  }

  function handleOptionSelect(optionIndex: number) {
    if (current.checked) {
      return;
    }
    const isAnswerCorrect = optionIndex === exercise.correctIndex;
    updateCurrent({ selected: optionIndex, checked: true });
    shouldAutoAdvanceRef.current = isAnswerCorrect;
    if (!isAnswerCorrect) {
      setResultOpen(true);
    }
  }

  function handleNext() {
    shouldAutoAdvanceRef.current = false;
    finishOrAdvance();
  }

  function handlePreviousWithCancelAutoAdvance() {
    shouldAutoAdvanceRef.current = false;
    handlePrevious();
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
        {liveProgressPercent ? (
          <ExercisePercentBadge percent={percent} />
        ) : null}
      </div>

      <article className="dashboard-panel space-y-5">
        <ExerciseQuestionHeader
          title={exercise.prompt}
          hint={exercise.hint}
          fallbackKey={showHint ? "topicMultipleChoice" : undefined}
          showHint={showHint}
          headingId={promptId}
          actions={
            listenWord ? <ExerciseListenWordButton text={listenWord} /> : null
          }
        />

        <InstantMultipleChoiceOptions
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          selected={current.selected}
          revealed={current.checked}
          onSelect={handleOptionSelect}
          labelledBy={promptId}
          optionsAriaLabel={t("optionsAria")}
        />

        <ExerciseStepNav
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext && current.checked}
          nextLabel={continueLabel}
          nextVariant={current.checked ? "default" : "outline"}
          onPrevious={handlePreviousWithCancelAutoAdvance}
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
        />
      </article>

      <ExerciseResultDialog
        open={resultOpen && current.checked && !isCorrect}
        variant="incorrect"
        explanation={exercise.explanation}
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}
