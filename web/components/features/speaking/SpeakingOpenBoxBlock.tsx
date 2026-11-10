"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { SpeakingTimedMicControl } from "@/components/features/speaking/SpeakingTimedMicControl";
import type { SpeakingOpenBoxExercise } from "@/data/speakings/types";
import { cn } from "@/lib/utils";

type SpeakingOpenBoxBlockProps = {
  exercise: SpeakingOpenBoxExercise;
  openedIds: ReadonlySet<string>;
  completedIds: ReadonlySet<string>;
  onOpen: (id: string) => void;
  onMarkComplete: (id: string) => void;
};

export function SpeakingOpenBoxBlock({
  exercise,
  openedIds: _openedIds,
  completedIds,
  onOpen,
  onMarkComplete,
}: SpeakingOpenBoxBlockProps) {
  const t = useTranslations("Speaking");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected =
    exercise.items.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("openBoxProgress", {
          done: completedIds.size,
          total: exercise.items.length,
        })}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6">
        {exercise.items.map((item, index) => {
          const done = completedIds.has(item.id);
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center text-sm font-semibold transition-colors",
                done
                  ? "border-red-500/50 bg-red-500/12 text-red-800 dark:border-red-400/45 dark:bg-red-500/15 dark:text-red-200"
                  : isSelected
                    ? "border-sky-500/50 bg-sky-500/12 text-brand-900 ring-2 ring-sky-500/35 dark:text-brand-100"
                    : "border-border bg-card text-brand-700 hover:border-sky-500/30 hover:bg-sky-500/5 dark:text-brand-300",
              )}
              onClick={() => {
                onOpen(item.id);
                setSelectedId(item.id);
              }}
            >
              {done ? (
                <Check className="size-5" aria-hidden />
              ) : (
                <span className="text-lg tabular-nums">{index + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {selected && !completedIds.has(selected.id) ? (
        <div className="dashboard-panel space-y-3 p-4">
          <div className="space-y-0.5">
            <p className="text-base font-medium text-brand-800 dark:text-brand-200">
              {selected.prompt}
            </p>
            {selected.promptTr ? (
              <p className="text-sm text-brand-500 italic dark:text-brand-400">
                {selected.promptTr}
              </p>
            ) : null}
          </div>
          {!completedIds.has(selected.id) ? (
            <SpeakingTimedMicControl
              sessionKey={selected.id}
              onRequirementMet={() => onMarkComplete(selected.id)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
