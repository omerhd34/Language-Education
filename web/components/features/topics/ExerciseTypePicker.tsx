"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  CircleHelp,
  Grid3x3,
  Headphones,
  Layers,
  Link2,
  TextCursorInput,
  ToggleRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { ExerciseType } from "@/data/topics/types";
import { cn } from "@/lib/utils";

type ExerciseTypePickerProps = {
  counts: Record<ExerciseType, number>;
  completedTypes?: readonly ExerciseType[];
  progressPercents?: Partial<Record<ExerciseType, number>>;
  completeAt?: number;
  onSelect: (type: ExerciseType) => void;
  title?: string;
  subtitle?: string;
};

const TYPE_ITEMS: {
  type: ExerciseType;
  titleKey:
    | "typeMultipleChoice"
    | "typeTrueFalse"
    | "typeFillBlank"
    | "typeCrossword"
    | "typeListening"
    | "typeMatching"
    | "typeMixedPractice";
  descKey:
    | "typeMultipleChoiceDesc"
    | "typeTrueFalseDesc"
    | "typeFillBlankDesc"
    | "typeCrosswordDesc"
    | "typeListeningDesc"
    | "typeMatchingDesc"
    | "typeMixedPracticeDesc";
  Icon: typeof CircleHelp;
}[] = [
  {
    type: "mixed",
    titleKey: "typeMixedPractice",
    descKey: "typeMixedPracticeDesc",
    Icon: Layers,
  },
  {
    type: "multiple_choice",
    titleKey: "typeMultipleChoice",
    descKey: "typeMultipleChoiceDesc",
    Icon: CircleHelp,
  },
  {
    type: "true_false",
    titleKey: "typeTrueFalse",
    descKey: "typeTrueFalseDesc",
    Icon: ToggleRight,
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
  {
    type: "matching",
    titleKey: "typeMatching",
    descKey: "typeMatchingDesc",
    Icon: Link2,
  },
];

export function ExerciseTypePicker({
  counts,
  completedTypes = [],
  progressPercents,
  completeAt = 100,
  onSelect,
  title,
  subtitle,
}: ExerciseTypePickerProps) {
  const t = useTranslations("Topic");
  const visibleItems = TYPE_ITEMS.filter((item) => counts[item.type] > 0);
  const completedSet = new Set(completedTypes);
  const gridColsClass =
    visibleItems.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h2 className="section-title">{title ?? t("chooseTypeTitle")}</h2>
        <p className="page-subtitle mt-0">
          {subtitle ?? t("chooseTypeSubtitle")}
        </p>
      </div>

      <ul
        className={cn("grid gap-3", gridColsClass)}
        role="list"
        aria-label={t("typesAria")}
      >
        {visibleItems.map(({ type, titleKey, descKey, Icon }) => {
          const count = counts[type];
          const countLabel = t("questionCount", { count });
          const percent = Math.min(
            completeAt,
            Math.max(
              0,
              Math.round(
                progressPercents?.[type] ??
                  (completedSet.has(type) ? completeAt : 0),
              ),
            ),
          );
          const done = percent >= completeAt;

          return (
            <li key={type}>
              <button
                type="button"
                onClick={() => onSelect(type)}
                className={cn(
                  "flex h-full w-full cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                  done
                    ? "border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-500/70 hover:bg-emerald-500/15 dark:bg-emerald-950/30"
                    : "border-border bg-background/50 hover:border-sky-500/70 hover:bg-sky-500/5 dark:bg-brand-950/40",
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-lg",
                      done
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : "bg-sky-500/10 text-sky-700 dark:text-sky-300",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="size-5" aria-hidden />
                    ) : (
                      <Icon className="size-5" aria-hidden />
                    )}
                  </span>
                  <Badge
                    variant="outline"
                    aria-label={t("typeProgressAria", { percent })}
                    className={cn(
                      "tabular-nums",
                      done
                        ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                        : percent > 0
                          ? "border-sky-500/40 text-sky-700 dark:text-sky-300"
                          : "text-brand-500 dark:text-brand-400",
                    )}
                  >
                    {t("typeProgressBadge", { percent })}
                  </Badge>
                </span>
                <span className="space-y-1">
                  <span className="block font-display text-base font-semibold text-brand-950 dark:text-brand-100">
                    {t(titleKey)}
                  </span>
                  <span className="block text-sm text-brand-600 dark:text-brand-400">
                    {done ? t("typeCompletedDesc") : t(descKey)}
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
