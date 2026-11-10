"use client";

import { useTranslations } from "next-intl";
import { BookOpen, ClipboardCheck, Timer } from "lucide-react";
import {
  useVocabularyLearnQuotaQuery,
  useVocabularyQuizQuery,
} from "@/store/api";
import { DashboardStatPanelHeader } from "@/components/features/dashboard/DashboardStatPanelHeader";
import { DashboardStatProgressBar } from "@/components/features/dashboard/DashboardStatProgressBar";
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
        <DashboardStatPanelHeader>
          <p className="dashboard-panel__label text-base">
            <Timer className="size-4" aria-hidden />
            {t("wordTimer")}
          </p>
        </DashboardStatPanelHeader>
        <DashboardStatProgressBar
          value={pending}
          max={learnLimit}
          ariaLabel={quotaLabel}
          fillVariant={isLocked ? "warning" : "default"}
          inlineEndLabel={
            <>
              {pending}
              <span className="font-medium text-brand-700 dark:text-brand-300">
                /{learnLimit}
              </span>
            </>
          }
        />
        <div className="mt-2 space-y-1">
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
                navigatePanelSection("words");
                return;
              }
              router.push("/panel#vocabulary");
            }}
          >
            <BookOpen className="size-3.5" aria-hidden />
            {t("selectWord")}
          </Button>
          {dueCount > 0 ? (
            <ButtonLink href="/panel/vocabulary/exam" size="sm">
              <ClipboardCheck className="size-3.5" aria-hidden />
              {t("quizCardCta")}
            </ButtonLink>
          ) : null}
        </div>
      </article>
    </section>
  );
}
