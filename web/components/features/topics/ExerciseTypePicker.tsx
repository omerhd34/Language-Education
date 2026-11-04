"use client";

import { useTranslations } from "next-intl";
import { CircleHelp, Grid3x3, Headphones, TextCursorInput } from "lucide-react";
import type { ExerciseType } from "@/data/topics/types";
import { cn } from "@/lib/utils";

type ExerciseTypePickerProps = {
  counts: Record<ExerciseType, number>;
  onSelect: (type: ExerciseType) => void;
};

const TYPE_ITEMS: {
  type: ExerciseType;
  titleKey:
    | "typeMultipleChoice"
    | "typeFillBlank"
    | "typeCrossword"
    | "typeListening";
  descKey:
    | "typeMultipleChoiceDesc"
    | "typeFillBlankDesc"
    | "typeCrosswordDesc"
    | "typeListeningDesc";
  Icon: typeof CircleHelp;
}[] = [
  {
    type: "multiple_choice",
    titleKey: "typeMultipleChoice",
    descKey: "typeMultipleChoiceDesc",
    Icon: CircleHelp,
  },
  {
    type: "fill_blank",
    titleKey: "typeFillBlank",
    descKey: "typeFillBlankDesc",
    Icon: TextCursorInput,
  },
  {
    type: "crossword",
    titleKey: "typeCrossword",
    descKey: "typeCrosswordDesc",
    Icon: Grid3x3,
  },
  {
    type: "listening",
    titleKey: "typeListening",
    descKey: "typeListeningDesc",
    Icon: Headphones,
  },
];

export function ExerciseTypePicker({
  counts,
  onSelect,
}: ExerciseTypePickerProps) {
  const t = useTranslations("Topic");
  const visibleItems = TYPE_ITEMS.filter((item) => counts[item.type] > 0);

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
          {t("chooseTypeTitle")}
        </h2>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("chooseTypeSubtitle")}
        </p>
      </div>

      <ul
        className="grid gap-3 sm:grid-cols-2"
        role="list"
        aria-label={t("typesAria")}
      >
        {visibleItems.map(({ type, titleKey, descKey, Icon }) => {
          const count = counts[type];
          const countLabel =
            type === "crossword"
              ? t("puzzleCount", { count })
              : t("questionCount", { count });

          return (
            <li key={type}>
              <button
                type="button"
                onClick={() => onSelect(type)}
                className={cn(
                  "flex h-full w-full cursor-pointer flex-col gap-3 rounded-xl border border-border bg-background/50 p-4 text-left transition-colors",
                  "hover:border-sky-500/70 hover:bg-sky-500/5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                  "dark:bg-brand-950/40",
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
                  <span className="block text-xs text-brand-500 dark:text-brand-500">
                    {countLabel}
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
