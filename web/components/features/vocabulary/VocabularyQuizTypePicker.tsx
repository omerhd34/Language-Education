"use client";

import { useTranslations } from "next-intl";
import { CircleHelp, Headphones, TextCursorInput } from "lucide-react";
import type { VocabularyQuizType } from "@/lib/vocabulary/generateQuizQuestions";
import { cn } from "@/lib/utils";

type VocabularyQuizTypePickerProps = {
  counts: Record<VocabularyQuizType, number>;
  onSelect: (type: VocabularyQuizType) => void;
};

const TYPE_ITEMS: {
  type: VocabularyQuizType;
  titleKey:
    | "quizTypeMultipleChoice"
    | "quizTypeFillBlank"
    | "quizTypeListening";
  descKey:
    | "quizTypeMultipleChoiceDesc"
    | "quizTypeFillBlankDesc"
    | "quizTypeListeningDesc";
  Icon: typeof CircleHelp;
}[] = [
  {
    type: "multiple_choice",
    titleKey: "quizTypeMultipleChoice",
    descKey: "quizTypeMultipleChoiceDesc",
    Icon: CircleHelp,
  },
  {
    type: "fill_blank",
    titleKey: "quizTypeFillBlank",
    descKey: "quizTypeFillBlankDesc",
    Icon: TextCursorInput,
  },
  {
    type: "listening",
    titleKey: "quizTypeListening",
    descKey: "quizTypeListeningDesc",
    Icon: Headphones,
  },
];

export function VocabularyQuizTypePicker({
  counts,
  onSelect,
}: VocabularyQuizTypePickerProps) {
  const t = useTranslations("Vocabulary");

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h2 className="section-title">
          {t("quizChooseTypeTitle")}
        </h2>
        <p className="page-subtitle mt-0">
          {t("quizChooseTypeSubtitle")}
        </p>
      </div>

      <ul
        className="grid gap-3 sm:grid-cols-3"
        role="list"
        aria-label={t("quizTypesAria")}
      >
        {TYPE_ITEMS.map(({ type, titleKey, descKey, Icon }) => {
          const count = counts[type];
          const disabled = count <= 0;

          return (
            <li key={type}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelect(type)}
                className={cn(
                  "flex h-full w-full flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                  disabled
                    ? "cursor-not-allowed border-border/60 bg-brand-100/50 opacity-60 dark:bg-brand-900/30"
                    : "cursor-pointer border-border bg-background/50 hover:border-sky-500/70 hover:bg-sky-500/5 dark:bg-brand-950/40",
                )}
              >
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="space-y-1">
                  <span className="block font-display text-base font-semibold text-brand-950 dark:text-brand-100">
                    {t(titleKey)}
                  </span>
                  <span className="block text-sm text-brand-600 dark:text-brand-400">
                    {t(descKey)}
                  </span>
                  <span className="block text-xs text-brand-500">
                    {disabled
                      ? t("quizTypeComplete")
                      : t("quizQuestionCount", { count })}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
