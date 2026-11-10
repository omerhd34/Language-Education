"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, RotateCcw, Shuffle, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type {
  SpeakingPromptItem,
  SpeakingRandomCardsExercise,
} from "@/data/speakings/types";
import { cn } from "@/lib/utils";

function shuffleItems<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = next[i];
    next[i] = next[j] as T;
    next[j] = tmp as T;
  }
  return next;
}

type SpeakingRandomCardsBlockProps = {
  exercise: SpeakingRandomCardsExercise;
  completedIds: ReadonlySet<string>;
  onMarkComplete: (id: string) => void;
};

export function SpeakingRandomCardsBlock({
  exercise,
  completedIds,
  onMarkComplete,
}: SpeakingRandomCardsBlockProps) {
  const t = useTranslations("Speaking");
  const [deck, setDeck] = useState<SpeakingPromptItem[]>(() =>
    shuffleItems(exercise.items),
  );
  const [dealt, setDealt] = useState<SpeakingPromptItem[]>([]);
  const [active, setActive] = useState<SpeakingPromptItem | null>(null);

  const remainingInDeck = deck.length;

  const reshuffle = useCallback(() => {
    const notDone = exercise.items.filter(
      (item) => !completedIds.has(item.id),
    );
    setDeck(shuffleItems(notDone.length > 0 ? notDone : exercise.items));
    setDealt([]);
    setActive(null);
  }, [completedIds, exercise.items]);

  function handleDeal() {
    if (deck.length === 0) {
      return;
    }
    const [top, ...rest] = deck;
    setDeck(rest);
    setDealt((prev) => [...prev, top]);
    setActive(top);
  }

  function handleUndo() {
    if (dealt.length === 0) {
      return;
    }
    const last = dealt[dealt.length - 1];
    const newDealt = dealt.slice(0, -1);
    setDealt(newDealt);
    setDeck((prev) => [last, ...prev]);
    setActive(newDealt[newDealt.length - 1] ?? null);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("cardsProgress", {
          done: completedIds.size,
          total: exercise.items.length,
        })}
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-center">
        <div className="relative h-40 w-28">
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 border-border bg-muted shadow-sm",
              remainingInDeck > 2 && "translate-y-1 translate-x-1",
            )}
            aria-hidden
          />
          <div
            className={cn(
              "absolute inset-0 rounded-xl border-2 border-border bg-muted shadow-sm",
              remainingInDeck > 1 && "translate-y-0.5 translate-x-0.5",
            )}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card px-2 text-center">
            <span className="text-2xl font-semibold tabular-nums text-brand-700 dark:text-brand-300">
              {remainingInDeck}
            </span>
            <span className="text-xs text-brand-500">{t("cardsInDeck")}</span>
          </div>
        </div>

        {active ? (
          <div className="dashboard-panel w-full max-w-md space-y-3 p-4 sm:min-h-40">
            <p className="text-base font-medium text-brand-800 dark:text-brand-200">
              {active.prompt}
            </p>
            {active.promptTr ? (
              <p className="text-sm text-brand-500 italic dark:text-brand-400">
                {active.promptTr}
              </p>
            ) : null}
            {!completedIds.has(active.id) ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onMarkComplete(active.id)}
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
        ) : (
          <div className="dashboard-panel flex w-full max-w-md items-center justify-center p-6 text-sm text-brand-500 dark:text-brand-400">
            {t("cardsDealHint")}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={reshuffle}>
          <Shuffle className="size-4" aria-hidden />
          {t("cardsShuffle")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={dealt.length === 0}
          onClick={handleUndo}
        >
          <Undo2 className="size-4" aria-hidden />
          {t("cardsUndo")}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={deck.length === 0}
          onClick={handleDeal}
        >
          <RotateCcw className="size-4" aria-hidden />
          {t("cardsDeal")}
        </Button>
      </div>
    </div>
  );
}
