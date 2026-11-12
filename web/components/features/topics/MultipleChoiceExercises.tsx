"use client";

import { ListChecks, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type FormEvent } from "react";
import { ExerciseCheckButton } from "@/components/features/exercises/ExerciseCheckButton";
import { ExerciseFinishedPanel } from "@/components/features/exercises/ExerciseFinishedPanel";
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
    return <p className="page-subtitle mt-0">{t("noExercisesForType")}</p>;
  }

  const exercise = exercises[index];
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
      <ExerciseFinishedPanel
        correct={correctCount}
        total={exercises.length}
        onRetry={resetSession}
        onBackToTypes={onBackToTypes}
      />
    );
  }

  function handleOptionSelect(optionIndex: number) {
    if (current.checked) {
      return;
    }
    updateCurrent({ selected: optionIndex });
  }

  function handleCheck(event?: FormEvent) {
    event?.preventDefault();
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

        <form className="space-y-4" onSubmit={handleCheck}>
          <ExerciseStepNav
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext && current.checked}
            nextLabel={continueLabel}
            nextVariant={current.checked ? "default" : "outline"}
            onPrevious={handlePrevious}
            onNext={handleNext}
            trailing={
              canRestart ? (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    onRestart?.();
                    resetSession();
                  }}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  {t("restart")}
                </Button>
              ) : null
            }
          >
            {!current.checked ? (
              <ExerciseCheckButton
                type="submit"
                disabled={current.selected === null}
              >
                <ListChecks className="size-4" aria-hidden />
                {t("check")}
              </ExerciseCheckButton>
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
