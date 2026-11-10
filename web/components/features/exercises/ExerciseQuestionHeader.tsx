"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ExerciseHintFallbackKey } from "@/components/features/exercises/exerciseHintFallbacks";
import { cn } from "@/lib/utils";

type ExerciseQuestionHeaderProps = {
  number?: number;
  title: ReactNode;
  hint?: string | null;
  fallbackKey?: ExerciseHintFallbackKey;
  actions?: ReactNode;
  headingId?: string;
  className?: string;
};

export function ExerciseQuestionHeader({
  number,
  title,
  hint,
  fallbackKey,
  actions,
  headingId,
  className,
}: ExerciseQuestionHeaderProps) {
  const t = useTranslations("Exercises");
  const [open, setOpen] = useState(false);

  const hintText =
    hint?.trim() || (fallbackKey ? t(`hintFallback.${fallbackKey}`) : "");

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {number !== undefined ? (
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-(--glass-2) text-sm font-semibold text-brand-800 dark:text-brand-200">
              {number}
            </span>
          ) : null}
          <div
            id={headingId}
            className={cn(
              "min-w-0 flex-1 text-brand-950 dark:text-brand-100",
              number === undefined
                ? "section-title"
                : "pt-0.5 text-base font-semibold",
            )}
          >
            {title}
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {actions}
          <Button
            type="button"
            size="sm"
            variant={open ? "default" : "outline"}
            className="border-sky-500/50 text-sky-700 dark:border-sky-400/40 dark:text-sky-300"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Lightbulb className="size-4" aria-hidden />
            {t("hint")}
          </Button>
        </div>
      </div>
      {open ? (
        <div
          role="note"
          className="flex gap-3 rounded-2xl border border-orange-300/60 bg-orange-100/95 px-4 py-3 text-sm leading-relaxed text-orange-950 dark:border-orange-700/45 dark:bg-orange-950/40 dark:text-orange-50"
        >
          <Lightbulb
            className="mt-0.5 size-5 shrink-0 text-orange-600 dark:text-orange-400"
            aria-hidden
          />
          <p className="min-w-0 flex-1">{hintText}</p>
        </div>
      ) : null}
    </div>
  );
}
