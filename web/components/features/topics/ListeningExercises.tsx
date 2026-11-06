"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Volume2 } from "lucide-react";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { ListeningExercise } from "@/data/topics/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import { speakText, stopSpeaking } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type ExerciseSessionResult = {
  correct: number;
  total: number;
};

type ListeningExercisesProps = {
  exercises: ListeningExercise[];
  onComplete?: (result: ExerciseSessionResult) => void;
  onRestart?: () => void;
  initialIndex?: number;
  initialSlots?: ListeningSlot[];
  progressShare?: number;
  onSessionChange?: (session: {
    index: number;
    correct: number;
    total: number;
    slots: ListeningSlot[];
  }) => void;
};

type ListeningSlot = {
  englishSelected: number | null;
  turkishSelected: number | null;
  checked: boolean;
};

type OptionGroupProps = {
  label: string;
  options: string[];
  selected: number | null;
  correctIndex: number;
  checked: boolean;
  ariaLabel: string;
  onSelect: (index: number) => void;
};

function createListeningSlot(): ListeningSlot {
  return { englishSelected: null, turkishSelected: null, checked: false };
}

function isListeningCorrect(exercise: ListeningExercise, slot: ListeningSlot) {
  return (
    slot.englishSelected === exercise.englishCorrectIndex &&
    slot.turkishSelected === exercise.turkishCorrectIndex
  );
}

function countCorrect(exercises: ListeningExercise[], slots: ListeningSlot[]) {
  return exercises.reduce((count, exercise, exerciseIndex) => {
    const slot = slots[exerciseIndex];
    if (slot?.checked && isListeningCorrect(exercise, slot)) {
      return count + 1;
    }
    return count;
  }, 0);
}

function OptionGroup({
  label,
  options,
  selected,
  correctIndex,
  checked,
  ariaLabel,
  onSelect,
}: OptionGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
        {label}
      </p>
      <ul className="space-y-2" role="listbox" aria-label={ariaLabel}>
        {options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;
          const showCorrect = checked && optionIndex === correctIndex;
          const showWrong =
            checked && isSelected && optionIndex !== correctIndex;

          return (
            <li key={`${label}-${option}-${optionIndex}`}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={checked}
                onClick={() => onSelect(optionIndex)}
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
    </div>
  );
}

export function ListeningExercises({
  exercises,
  onComplete,
  onRestart,
  initialIndex = 0,
  initialSlots,
  progressShare = 100,
  onSessionChange,
}: ListeningExercisesProps) {
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
    createSlot: createListeningSlot,
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
        englishSelected: slot.englishSelected,
        turkishSelected: slot.turkishSelected,
        checked: slot.checked,
      })),
    });
  }, [exercises, index, onSessionChange, slots]);

  const exercise = exercises[index];

  useEffect(() => {
    if (!exercise || finished) {
      return;
    }
    speakText(exercise.speakText);
    return () => {
      stopSpeaking();
    };
  }, [exercise, finished, index]);

  if (exercises.length === 0 || !current || !exercise) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExercisesForType")}
      </p>
    );
  }

  const isCorrect = current.checked && isListeningCorrect(exercise, current);
  const canCheck =
    current.englishSelected !== null &&
    current.turkishSelected !== null &&
    !current.checked;
  const canRestart = index > 0;
  const continueLabel = t(nextLabelKey);
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    exercises.length === 0
      ? 0
      : Math.round((answered / exercises.length) * progressShare);

  function resetAll() {
    stopSpeaking();
    resetSession();
  }

  if (finished) {
    const correctCount = countCorrect(exercises, slots);
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

  function handleCheck() {
    if (!canCheck || !current) {
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
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
            {exercise.prompt}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => speakText(exercise.speakText)}
            >
              <Volume2 className="size-4" aria-hidden />
              {t("playAudio")}
            </Button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <OptionGroup
            label={t("listeningEnglishLabel")}
            options={exercise.englishOptions}
            selected={current.englishSelected}
            correctIndex={exercise.englishCorrectIndex}
            checked={current.checked}
            ariaLabel={t("listeningEnglishOptionsAria")}
            onSelect={(optionIndex) =>
              updateCurrent({ englishSelected: optionIndex })
            }
          />
          <OptionGroup
            label={t("listeningTurkishLabel")}
            options={exercise.turkishOptions}
            selected={current.turkishSelected}
            correctIndex={exercise.turkishCorrectIndex}
            checked={current.checked}
            ariaLabel={t("listeningTurkishOptionsAria")}
            onSelect={(optionIndex) =>
              updateCurrent({ turkishSelected: optionIndex })
            }
          />
        </div>

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
                  resetAll();
                }}
              >
                {t("restart")}
              </Button>
            ) : null
          }
        >
          {!current.checked ? (
            <Button type="button" disabled={!canCheck} onClick={handleCheck}>
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
