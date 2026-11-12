"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type ExercisePercentBadgeProps = {
  percent: number;
  ariaLabel?: string;
};

export function ExercisePercentBadge({
  percent,
  ariaLabel,
}: ExercisePercentBadgeProps) {
  const t = useTranslations("Topic");
  const value = Math.min(100, Math.max(0, Math.round(percent)));
  const done = value >= 100;

  return (
    <Badge
      variant="outline"
      aria-label={ariaLabel ?? t("typeProgressAria", { percent: value })}
      className={cn(
        "shrink-0 tabular-nums",
        done
          ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
          : value > 0
            ? "border-sky-500/40 text-sky-700 dark:text-sky-300"
            : "text-brand-500 dark:text-brand-400",
      )}
    >
      {t("typeProgressBadge", { percent: value })}
    </Badge>
  );
}
