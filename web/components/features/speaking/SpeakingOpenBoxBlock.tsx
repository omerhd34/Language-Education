"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
  openedIds,
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
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {exercise.items.map((item, index) => {
          const opened = openedIds.has(item.id);
          const done = completedIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex min-h-16 flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center text-sm font-semibold transition-colors",
                done
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                  : opened
                    ? "border-sky-500/40 bg-sky-500/10 text-brand-800 dark:text-brand-200"
                    : "border-border bg-card text-brand-700 hover:border-sky-500/30 hover:bg-sky-500/5 dark:text-brand-300",
                selectedId === item.id && "ring-2 ring-sky-500/50",
              )}
              onClick={() => {
                onOpen(item.id);
                setSelectedId(item.id);
              }}
            >
              {done ? (
                <Check className="size-5" aria-hidden />
              ) : opened ? (
                <span className="line-clamp-3 text-xs font-medium normal-case">
                  {item.prompt}
                </span>
              ) : (
                <span className="text-lg tabular-nums">{index + 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {selected && openedIds.has(selected.id) ? (
        <div className="dashboard-panel space-y-3 p-4">
          <p className="text-base font-medium text-brand-800 dark:text-brand-200">
            {selected.prompt}
          </p>
          {selected.promptTr ? (
            <p className="text-sm text-brand-500 italic dark:text-brand-400">
              {selected.promptTr}
            </p>
          ) : null}
          {!completedIds.has(selected.id) ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onMarkComplete(selected.id)}
            >
              <Check className="size-4" aria-hidden />
              {t("markSpoken")}
            </Button>
          ) : (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {t("topicDone")}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
