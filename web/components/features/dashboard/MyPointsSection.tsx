"use client";

import { useTranslations } from "next-intl";
import { Award, CalendarDays, CalendarRange, Sun } from "lucide-react";

const PERIODS = [
  {
    key: "daily",
    labelKey: "daily",
    hintKey: "myPointsDailyHint",
    Icon: Sun,
    value: 0,
  },
  {
    key: "weekly",
    labelKey: "weekly",
    hintKey: "myPointsWeeklyHint",
    Icon: CalendarDays,
    value: 0,
  },
  {
    key: "monthly",
    labelKey: "monthly",
    hintKey: "myPointsMonthlyHint",
    Icon: CalendarRange,
    value: 0,
  },
] as const;

export function MyPointsSection() {
  const t = useTranslations("Dashboard");

  return (
    <section
      aria-labelledby="my-points-heading"
      className="dashboard-panel dashboard-panel--stat space-y-5 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200"
          aria-hidden
        >
          <Award className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h2
            id="my-points-heading"
            className="font-display text-xl font-semibold tracking-tight text-brand-950 dark:text-brand-100"
          >
            {t("myPoints")}
          </h2>
          <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">
            {t("myPointsSubtitle")}
          </p>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {PERIODS.map(({ key, labelKey, hintKey, Icon, value }) => (
          <div
            key={key}
            className="flex flex-col rounded-2xl border border-border/70 bg-surface-muted/70 px-4 py-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center justify-between gap-2">
              <dt className="text-xs font-semibold tracking-[0.08em] text-brand-600 uppercase dark:text-brand-400">
                {t(labelKey)}
              </dt>
              <Icon
                className="size-4 text-brand-500 dark:text-brand-400"
                aria-hidden
              />
            </div>
            <dd className="mt-3 font-display text-4xl font-semibold tracking-tight text-brand-950 tabular-nums dark:text-brand-50">
              {value}
            </dd>
            <p className="mt-2 text-xs text-brand-500 dark:text-brand-400">
              {t(hintKey)}
            </p>
          </div>
        ))}
      </dl>
    </section>
  );
}
