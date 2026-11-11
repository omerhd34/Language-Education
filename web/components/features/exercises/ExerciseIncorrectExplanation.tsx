"use client";

import { cn } from "@/lib/utils";

type ExerciseIncorrectExplanationProps = {
  show: boolean;
  explanation?: string | null;
  className?: string;
};

export function ExerciseIncorrectExplanation({
  show,
  explanation,
  className,
}: ExerciseIncorrectExplanationProps) {
  const text = explanation?.trim();
  if (!show || !text) {
    return null;
  }

  return (
    <p
      role="status"
      className={cn(
        "rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2.5 text-sm text-pretty text-brand-900 dark:text-brand-100",
        className,
      )}
    >
      {text}
    </p>
  );
}
