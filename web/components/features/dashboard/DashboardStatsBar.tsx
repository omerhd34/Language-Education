"use client";

import { useTranslations } from "next-intl";
import { Bell, Radio, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

const UNREAD_NOTIFICATIONS = 3;

export function DashboardStatsBar() {
  const t = useTranslations("Dashboard");

  return (
    <section
      aria-label={t("statsAria")}
      className="grid gap-3 xl:grid-cols-[1.1fr_1.2fr_0.9fr_1.3fr]"
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
        <p className="dashboard-panel__label">{t("achievements")}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <Trophy className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-950 dark:text-brand-100">
              {t("leader")}
            </p>
            <p className="text-xs text-brand-400">{t("leaderHint")}</p>
          </div>
        </div>
      </article>

      <article className="dashboard-panel grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="dashboard-panel__label">
            <Timer className="size-3.5" aria-hidden />
            {t("wordTimer")}
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3">
            {t("selectWord")}
          </Button>
        </div>

        <div className="flex flex-col items-start sm:items-end">
          <p className="dashboard-panel__label">
            <Bell className="size-3.5" aria-hidden />
            {t("notifications")}
          </p>
          <span className="bar-badged mt-3">
            <button
              type="button"
              className="relative inline-flex size-12 items-center justify-center rounded-xl border border-border bg-surface-muted text-brand-800 transition-colors hover:bg-muted dark:bg-brand-900 dark:text-brand-100 dark:hover:bg-brand-800"
              aria-label={t("notifications")}
            >
              <Bell className="size-5" strokeWidth={1.75} aria-hidden />
            </button>
            {UNREAD_NOTIFICATIONS > 0 ? (
              <>
                <span className="bar-badge" aria-hidden="true">
                  {UNREAD_NOTIFICATIONS}
                </span>
                <span className="sr-only">
                  {t("unreadNotifications", { count: UNREAD_NOTIFICATIONS })}
                </span>
              </>
            ) : null}
          </span>
        </div>
      </article>
    </section>
  );
}
