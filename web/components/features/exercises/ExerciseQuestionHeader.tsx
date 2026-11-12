"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ExerciseHintFallbackKey } from "@/components/features/exercises/exerciseHintFallbacks";
import { cn } from "@/lib/utils";

type ExerciseQuestionHeaderProps = {
  number?: number;
  title?: ReactNode;
  hint?: string | null;
  fallbackKey?: ExerciseHintFallbackKey;
  actions?: ReactNode;
  headingAddon?: ReactNode;
  compactTitle?: boolean;
  showHint?: boolean;
  headingId?: string;
  className?: string;
  titleVariant?: "section" | "prompt";
};

export function ExerciseQuestionHeader({
  number,
  title,
  hint,
  fallbackKey,
  actions,
  headingAddon,
  compactTitle = false,
  showHint = true,
  headingId,
  className,
  titleVariant = "section",
}: ExerciseQuestionHeaderProps) {
  const t = useTranslations("Exercises");
  const [open, setOpen] = useState(false);

  const hintText =
    hint?.trim() || (fallbackKey ? t(`hintFallback.${fallbackKey}`) : "");

  const hasTitle = title != null && title !== "";
  const hasHeading = number !== undefined || hasTitle || headingAddon != null;

  const usePromptTitle =
    titleVariant === "prompt" || number !== undefined || headingAddon != null;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "flex justify-between gap-3",
          compactTitle && number === undefined && hasTitle
            ? "items-center"
            : "items-start",
          !hasHeading && "justify-end",
        )}
      >
        {hasHeading ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
            {number !== undefined ? (
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-(--glass-2) text-sm font-semibold text-brand-800 dark:text-brand-200">
                {number}
              </span>
            ) : null}
            {headingAddon}
            {hasTitle ? (
              <div
                id={headingId}
                className={cn(
                  "min-w-0 flex-1 wrap-break-word text-pretty",
                  compactTitle &&
                    typeof title === "string" &&
                    "text-base font-medium text-brand-800 dark:text-brand-200",
                  !compactTitle &&
                    "section-title text-brand-950 dark:text-brand-100",
                )}
                style={
                  !compactTitle && usePromptTitle
                    ? { fontSize: 19, lineHeight: 1.35 }
                    : undefined
                }
              >
                {title}
              </div>
            ) : null}
          </div>
        ) : null}
        {actions || showHint ? (
          <div className="flex shrink-0 flex-wrap items-start justify-end gap-2">
            {actions}
            {showHint ? (
              <Button
                type="button"
                size="sm"
                variant={open ? "default" : "outline"}
                className="border-sky-500/50 text-sky-700 dark:border-sky-400/40 dark:text-sky-300"
                aria-expanded={open}
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen((value) => !value);
                }}
              >
                <Lightbulb className="size-4" aria-hidden />
                {t("hint")}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      {showHint && open ? (
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
