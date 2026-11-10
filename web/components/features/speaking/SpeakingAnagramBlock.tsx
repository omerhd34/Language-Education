"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, RotateCcw } from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { SpeakingTimedMicControl } from "@/components/features/speaking/SpeakingTimedMicControl";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  SpeakingAnagramQuestion,
  SpeakingAnagramWord,
} from "@/data/speakings/types";
import { cn } from "@/lib/utils";

type WordState = {
  slots: Array<string | null>;
  bank: string[];
};

type SpeakingAnagramBlockProps = {
  question: SpeakingAnagramQuestion;
  number: number;
  onGraded: (correct: boolean) => void;
  onReset?: () => void;
};

/** İngilizce harf; CSS `uppercase` Türkçe yerelde i → İ yapar. */
function displayAnagramLetter(letter: string): string {
  return letter.toLocaleUpperCase("en-US");
}

type WordFillStatus = "empty" | "partial" | "correct" | "wrong";

function wordFillStatus(
  word: SpeakingAnagramWord,
  state: WordState,
): WordFillStatus {
  const filled = state.slots.every((slot) => slot !== null);
  if (!filled) {
    return state.slots.some((slot) => slot !== null) ? "partial" : "empty";
  }
  const built = state.slots.join("").toLowerCase();
  return built === word.answer.toLowerCase() ? "correct" : "wrong";
}

function filledSlotClass(status: WordFillStatus): string {
  switch (status) {
    case "correct":
      return "border-emerald-500/45 bg-emerald-500/12 text-emerald-900 dark:text-emerald-100";
    case "wrong":
      return "border-red-500/45 bg-red-500/12 text-red-900 dark:text-red-100";
    case "partial":
      return "border-sky-500/40 bg-sky-500/8 text-brand-900 dark:text-brand-100";
    default:
      return "border-sky-500/40 bg-sky-500/8 text-brand-900 dark:text-brand-100";
  }
}

function buildInitialWordStates(
  question: SpeakingAnagramQuestion,
): WordState[] {
  return question.words.map((word) => ({
    slots: word.answer.split("").map(() => null),
    bank: [...word.letters],
  }));
}

