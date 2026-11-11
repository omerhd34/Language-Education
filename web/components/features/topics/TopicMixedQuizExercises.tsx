"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, type FormEvent } from "react";
import { ExerciseFinishedActions } from "@/components/features/exercises/ExerciseFinishedActions";
import { ExerciseListenWordButton } from "@/components/features/exercises/ExerciseListenWordButton";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { InstantMultipleChoiceOptions } from "@/components/features/exercises/InstantMultipleChoiceOptions";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { FillBlankExercise, TopicQuizExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import {
  fillBlankSpeakText,
  multipleChoiceSpeakText,
} from "@/lib/exerciseSpeakText";
import { cn } from "@/lib/utils";

export type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type MixedSlot = {
  selected: number | null;
  answer: string;
  checked: boolean;
};

type TopicMixedQuizExercisesProps = {
  exercises: TopicQuizExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: MixedSlot[];
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: MixedSlot[];
  }) => void;
  showHint?: boolean;
  /** Quiz sırasında yüzde rozeti güncellenmesin (tamamlanınca özet ekranında skor gösterilir). */
  liveProgressPercent?: boolean;
};

const CORRECT_ANSWER_AUTO_ADVANCE_MS = 480;

function createMixedSlot(): MixedSlot {
  return { selected: null, answer: "", checked: false };
}

function normalizeAnswer(value: string) {
  return value.trim().toLocaleLowerCase("en-US");
}

function isFillBlankCorrect(exercise: FillBlankExercise, value: string) {
  const normalized = normalizeAnswer(value);
  const accepted = [exercise.answer, ...(exercise.acceptedAnswers ?? [])].map(
    normalizeAnswer,
  );
  return accepted.includes(normalized);
}

function isSlotCorrect(exercise: TopicQuizExercise, slot: MixedSlot): boolean {
  if (!slot.checked) {
    return false;
  }
  if (exercise.type === "multiple_choice") {
    return slot.selected === exercise.correctIndex;
  }
  return isFillBlankCorrect(exercise, slot.answer);
}

function countCorrect(
  exercises: TopicQuizExercise[],
  slots: MixedSlot[],
): number {
  return exercises.reduce((count, exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (slot && isSlotCorrect(exercise, slot)) {
      return count + 1;
    }
    return count;
  }, 0);
}

export function TopicMixedQuizExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  onSessionChange,
  showHint = false,
  liveProgressPercent = true,
}: TopicMixedQuizExercisesProps) {
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
    createSlot: createMixedSlot,
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
      slots,
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
    if (
      !exercise ||
      exercise.type !== "multiple_choice" ||
      !shouldAutoAdvanceRef.current
    ) {
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
  }, [current?.checked, current?.selected, exercise, finishOrAdvance]);

  if (exercises.length === 0 || !current) {
    return <p className="page-subtitle mt-0">{t("noExamQuestions")}</p>;
  }

  if (!exercise) {
    return null;
  }

  const isCorrect = isSlotCorrect(exercise, current);
  const canRestart = index > 0;
  const continueLabel = t(nextLabelKey);
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    exercises.length === 0
      ? 0
      : Math.round((answered / exercises.length) * 100);

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
        <ExerciseFinishedActions onRetry={resetSession} />
      </div>
    );
  }

  const promptId = `${exercise.id}-prompt`;
  const hintFallbackKey =
    exercise.type === "multiple_choice"
      ? "topicMultipleChoice"
      : "topicFillBlank";

  function handleOptionSelect(optionIndex: number) {
    if (current.checked || exercise.type !== "multiple_choice") {
      return;
    }
    const mc = exercise;
    const answerCorrect = optionIndex === mc.correctIndex;
    updateCurrent({ selected: optionIndex, checked: true });
    shouldAutoAdvanceRef.current = answerCorrect;
    if (!answerCorrect) {
      setResultOpen(true);
    }
  }

  function handleCheck(event?: FormEvent) {
    event?.preventDefault();
    if (
      exercise.type !== "fill_blank" ||
      !current.answer.trim() ||
      current.checked
    ) {
      return;
    }
    updateCurrent({ checked: true });
    setResultOpen(true);
  }

  function handleNext() {
    shouldAutoAdvanceRef.current = false;
    finishOrAdvance();
  }

  function handlePreviousWithCancelAutoAdvance() {
    shouldAutoAdvanceRef.current = false;
    handlePrevious();
  }

  const listenWord =
    exercise.type === "multiple_choice"
      ? multipleChoiceSpeakText(exercise)
      : fillBlankSpeakText(exercise);

  return (
    <div
      className={cn(
        "mx-auto space-y-4",
        exercise.type === "multiple_choice" && exercise.options.length >= 6
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

      <article className="dashboard-panel space-y-5 pb-5 sm:pb-6">
        <ExerciseQuestionHeader
          title={exercise.prompt}
          hint={exercise.hint}
          fallbackKey={showHint ? hintFallbackKey : undefined}
          showHint={showHint}
          headingId={promptId}
          actions={
            listenWord ? <ExerciseListenWordButton text={listenWord} /> : null
          }
        />

        {exercise.type === "multiple_choice" ? (
          <>
            <InstantMultipleChoiceOptions
              options={exercise.options}
              correctIndex={exercise.correctIndex}
              selected={current.selected}
              revealed={current.checked}
              onSelect={handleOptionSelect}
              labelledBy={promptId}
              optionsAriaLabel={t("optionsAria")}
            />
          </>
        ) : (
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
          </form>
        )}

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
        >
          {exercise.type === "fill_blank" && !current.checked ? (
            <Button
              type="button"
              disabled={!current.answer.trim()}
              onClick={() => handleCheck()}
            >
              {t("check")}
            </Button>
          ) : null}
        </ExerciseStepNav>
      </article>

      <ExerciseResultDialog
        open={
          resultOpen &&
          current.checked &&
          (exercise.type === "fill_blank" ||
            (exercise.type === "multiple_choice" && !isCorrect))
        }
        variant={isCorrect ? "correct" : "incorrect"}
        explanation={exercise.explanation}
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}
