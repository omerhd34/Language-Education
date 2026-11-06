"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import type { StudiedTodayVocabularyWord } from "@/store/api";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDurationHms } from "@/lib/formatDuration";

type StudiedTodayWordRowProps = {
  word: StudiedTodayVocabularyWord;
  compact?: boolean;
};

export function StudiedTodayWordRow({
  word,
  compact = false,
}: StudiedTodayWordRowProps) {
  const t = useTranslations("Dashboard");
  const remainingMs = useCountdown(word.dueAt);

  return (
    <article className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-500/25 bg-sky-500/8 px-3 py-2.5 dark:border-sky-400/20 dark:bg-sky-400/10">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-base font-semibold tracking-tight text-brand-950 dark:text-brand-100">
            {word.en}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-sky-800 uppercase dark:text-sky-200">
            <BookOpen className="size-3" aria-hidden />
            {t("studiedTodayBadge")}
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
        <p className="mt-1 font-mono text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-200">
          {remainingMs > 0
            ? t("studiedTodayDue", { time: formatDurationHms(remainingMs) })
            : t("studiedTodayDueNow")}
        </p>
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
