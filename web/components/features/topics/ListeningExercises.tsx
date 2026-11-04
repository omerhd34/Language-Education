"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2 } from "lucide-react";
import { SpeechRateControl } from "@/components/features/vocabulary/SpeechRateControl";
import { Button } from "@/components/ui/Button";
import type { ListeningExercise } from "@/data/topics/types";
import { speakText, stopSpeaking } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type ListeningExercisesProps = {
  exercises: ListeningExercise[];
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

export function ListeningExercises({ exercises }: ListeningExercisesProps) {
  const t = useTranslations("Topic");
  const [index, setIndex] = useState(0);
  const [englishSelected, setEnglishSelected] = useState<number | null>(null);
  const [turkishSelected, setTurkishSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

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

  function resetAll() {
    stopSpeaking();
    setIndex(0);
    setEnglishSelected(null);
    setTurkishSelected(null);
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

  const isCorrect =
    englishSelected === exercise.englishCorrectIndex &&
    turkishSelected === exercise.turkishCorrectIndex;
  const canCheck =
    englishSelected !== null && turkishSelected !== null && !checked;
  const canRestart =
    index > 0 ||
    englishSelected !== null ||
    turkishSelected !== null ||
    checked;

  function handleCheck() {
    if (!canCheck) {
      return;
    }
    setChecked(true);
    if (
      englishSelected === exercise.englishCorrectIndex &&
      turkishSelected === exercise.turkishCorrectIndex
    ) {
      setCorrectCount((value) => value + 1);
    }
  }

  function handleNext() {
    if (index >= exercises.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setEnglishSelected(null);
    setTurkishSelected(null);
    setChecked(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-brand-500 dark:text-brand-400">
        {t("progress", { current: index + 1, total: exercises.length })}
      </p>

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
            <SpeechRateControl />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <OptionGroup
            label={t("listeningEnglishLabel")}
            options={exercise.englishOptions}
            selected={englishSelected}
            correctIndex={exercise.englishCorrectIndex}
            checked={checked}
            ariaLabel={t("listeningEnglishOptionsAria")}
            onSelect={setEnglishSelected}
          />
          <OptionGroup
            label={t("listeningTurkishLabel")}
            options={exercise.turkishOptions}
            selected={turkishSelected}
            correctIndex={exercise.turkishCorrectIndex}
            checked={checked}
            ariaLabel={t("listeningTurkishOptionsAria")}
            onSelect={setTurkishSelected}
          />
        </div>

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
            <Button type="button" disabled={!canCheck} onClick={handleCheck}>
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
