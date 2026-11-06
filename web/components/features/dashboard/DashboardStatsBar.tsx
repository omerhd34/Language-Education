"use client";

import { useTranslations } from "next-intl";
import { Radio, Timer } from "lucide-react";
import { useVocabularyLearnQuotaQuery } from "@/store/api";
import { NotificationsMenu } from "@/components/features/dashboard/NotificationsMenu";
import { StartStudyTimerButton } from "@/components/features/vocabulary/StartStudyTimerButton";
import { Button } from "@/components/ui/Button";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDurationHms } from "@/lib/formatDuration";
import {
  BYPASS_LEARN_WORD_LOCK,
  LEARN_WORD_PERIOD_LIMIT,
} from "@/lib/vocabularyLimits";

export function DashboardStatsBar() {
  const t = useTranslations("Dashboard");
  const { data: quota } = useVocabularyLearnQuotaQuery();
  const selected =
    quota?.learningSelectedInPeriod ?? quota?.learningSelectedToday ?? 0;
  const pending = quota?.pendingStudyCount ?? 0;
  const learnLimit =
    quota?.learnLimit ?? quota?.dailyLearnLimit ?? LEARN_WORD_PERIOD_LIMIT;
  const remainingMs = useCountdown(quota?.lockedUntil);
  const isLocked =
    !BYPASS_LEARN_WORD_LOCK && Boolean(quota?.lockedUntil) && remainingMs > 0;

  return (
    <section
      aria-label={t("statsAria")}
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1.15fr_1.35fr_11rem]"
    >
      <article className="dashboard-panel">
        <p className="dashboard-panel__label">
          <Radio className="size-3.5 text-amber-500" aria-hidden />
          {t("liveStats")}
        </p>
        <p className="mt-3 text-xs text-brand-400">{t("totalSolved")}</p>
        <p className="mt-1 font-display text-3xl font-semibold tracking-tight text-brand-950 dark:text-brand-100">
          0
        </p>
      </article>

      <article className="dashboard-panel">
        <p className="dashboard-panel__label">{t("myPoints")}</p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <dt className="text-[11px] text-brand-400">{t("daily")}</dt>
            <dd className="mt-1 text-lg font-semibold text-brand-950 dark:text-brand-100">
              0
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-brand-400">{t("weekly")}</dt>
            <dd className="mt-1 text-lg font-semibold text-brand-950 dark:text-brand-100">
              0
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-brand-400">{t("monthly")}</dt>
            <dd className="mt-1 text-lg font-semibold text-brand-950 dark:text-brand-100">
              0
            </dd>
          </div>
        </dl>
      </article>

      <article className="dashboard-panel">
        <p className="dashboard-panel__label">
          <Timer className="size-3.5" aria-hidden />
          {t("wordTimer")}
        </p>
        <p className="mt-2 text-sm font-medium text-brand-950 dark:text-brand-100">
          {t("wordTimerQuota", { selected, limit: learnLimit })}
        </p>
        {pending > 0 ? (
          <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">
            {t("studyTimerPending", { count: pending })}
          </p>
        ) : null}
        {isLocked ? (
          <p className="mt-1 font-mono text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-200">
            {t("wordTimerRemaining", {
              time: formatDurationHms(remainingMs),
            })}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StartStudyTimerButton />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigatePanelSection("kelimeler")}
          >
            {t("selectWord")}
          </Button>
        </div>
      </article>

      <article className="dashboard-panel">
        <NotificationsMenu />
      </article>
    </section>
  );
}
