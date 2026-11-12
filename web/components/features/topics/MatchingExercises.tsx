"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  ListeningMatchingBlock,
  type MatchingBlockSessionState,
} from "@/components/features/listening/ListeningMatchingBlock";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ListeningMatchingQuestion } from "@/data/listenings/types";
import type { MatchingExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";

type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type MatchingSlot = {
  checked: boolean;
  correct: boolean;
  assignments?: Record<number, number>;
  revealed?: boolean;
  graded?: boolean;
};

type MatchingExercisesProps = {
  exercises: MatchingExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: MatchingSlot[];
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: MatchingSlot[];
  }) => void;
  showHint?: boolean;
  onBackToTypes?: () => void;
  liveProgressPercent?: boolean;
};

function createMatchingSlot(): MatchingSlot {
  return {
    checked: false,
    correct: false,
    assignments: {},
    revealed: false,
    graded: false,
  };
}

function matchingSessionFromSlot(
  slot: MatchingSlot,
): MatchingBlockSessionState | undefined {
  const hasProgress =
    slot.revealed ||
    slot.graded ||
    (slot.assignments && Object.keys(slot.assignments).length > 0);
  if (!hasProgress) {
    return undefined;
  }
  return {
    assignments: slot.assignments ?? {},
    revealed: slot.revealed ?? false,
    graded: slot.graded ?? false,
  };
}

function toListeningQuestion(
  exercise: MatchingExercise,
  showHint: boolean,
): ListeningMatchingQuestion {
  return {
    id: exercise.id,
    prompt: exercise.prompt,
    hint: showHint ? (exercise.hint ?? "") : "",
    pairs: exercise.pairs,
  };
}

function countCorrect(exercises: MatchingExercise[], slots: MatchingSlot[]) {
  return exercises.reduce((count, _exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (slot?.checked && slot.correct) {
      return count + 1;
    }
    return count;
  }, 0);
}

export function MatchingExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  onSessionChange,
  showHint = true,
  onBackToTypes,
  liveProgressPercent = true,
}: MatchingExercisesProps) {
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
    isLast,
    allChecked,
    updateCurrent,
    handlePrevious,
    handleAdvance,
    resetSession,
  } = useExerciseNavigation({
    length: exercises.length,
    createSlot: createMatchingSlot,
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

  useEffect(() => {
    if (!finished) {
      return;
    }
    onComplete?.({
      correct: countCorrect(exercises, slots),
      total: exercises.length,
    });
  }, [exercises, finished, onComplete, slots]);

  const matchingSessionDone = isLast && allChecked;

  const exercise = exercises[index];
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    exercises.length === 0
      ? 0
      : Math.round((answered / exercises.length) * 100);
  const continueLabel = t(nextLabelKey);

  function finishOrAdvance() {
    handleAdvance((answeredSlots) => {
      onComplete?.({
        correct: countCorrect(exercises, answeredSlots),
        total: exercises.length,
      });
    });
  }

  function handleNext() {
    finishOrAdvance();
  }

  const syncMatchingState = useCallback(
    (state: MatchingBlockSessionState) => {
      updateCurrent({
        assignments: state.assignments,
        revealed: state.revealed,
        graded: state.graded,
      });
    },
    [updateCurrent],
  );

  if (exercises.length === 0 || !current || !exercise) {
    return null;
  }

  const listeningQuestion = toListeningQuestion(exercise, showHint);
  const canRestart = Boolean(onRestart);
  const matchingInitialSession = matchingSessionFromSlot(current);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brand-500 dark:text-brand-400">
          {t("progress", { current: index + 1, total: exercises.length })}
        </p>
        {liveProgressPercent ? (
          <ExercisePercentBadge percent={percent} />
        ) : null}
      </div>

      <article className="dashboard-panel space-y-5">
        <ListeningMatchingBlock
          key={`${exercise.id}-${index}`}
          question={listeningQuestion}
          titleVariant="prompt"
          leftListen
          showInQuestionRetry={false}
          wrongMatchHint={t("matchWrongHint")}
          initialSession={matchingInitialSession}
          onSessionChange={syncMatchingState}
          onGraded={(correctPairs, totalPairs) => {
            updateCurrent({
              checked: true,
              correct: correctPairs === totalPairs,
              graded: true,
            });
          }}
          navTrailing={
            <ExerciseStepNav
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext && current.checked && !matchingSessionDone}
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
                ) : onBackToTypes ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBackToTypes}
                  >
                    {t("backToTypes")}
                  </Button>
                ) : null
              }
            />
          }
        />
      </article>

      <ExerciseResultDialog
        open={resultOpen && finished}
        variant={
          countCorrect(exercises, slots) === exercises.length
            ? "correct"
            : "incorrect"
        }
        explanation={exercise.explanation}
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}
