"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Layers, Shuffle, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SpeakingTimedMicControl } from "@/components/features/speaking/SpeakingTimedMicControl";
import type {
  SpeakingPromptItem,
  SpeakingRandomCardsExercise,
} from "@/data/speakings/types";
import { cn } from "@/lib/utils";

const DEAL_MS = 720;
const DECK_DRAW_MS = 520;
const UNDO_MS = 650;
const SHUFFLE_MS = 680;

type PanelMotion = "reveal" | "undo" | "shuffle-out";

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dealing, setDealing] = useState(false);
  const [deckDraw, setDeckDraw] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const dealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deckDrawTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shuffleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panelBusy = dealing || undoing || shuffling;

  const remainingInDeck = deck.length;
  const active =
    exercise.items.find((item) => item.id === activeId) ??
    dealt.find((item) => item.id === activeId) ??
    null;

  const applyReshuffle = useCallback(() => {
    const notDone = exercise.items.filter((item) => !completedIds.has(item.id));
    setDeck(shuffleItems(notDone.length > 0 ? notDone : exercise.items));
    setDealt([]);
    setActiveId(null);
    setDealing(false);
  }, [completedIds, exercise.items]);

  useEffect(() => {
    return () => {
      if (dealTimerRef.current !== null) {
        clearTimeout(dealTimerRef.current);
      }
      if (undoTimerRef.current !== null) {
        clearTimeout(undoTimerRef.current);
      }
      if (shuffleTimerRef.current !== null) {
        clearTimeout(shuffleTimerRef.current);
      }
      if (deckDrawTimerRef.current !== null) {
        clearTimeout(deckDrawTimerRef.current);
      }
    };
  }, []);

  function handleReshuffleClick() {
    if (panelBusy) {
      return;
    }
    setShuffling(true);
    shuffleTimerRef.current = setTimeout(() => {
      applyReshuffle();
      setShuffling(false);
      shuffleTimerRef.current = null;
    }, SHUFFLE_MS);
  }

  function handleDealFromDeck() {
    if (deck.length === 0 || panelBusy) {
      return;
    }
    const [top, ...rest] = deck;
    setDeck(rest);
    setDealt((prev) => [...prev, top]);
    setActiveId(top.id);
    setDealing(true);
    setDeckDraw(true);
    if (deckDrawTimerRef.current !== null) {
      clearTimeout(deckDrawTimerRef.current);
    }
    deckDrawTimerRef.current = setTimeout(() => {
      setDeckDraw(false);
      deckDrawTimerRef.current = null;
    }, DECK_DRAW_MS);

    dealTimerRef.current = setTimeout(() => {
      setDealing(false);
      dealTimerRef.current = null;
    }, DEAL_MS);
  }

  function handleUndo() {
    if (dealt.length === 0 || panelBusy) {
      return;
    }
    setUndoing(true);
    undoTimerRef.current = setTimeout(() => {
      const last = dealt[dealt.length - 1];
      const newDealt = dealt.slice(0, -1);
      setDealt(newDealt);
      setDeck((prev) => [last, ...prev]);
      setActiveId(newDealt[newDealt.length - 1]?.id ?? null);
      setUndoing(false);
      undoTimerRef.current = null;
    }, UNDO_MS);
  }

  let panelMotion: PanelMotion | null = null;
  if (dealing) {
    panelMotion = "reveal";
  } else if (undoing) {
    panelMotion = "undo";
  } else if (shuffling && active) {
    panelMotion = "shuffle-out";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("cardsProgress", {
            done: completedIds.size,
            total: exercise.items.length,
          })}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={panelBusy}
            onClick={handleReshuffleClick}
          >
            <Shuffle className="size-4" aria-hidden />
            {t("cardsShuffle")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={dealt.length === 0 || panelBusy}
            onClick={handleUndo}
          >
            <Undo2 className="size-4" aria-hidden />
            {t("cardsUndo")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:items-center lg:justify-center">
        <div className="relative h-48 w-36 shrink-0">
          {deckDraw ? (
            <div
              className="speaking-card-deck-draw-card speaking-card-deck-back pointer-events-none absolute inset-0 z-20 rounded-2xl border border-white/30 shadow-lg"
              aria-hidden
            />
          ) : null}
          <button
            type="button"
            className={cn(
              "group relative h-48 w-36 cursor-pointer rounded-2xl border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-45",
              remainingInDeck > 0 && !panelBusy && "speaking-card-deck-pulse",
              dealing && "speaking-card-deck-lift",
              shuffling && "speaking-card-deck-shuffle",
              undoing && "speaking-card-deck-catch",
            )}
            disabled={remainingInDeck === 0 || panelBusy}
            onClick={handleDealFromDeck}
            aria-label={t("cardsTapDeck")}
          >
            <DeckStack remaining={remainingInDeck} fan={shuffling} />
            <div
              className={cn(
                "speaking-card-deck-face speaking-card-deck-back absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl border border-white/25 shadow-lg transition-transform group-hover:enabled:scale-[1.02] group-active:enabled:scale-[0.98]",
                deckDraw && "speaking-card-deck-face--deal",
              )}
            >
              <Layers
                className="size-7 text-white/90 drop-shadow-sm"
                aria-hidden
              />
              <span
                key={remainingInDeck}
                className="speaking-card-deck-count text-3xl font-bold tabular-nums text-white"
              >
                {remainingInDeck}
              </span>
              <span className="max-w-28 text-center text-[0.65rem] font-semibold uppercase tracking-wide text-white/85">
                {t("cardsInDeck")}
              </span>
              <span className="mt-1 rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-medium text-white/90 opacity-0 transition-opacity group-hover:enabled:opacity-100">
                {t("cardsTapDeck")}
              </span>
            </div>
          </button>
        </div>

        <div className="w-full min-w-0 max-w-sm overflow-hidden sm:max-w-md">
          {active ? (
            <SpeakingCardTopicPanel
              item={active}
              motion={panelMotion}
              completed={completedIds.has(active.id)}
              showMic
              onMarkComplete={() => onMarkComplete(active.id)}
              topicDoneLabel={t("topicDone")}
            />
          ) : (
            <div className="dashboard-panel flex items-center justify-center p-6">
              <p className="text-center text-sm text-brand-500 dark:text-brand-400">
                {t("cardsDealHint")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type SpeakingCardTopicPanelProps = {
  item: SpeakingPromptItem;
  motion: PanelMotion | null;
  completed: boolean;
  showMic: boolean;
  onMarkComplete: () => void;
  topicDoneLabel: string;
};

function SpeakingCardTopicPanel({
  item,
  motion,
  completed,
  showMic,
  onMarkComplete,
  topicDoneLabel,
}: SpeakingCardTopicPanelProps) {
  const animateWholeCard = motion === "undo" || motion === "shuffle-out";

  const footer = (
    <footer className="box-border w-full min-w-0 border-t border-border/50 bg-muted/25 px-4 py-3 dark:bg-muted/15">
      {showMic && !completed ? (
        <SpeakingTimedMicControl
          sessionKey={item.id}
          onRequirementMet={onMarkComplete}
        />
      ) : completed ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {topicDoneLabel}
        </p>
      ) : null}
    </footer>
  );

  return (
    <article className="dashboard-panel speaking-card-opened speaking-card-face box-border w-full max-w-full p-0">
      <div
        className="speaking-card-book-scene"
        aria-busy={motion !== null}
        aria-live={motion !== null ? "polite" : undefined}
      >
        <div
          className={cn(
            "speaking-card-page",
            motion === "reveal" && "speaking-card-page--reveal",
            motion === "undo" && "speaking-card-page--undo",
            motion === "shuffle-out" && "speaking-card-page--shuffle-out",
          )}
        >
          <div className="speaking-card-page-inner w-full min-w-0">
            <div className="speaking-card-prompt-zone px-4 py-5">
              <PromptCopy item={item} />
            </div>
            {animateWholeCard ? footer : null}
          </div>
        </div>
      </div>
      {!animateWholeCard ? footer : null}
    </article>
  );
}

function PromptCopy({ item }: { item: SpeakingPromptItem }) {
  return (
    <div className="space-y-2 text-center">
      <p className="text-base font-medium leading-snug text-brand-800 dark:text-brand-200">
        {item.prompt}
      </p>
      {item.promptTr ? (
        <p className="text-sm leading-snug text-brand-500 italic dark:text-brand-400">
          {item.promptTr}
        </p>
      ) : null}
    </div>
  );
}

function DeckStack({ remaining, fan }: { remaining: number; fan: boolean }) {
  if (remaining <= 1) {
    return null;
  }
  return (
    <>
      {remaining > 2 ? (
        <div
          className={cn(
            "speaking-card-deck-stack speaking-card-deck-back absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border border-white/15 opacity-80",
            fan &&
              "speaking-card-deck-fan-layer speaking-card-deck-fan-layer--deep",
          )}
          aria-hidden
        />
      ) : null}
      {remaining > 1 ? (
        <div
          className={cn(
            "speaking-card-deck-stack speaking-card-deck-back absolute inset-0 translate-x-1 translate-y-1 rounded-2xl border border-white/20 opacity-90",
            fan && "speaking-card-deck-fan-layer",
          )}
          aria-hidden
        />
      ) : null}
    </>
  );
}
