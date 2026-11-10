"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TrueFalseChoiceButtonsProps = {
  trueLabel: string;
  falseLabel: string;
  trueCaption: string;
  falseCaption: string;
  selected: boolean | null;
  correctAnswer: boolean;
  revealed: boolean;
  onSelect: (value: boolean) => void;
  ariaLabel?: string;
};

export function TrueFalseChoiceButtons({
  trueLabel,
  falseLabel,
  trueCaption,
  falseCaption,
  selected,
  correctAnswer,
  revealed,
  onSelect,
  ariaLabel,
}: TrueFalseChoiceButtonsProps) {
  const options = [
    { value: true as const, letter: trueLabel, caption: trueCaption },
    { value: false as const, letter: falseLabel, caption: falseCaption },
  ];

  return (
    <div
      className="grid gap-2 sm:grid-cols-2"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map(({ value, letter, caption }) => {
        const isSelected = selected === value;
        const isCorrect = value === correctAnswer;
        const showCorrect = revealed && isCorrect;
        const showWrong = revealed && isSelected && !isCorrect;

        return (
          <button
            key={letter}
            type="button"
            disabled={revealed}
            aria-pressed={isSelected}
            aria-label={`${letter}. ${caption}`}
            onClick={() => onSelect(value)}
            className={cn(
              "flex w-full min-h-12 cursor-pointer items-center gap-3 rounded-full border px-3 py-2.5 text-left text-sm transition-colors duration-200",
              "disabled:cursor-default",
              showCorrect &&
                "reading-quiz-pop border-emerald-500/50 bg-emerald-500/10 text-emerald-900 motion-safe:animate-[reading-option-pop_0.45s_ease-out] dark:text-emerald-100",
              showWrong &&
                "reading-quiz-shake border-red-500/40 bg-red-500/10 text-red-900 motion-safe:animate-[reading-option-shake_0.45s_ease-in-out] dark:text-red-100",
              revealed &&
                showCorrect &&
                !isSelected &&
                "motion-safe:animate-[reading-option-pop_0.45s_ease-out_0.12s_both]",
              !revealed &&
                !isSelected &&
                "border-border bg-background/60 text-brand-800 hover:border-brand-400 dark:bg-brand-950/30 dark:text-brand-200",
            )}
          >
            <span
              className={cn(
                "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                showCorrect && "bg-emerald-600 text-white",
                showWrong && "bg-red-800 text-white",
                (showCorrect || showWrong) &&
                  "reading-quiz-icon-pop motion-safe:animate-[reading-icon-pop_0.35s_ease-out]",
                !revealed &&
                  "bg-(--glass-2) text-brand-600 dark:text-brand-300",
              )}
            >
              {showCorrect ? (
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              ) : showWrong ? (
                <X className="size-3.5" strokeWidth={3} aria-hidden />
              ) : (
                letter
              )}
            </span>
            <span className="min-w-0 flex-1 leading-snug">{caption}</span>
          </button>
        );
      })}
    </div>
  );
}
