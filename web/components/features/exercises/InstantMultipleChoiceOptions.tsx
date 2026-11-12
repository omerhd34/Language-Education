"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

function optionLetter(index: number): string {
  return OPTION_LETTERS[index] ?? String(index + 1);
}

type InstantMultipleChoiceOptionsProps = {
  options: readonly string[];
  correctIndex: number;
  selected: number | null;
  revealed: boolean;
  onSelect: (optionIndex: number) => void;
  labelledBy?: string;
  optionsAriaLabel: string;
  className?: string;
};

export function InstantMultipleChoiceOptions({
  options,
  correctIndex,
  selected,
  revealed,
  onSelect,
  labelledBy,
  optionsAriaLabel,
  className,
}: InstantMultipleChoiceOptionsProps) {
  return (
    <div
      className={cn(
        "grid gap-2",
        options.length >= 2 ? "grid-cols-2" : "grid-cols-1",
        className,
      )}
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={optionsAriaLabel}
    >
      {options.map((option, optionIndex) => {
        const isSelected = selected === optionIndex;
        const isCorrect = optionIndex === correctIndex;
        const showCorrect = revealed && isCorrect;
        const showWrong = revealed && isSelected && !isCorrect;

        return (
          <button
            key={`${optionIndex}-${option}`}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${optionLetter(optionIndex)}. ${option}`}
            disabled={revealed}
            onClick={() => onSelect(optionIndex)}
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
                isSelected &&
                "border-brand-800/80 bg-brand-100/50 text-brand-950 ring-2 ring-brand-800/15 dark:border-brand-400 dark:bg-brand-900/60 dark:text-brand-100 dark:ring-brand-400/20",
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
                  isSelected &&
                  "bg-brand-800 text-white dark:bg-brand-400 dark:text-brand-950",
                !revealed &&
                  !isSelected &&
                  "bg-(--glass-2) text-brand-600 dark:text-brand-300",
              )}
            >
              {showCorrect ? (
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              ) : showWrong ? (
                <X className="size-3.5" strokeWidth={3} aria-hidden />
              ) : (
                optionLetter(optionIndex)
              )}
            </span>
            <span className="min-w-0 flex-1 leading-snug">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
