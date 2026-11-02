"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import type { CefrLevel } from "@/data/dashboardTopics";
import {
  CEFR_LEVEL_FILTER_ACTIVE_CLASS,
  CEFR_LEVEL_FILTER_IDLE_CLASS,
  CEFR_LEVEL_ORDER,
  canAccessLevel,
} from "@/lib/topicAccess";
import { cn } from "@/lib/utils";

type TopicLevelFilterProps = {
  value: CefrLevel;
  onChange: (level: CefrLevel) => void;
};

export function TopicLevelFilter({ value, onChange }: TopicLevelFilterProps) {
  const t = useTranslations("Dashboard");

  return (
    <div
      role="tablist"
      aria-label={t("levelFilterAria")}
      className="flex flex-wrap gap-2"
    >
      {CEFR_LEVEL_ORDER.map((level) => {
        const unlocked = canAccessLevel(level);
        const selected = value === level;

        return (
          <button
            key={level}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(level)}
            className={cn(
              "inline-flex h-8 min-w-14 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[0.8rem] font-medium transition-colors",
              "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
              selected
                ? CEFR_LEVEL_FILTER_ACTIVE_CLASS[level]
                : CEFR_LEVEL_FILTER_IDLE_CLASS[level],
            )}
          >
            {!unlocked ? (
              <Lock className="size-3.5 shrink-0" aria-hidden />
            ) : null}
            {level}
          </button>
        );
      })}
    </div>
  );
}