export function SpeakingAnagramBlock({
  question,
  number,
  onGraded,
  onReset,
}: SpeakingAnagramBlockProps) {
  const t = useTranslations("Speaking");
  const [wordStates, setWordStates] = useState<WordState[]>(() =>
    buildInitialWordStates(question),
  );
  const [revealed, setRevealed] = useState(false);
  const [speakingDone, setSpeakingDone] = useState(false);
  const [sentenceHintVisible, setSentenceHintVisible] = useState(false);

  const sentenceMeaningTr = question.speakWhenDoneTr?.trim() ?? "";

  const allSlotsFilled = useMemo(
    () =>
      wordStates.every((state) => state.slots.every((slot) => slot !== null)),
    [wordStates],
  );

  const isCorrect = useMemo(() => {
    if (!allSlotsFilled) {
      return false;
    }
    return question.words.every((word, wordIndex) => {
      const state = wordStates[wordIndex];
      if (!state) {
        return false;
      }
      const built = state.slots.join("");
      return built.toLowerCase() === word.answer.toLowerCase();
    });
  }, [allSlotsFilled, question.words, wordStates]);

  useEffect(() => {
    if (revealed || !isCorrect) {
      return;
    }
    setRevealed(true);
  }, [isCorrect, revealed]);

  function handlePickLetter(wordIndex: number, letter: string) {
    if (revealed) {
      return;
    }
    setWordStates((prev) =>
      prev.map((state, index) => {
        if (index !== wordIndex) {
          return state;
        }
        const emptyIndex = state.slots.findIndex((slot) => slot === null);
        if (emptyIndex < 0) {
          return state;
        }
        const letterIndex = state.bank.indexOf(letter);
        if (letterIndex < 0) {
          return state;
        }
        return {
          slots: state.slots.map((slot, i) =>
            i === emptyIndex ? letter : slot,
          ),
          bank: [
            ...state.bank.slice(0, letterIndex),
            ...state.bank.slice(letterIndex + 1),
          ],
        };
      }),
    );
  }

  function handleClearSlot(wordIndex: number, slotIndex: number) {
    if (revealed) {
      return;
    }
    setWordStates((prev) =>
      prev.map((state, index) => {
        if (index !== wordIndex) {
          return state;
        }
        const letter = state.slots[slotIndex];
        if (!letter) {
          return state;
        }
        return {
          slots: state.slots.map((slot, i) => (i === slotIndex ? null : slot)),
          bank: [...state.bank, letter],
        };
      }),
    );
  }

  function handleTryAgain() {
    setWordStates(buildInitialWordStates(question));
    setRevealed(false);
    setSpeakingDone(false);
    setSentenceHintVisible(false);
    onReset?.();
  }

  function handleSpeakingComplete() {
    setSpeakingDone(true);
    onGraded(true);
  }

  return (
    <article className="dashboard-panel space-y-4 p-4 sm:p-5">
      <ExerciseQuestionHeader
        number={number}
        title={t("anagramPrompt")}
        showHint={false}
        className="space-y-0"
        actions={
          sentenceMeaningTr ? (
            <Popover
              open={sentenceHintVisible}
              onOpenChange={setSentenceHintVisible}
            >
              <PopoverTrigger
                type="button"
                className={cn(
                  "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors",
                  sentenceHintVisible
                    ? "border-amber-400/60 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    : "border-border/60 bg-muted/30 text-brand-600 hover:border-amber-400/50 hover:bg-amber-500/10 dark:text-brand-400",
                )}
                aria-expanded={sentenceHintVisible}
                aria-label={
                  sentenceHintVisible
                    ? t("anagramSentenceHintHide")
                    : t("anagramSentenceHintShow")
                }
              >
                <Lightbulb className="size-4" aria-hidden />
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="z-200 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-amber-300/50 bg-amber-50 p-3 text-sm leading-relaxed text-brand-900 shadow-lg ring-1 ring-amber-200/60 dark:border-amber-600/40 dark:bg-amber-950 dark:text-brand-100 dark:ring-amber-800/40"
              >
                <p>{sentenceMeaningTr}</p>
              </PopoverContent>
            </Popover>
          ) : null
        }
      />

      <div className="rounded-2xl border border-border/50 bg-muted/20 p-3 sm:p-4 dark:bg-muted/10">
        <div className="flex flex-wrap items-start gap-x-2 gap-y-5">
          {question.words.map((word, wordIndex) => {
            const state = wordStates[wordIndex];
            if (!state) {
              return null;
            }
            const fillStatus = wordFillStatus(word, state);

            return (
              <div
                key={`word-${wordIndex}`}
                className="rounded-xl border border-border/40 bg-card/80 px-2.5 py-2 shadow-sm"
              >
                <div
                  className="mb-2 flex flex-wrap gap-1"
                  role="group"
                  aria-label={t("anagramSlotsAria")}
                >
                  {state.slots.map((slot, slotIndex) => (
                    <button
                      key={`slot-${wordIndex}-${slotIndex}`}
                      type="button"
                      disabled={!slot || revealed}
                      onClick={() => handleClearSlot(wordIndex, slotIndex)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors sm:size-10",
                        revealed
                          ? "cursor-default"
                          : slot
                            ? "cursor-pointer"
                            : "cursor-default",
                        slot
                          ? filledSlotClass(fillStatus)
                          : "border-dashed border-border/70 bg-muted/40",
                      )}
                    >
                      {slot ? displayAnagramLetter(slot) : ""}
                    </button>
                  ))}
                </div>
                <div
                  className="flex flex-wrap gap-1.5"
                  role="group"
                  aria-label={t("anagramBankAria")}
                >
                  {state.bank.map((letter, letterIndex) => (
                    <button
                      key={`bank-${wordIndex}-${letterIndex}-${letter}`}
                      type="button"
                      disabled={revealed}
                      onClick={() => handlePickLetter(wordIndex, letter)}
                      className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border/80 bg-background text-sm font-semibold shadow-sm transition-colors hover:border-sky-500/45 hover:bg-sky-500/5 disabled:cursor-not-allowed sm:size-10"
                    >
                      {displayAnagramLetter(letter)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {revealed && isCorrect && question.speakWhenDone ? (
        <div className="speaking-card-face rounded-2xl border border-border/50 bg-linear-to-b from-card to-muted/30 p-4">
          <div className="space-y-1 border-b border-border/40 pb-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
              {t("anagramSpeakTopic")}
            </p>
            <p className="text-base font-medium text-brand-800 dark:text-brand-200">
              {question.speakWhenDone}
            </p>
            {question.speakWhenDoneTr ? (
              <p className="text-sm italic text-brand-500 dark:text-brand-400">
                {question.speakWhenDoneTr}
              </p>
            ) : null}
          </div>
          <div className="overflow-visible pt-3">
            {speakingDone ? (
              <p className="py-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {t("anagramSpeakDone")}
              </p>
            ) : (
              <SpeakingTimedMicControl
                sessionKey={question.id}
                onRequirementMet={handleSpeakingComplete}
              />
            )}
          </div>
        </div>
      ) : null}

      {revealed ? (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleTryAgain}
          >
            <RotateCcw className="size-4" aria-hidden />
            {t("anagramTryAgain")}
          </Button>
        </div>
      ) : null}
    </article>
  );
}
