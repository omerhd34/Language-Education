"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import type { StudiedTodayVocabularyWord } from "@/store/api";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDurationHms } from "@/lib/formatDuration";

type StudiedTodayWordRowProps = {
  word: Pick<
    StudiedTodayVocabularyWord,
    "en" | "tr" | "categoryId" | "categoryTitle"
  > & {
    dueAt?: string;
    examReady?: boolean;
  };
  compact?: boolean;
};

export function StudiedTodayWordRow({
  word,
  compact = false,
}: StudiedTodayWordRowProps) {
  const t = useTranslations("Dashboard");
  const remainingMs = useCountdown(word.dueAt ?? null);
  const examReady = Boolean(word.examReady);
  const waitingForTimer = !word.dueAt && !examReady;

  return (
    <article
      className={
        examReady
          ? "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 dark:border-emerald-400/25 dark:bg-emerald-400/10"
          : waitingForTimer
            ? "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2.5 dark:border-amber-400/20 dark:bg-amber-400/10"
            : "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-500/25 bg-sky-500/8 px-3 py-2.5 dark:border-sky-400/20 dark:bg-sky-400/10"
      }
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-semibold tracking-tight text-brand-950 dark:text-brand-100">
            {word.en}
          </h3>
          <span
            className={
              examReady
                ? "inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-200"
                : waitingForTimer
                  ? "inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-800 uppercase dark:text-amber-200"
                  : "inline-flex items-center gap-1 rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-sky-800 uppercase dark:text-sky-200"
            }
          >
            <BookOpen className="size-3" aria-hidden />
            {examReady
              ? t("studiedTodayReadyBadge")
              : waitingForTimer
                ? t("studiedTodayPendingBadge")
                : t("studiedTodayBadge")}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-brand-600 dark:text-brand-400">
          {word.tr}
        </p>
        {!compact ? (
          <p className="mt-1 text-xs text-brand-500 dark:text-brand-400">
            {word.categoryTitle}
          </p>
        ) : null}
        {examReady ? (
          <p className="mt-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
            {t("studiedTodayDueNow")}
          </p>
        ) : word.dueAt ? (
          <p className="mt-1 font-mono text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-200">
            {remainingMs > 0
              ? t("studiedTodayDue", { time: formatDurationHms(remainingMs) })
              : t("studiedTodayDueNow")}
          </p>
        ) : null}
      </div>
      <ButtonLink
        href={`/panel/kelime/${word.categoryId}`}
        size="sm"
        variant="outline"
      >
        {t("knownWordsOpenCategory")}
      </ButtonLink>
    </article>
  );
}
