"use client";

import { ListChecks, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type FormEvent } from "react";
import { ExerciseFinishedPanel } from "@/components/features/exercises/ExerciseFinishedPanel";
import { ExerciseListenWordButton } from "@/components/features/exercises/ExerciseListenWordButton";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { ErrorCorrectionExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import {
  correctedSentence,
  errorCorrectionTokens,
  isErrorCorrectionFullyCorrect,
} from "@/lib/errorCorrection";
import { cn } from "@/lib/utils";

type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type ErrorCorrectionSlot = {
  selected: number | null;
  answer: string;
  checked: boolean;
};

type ErrorCorrectionExercisesProps = {
  exercises: ErrorCorrectionExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: ErrorCorrectionSlot[];
  progressShare?: number;
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: ErrorCorrectionSlot[];
  }) => void;
  showHint?: boolean;
  onBackToTypes?: () => void;
  liveProgressPercent?: boolean;
};

function createSlot(): ErrorCorrectionSlot {
  return { selected: null, answer: "", checked: false };
}

function countCorrect(
  exercises: ErrorCorrectionExercise[],
  slots: ErrorCorrectionSlot[],
): number {
  return exercises.reduce((count, exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (
      slot?.checked &&
      isErrorCorrectionFullyCorrect(exercise, slot.selected, slot.answer)
    ) {
      return count + 1;
    }
    return count;
  }, 0);
}

export function ErrorCorrectionExercises({
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
}: ErrorCorrectionExercisesProps) {
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
    createSlot: createSlot,
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
        answer: slot.answer,
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

  const tokens = errorCorrectionTokens(exercise);
  const isCorrect =
    current.checked &&
    isErrorCorrectionFullyCorrect(exercise, current.selected, current.answer);
  const canRestart = index > 0;
  const continueLabel = t(nextLabelKey);
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    exercises.length === 0
      ? 0
      : Math.round((answered / exercises.length) * progressShare);
  const promptId = `${exercise.id}-sentence`;
  const speakText = exercise.speakText ?? exercise.sentence;
  const canCheck =
    !current.checked &&
    current.selected !== null &&
    current.answer.trim() !== "";

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

  function handleCheck(event?: FormEvent) {
    event?.preventDefault();
    if (!canCheck) {
      return;
    }
    updateCurrent({ checked: true });
    setResultOpen(true);
  }

  function handleNext() {
    handleAdvance((answeredSlots) => {
      onComplete?.({
        correct: countCorrect(exercises, answeredSlots),
        total: exercises.length,
      });
    });
  }

  function handleTokenClick(tokenIndex: number) {
    if (current.checked) {
      return;
    }
    updateCurrent({ selected: tokenIndex });
  }

  const fixedSentence = correctedSentence(exercise);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brand-500 dark:text-brand-400">
          {t("progress", { current: index + 1, total: exercises.length })}
        </p>
        {liveProgressPercent ? (
          <ExercisePercentBadge percent={percent} />
        ) : null}
      </div>

      <article className="dashboard-panel space-y-5 pb-5 sm:pb-6">
        <ExerciseQuestionHeader
          title={t("errorCorrectionInstruction")}
          hint={exercise.hint}
          fallbackKey={showHint ? "topicErrorCorrection" : undefined}
          showHint={showHint}
          headingId={promptId}
          actions={
            speakText ? <ExerciseListenWordButton text={speakText} /> : null
          }
        />

        <div className="space-y-4">
          <p
            id={promptId}
            className="flex flex-wrap gap-2 text-base leading-relaxed text-brand-900 dark:text-brand-100"
            role="group"
            aria-label={t("errorCorrectionTokensAria")}
          >
            {tokens.map((token, tokenIndex) => {
              const isErrorToken = tokenIndex === exercise.errorTokenIndex;
              const isSelected = current.selected === tokenIndex;
              const showAsErrorSpot = current.checked && isErrorToken;
              const showWrongPick =
                current.checked && isSelected && !isErrorToken;

              return (
                <button
                  key={`${exercise.id}-tok-${tokenIndex}`}
                  type="button"
                  disabled={current.checked}
                  onClick={() => handleTokenClick(tokenIndex)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    "disabled:cursor-default",
                    showAsErrorSpot &&
                      "border-emerald-500/60 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100",
                    showWrongPick &&
                      "border-red-500/50 bg-red-500/10 text-red-900 dark:text-red-100",
                    current.checked &&
                      !showAsErrorSpot &&
                      !showWrongPick &&
                      "border-border/60 bg-muted/40 text-brand-600 dark:text-brand-300",
                    !current.checked &&
                      isSelected &&
                      "border-brand-800 bg-brand-100/60 text-brand-950 ring-2 ring-brand-800/20 dark:border-brand-400 dark:bg-brand-900/50 dark:text-brand-50",
                    !current.checked &&
                      !isSelected &&
                      "border-border bg-background/70 text-brand-800 hover:border-brand-400 dark:bg-brand-950/30 dark:text-brand-200",
                  )}
                >
                  {token}
                </button>
              );
            })}
          </p>

          <label className="flex w-full flex-col gap-1.5 text-sm">
            <span className="text-brand-600 dark:text-brand-400">
              {t("errorCorrectionFixLabel")}
            </span>
            <input
              type="text"
              value={current.answer}
              disabled={current.checked}
              onChange={(event) =>
                updateCurrent({ answer: event.target.value })
              }
              placeholder={t("errorCorrectionFixPlaceholder")}
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
        </div>

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
              <Button type="submit" className="gap-2" disabled={!canCheck}>
                <ListChecks className="size-4" aria-hidden />
                {t("check")}
              </Button>
            ) : null}
          </ExerciseStepNav>
        </form>
      </article>

      <ExerciseResultDialog
        open={resultOpen && current.checked}
        variant={isCorrect ? "correct" : "incorrect"}
        explanation={
          isCorrect
            ? (exercise.explanation ?? fixedSentence)
            : `${exercise.explanation ?? ""}${exercise.explanation ? " " : ""}${fixedSentence}`
        }
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}
