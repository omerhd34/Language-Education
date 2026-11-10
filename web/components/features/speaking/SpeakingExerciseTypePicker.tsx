"use client";

import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Disc3,
  Layers,
  PackageOpen,
  SpellCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export type SpeakingExercisePart =
  | "wheel"
  | "openBox"
  | "randomCards"
  | "anagram";

type SpeakingExerciseTypePickerProps = {
  available: SpeakingExercisePart[];
  counts: Partial<Record<SpeakingExercisePart, number>>;
  progressPercents: Partial<Record<SpeakingExercisePart, number>>;
  onSelect: (part: SpeakingExercisePart) => void;
};

const PART_ITEMS: {
  part: SpeakingExercisePart;
  titleKey: "typeWheel" | "typeOpenBox" | "typeRandomCards" | "typeAnagram";
  descKey:
    | "typeWheelDesc"
    | "typeOpenBoxDesc"
    | "typeRandomCardsDesc"
    | "typeAnagramDesc";
  Icon: typeof Disc3;
}[] = [
  {
    part: "wheel",
    titleKey: "typeWheel",
    descKey: "typeWheelDesc",
    Icon: Disc3,
  },
  {
    part: "openBox",
    titleKey: "typeOpenBox",
    descKey: "typeOpenBoxDesc",
    Icon: PackageOpen,
  },
  {
    part: "randomCards",
    titleKey: "typeRandomCards",
    descKey: "typeRandomCardsDesc",
    Icon: Layers,
  },
  {
    part: "anagram",
    titleKey: "typeAnagram",
    descKey: "typeAnagramDesc",
    Icon: SpellCheck,
  },
];

export function SpeakingExerciseTypePicker({
  available,
  counts,
  progressPercents,
  onSelect,
}: SpeakingExerciseTypePickerProps) {
  const t = useTranslations("Speaking");
  const availableSet = new Set(available);
  const visibleItems = PART_ITEMS.filter((item) => availableSet.has(item.part));

  return (
    <div className="w-full space-y-4">
      <div className="space-y-1">
        <h2 className="section-title">{t("chooseTypeTitle")}</h2>
        <p className="page-subtitle mt-0">{t("chooseTypeSubtitle")}</p>
      </div>

      <ul
        className="grid gap-3 sm:grid-cols-2"
        role="list"
        aria-label={t("typesAria")}
      >
        {visibleItems.map(({ part, titleKey, descKey, Icon }) => {
          const count = counts[part] ?? 0;
          const percent = Math.min(
            100,
            Math.max(0, Math.round(progressPercents[part] ?? 0)),
          );
          const done = percent >= 100;

          return (
            <li key={part}>
              <button
                type="button"
                onClick={() => onSelect(part)}
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
                    {t(descKey)}
                  </span>
                  <span className="block text-xs text-brand-500 dark:text-brand-500">
                    {t("itemCount", { count })}
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
