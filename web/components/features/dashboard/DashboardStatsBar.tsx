"use client";

import { useTranslations } from "next-intl";
import { Radio, Timer } from "lucide-react";
import { useVocabularyLearnQuotaQuery } from "@/store/api";
import { NotificationsMenu } from "@/components/features/dashboard/NotificationsMenu";
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
  const learnLimit =
    quota?.learnLimit ?? quota?.dailyLearnLimit ?? LEARN_WORD_PERIOD_LIMIT;
  const remainingMs = useCountdown(quota?.lockedUntil);
  const isLocked =
    !BYPASS_LEARN_WORD_LOCK && Boolean(quota?.lockedUntil) && remainingMs > 0;

  return (
    <section
      aria-label={t("statsAria")}
      className="grid gap-3 xl:grid-cols-[1fr_1.2fr_1.65fr]"
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

      <article className="dashboard-panel grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="dashboard-panel__label">
            <Timer className="size-3.5" aria-hidden />
            {t("wordTimer")}
          </p>
          <p className="mt-2 text-sm font-medium text-brand-950 dark:text-brand-100">
            {t("wordTimerQuota", { selected, limit: learnLimit })}
          </p>
          {isLocked ? (
            <p className="mt-1 font-mono text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-200">
              {t("wordTimerRemaining", {
                time: formatDurationHms(remainingMs),
              })}
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => navigatePanelSection("kelimeler")}
          >
            {t("selectWord")}
          </Button>
        </div>

        <NotificationsMenu />
      </article>
    </section>
  );
}
