"use client";

import { useTranslations } from "next-intl";
import { BookOpen, ClipboardCheck, Timer } from "lucide-react";
import {
  useVocabularyLearnQuotaQuery,
  useVocabularyQuizQuery,
} from "@/store/api";
import { LevelStatusCard } from "@/components/features/dashboard/LevelStatusCard";
import { QuickContinueCard } from "@/components/features/dashboard/QuickContinueCard";
import {
  StartStudyTimerButton,
  useStudyCycleOpen,
} from "@/components/features/vocabulary/StartStudyTimerButton";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { usePathname, useRouter } from "@/i18n/navigation";
import { navigatePanelSection } from "@/hooks/usePanelHash";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDurationHms } from "@/lib/formatDuration";
import { cn } from "@/lib/utils";
import {
  BYPASS_LEARN_WORD_LOCK,
  LEARN_WORD_PERIOD_LIMIT,
} from "@/lib/vocabularyLimits";

export function DashboardStatsBar() {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const { data: quota } = useVocabularyLearnQuotaQuery();
  const { data: quiz } = useVocabularyQuizQuery();
  const dueCount = quiz?.dueCount ?? 0;
  const pending = quota?.pendingStudyCount ?? 0;
  const learnLimit =
    quota?.learnLimit ?? quota?.dailyLearnLimit ?? LEARN_WORD_PERIOD_LIMIT;
  const remainingMs = useCountdown(quota?.lockedUntil);
  const { open: cycleOpen, ready: cycleKnown } = useStudyCycleOpen();
  const startBlocked = cycleKnown && cycleOpen && pending > 0;
  const isLocked =
    !BYPASS_LEARN_WORD_LOCK && Boolean(quota?.lockedUntil) && remainingMs > 0;
  const quotaPercent =
    learnLimit > 0
      ? Math.min(100, Math.round((pending / learnLimit) * 100))
      : 0;
  const quotaLabel = t("wordTimerQuota", {
    selected: pending,
    limit: learnLimit,
  });

  return (
    <section
      aria-label={t("statsAria")}
      className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
    >
      <QuickContinueCard />
      <LevelStatusCard />

      <article className="dashboard-panel dashboard-panel--stat md:col-span-2 xl:col-span-1">
        <div className="flex items-start justify-between gap-3">
          <p className="dashboard-panel__label text-base">
            <Timer className="size-4" aria-hidden />
            {t("wordTimer")}
          </p>
          <p className="font-display text-2xl font-semibold text-brand-950 tabular-nums dark:text-brand-100">
            {pending}
            <span className="font-medium text-brand-400">/{learnLimit}</span>
          </p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted dark:bg-white/10"
          role="progressbar"
          aria-valuenow={pending}
          aria-valuemin={0}
          aria-valuemax={learnLimit}
          aria-label={quotaLabel}
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-300",
              isLocked ? "bg-amber-500" : "bg-brand-800 dark:bg-brand-100",
            )}
            style={{ width: `${quotaPercent}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-brand-950 dark:text-brand-100">
          {quotaLabel}
        </p>
        <div className="mt-1 space-y-1">
          {isLocked ? (
            <p className="font-mono text-xs font-semibold text-amber-800 tabular-nums dark:text-amber-200">
              {t("wordTimerRemaining", {
                time: formatDurationHms(remainingMs),
              })}
            </p>
          ) : null}
          {startBlocked ? (
            <p className="text-xs text-brand-600 dark:text-brand-400">
              {t("studyTimerBlockedShort")}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <StartStudyTimerButton />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const onPanel = pathname === "/panel" || pathname === "/";
              if (onPanel) {
                navigatePanelSection("kelimeler");
                return;
              }
              router.push("/panel#kelimeler");
            }}
          >
            <BookOpen className="size-3.5" aria-hidden />
            {t("selectWord")}
          </Button>
          {dueCount > 0 ? (
            <ButtonLink href="/panel/kelime/sinav" size="sm">
              <ClipboardCheck className="size-3.5" aria-hidden />
              {t("quizCardCta")}
            </ButtonLink>
          ) : null}
        </div>
      </article>
    </section>
  );
}
