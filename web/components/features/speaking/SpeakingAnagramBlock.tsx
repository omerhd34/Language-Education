"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, RotateCcw } from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { Button } from "@/components/ui/Button";
import type { SpeakingAnagramQuestion } from "@/data/speakings/types";
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

function buildInitialWordStates(question: SpeakingAnagramQuestion): WordState[] {
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

  const isCorrect = useMemo(() => {
    return question.words.every((word, wordIndex) => {
      const state = wordStates[wordIndex];
      if (!state) {
        return false;
      }
      const built = state.slots.join("");
      return built.toLowerCase() === word.answer.toLowerCase();
    });
  }, [question.words, wordStates]);

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
          slots: state.slots.map((slot, i) =>
            i === slotIndex ? null : slot,
          ),
          bank: [...state.bank, letter],
        };
      }),
    );
  }

  function handleCheck() {
    const allFilled = wordStates.every((state) =>
      state.slots.every((slot) => slot !== null),
    );
    if (!allFilled) {
      return;
    }
    const correct = question.words.every((word, wordIndex) => {
      const state = wordStates[wordIndex];
      if (!state) {
        return false;
      }
      return state.slots.join("").toLowerCase() === word.answer.toLowerCase();
    });
    setRevealed(true);
    onGraded(correct);
  }

  function handleTryAgain() {
    setWordStates(buildInitialWordStates(question));
    setRevealed(false);
    onReset?.();
  }

  return (
    <article className="space-y-4">
      <ExerciseQuestionHeader
        number={number}
        title={t("anagramPrompt")}
        hint={question.hint}
        fallbackKey="speakingAnagram"
      />

      <div className="flex flex-wrap items-end gap-x-3 gap-y-6">
        {question.words.map((word, wordIndex) => {
          const state = wordStates[wordIndex];
          if (!state) {
            return null;
          }
          return (
            <div key={`word-${wordIndex}`} className="space-y-2">
              <div
                className="flex flex-wrap gap-1"
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
                      "flex size-9 items-center justify-center rounded-lg border text-sm font-semibold uppercase",
                      revealed
                        ? isCorrect
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-red-500/40 bg-red-500/10"
                        : slot
                          ? "border-sky-500/40 bg-card"
                          : "border-dashed border-border bg-muted/50",
                    )}
                  >
                    {slot ?? ""}
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
                    key={`bank-${wordIndex}-${letterIndex}`}
                    type="button"
                    disabled={revealed}
                    onClick={() => handlePickLetter(wordIndex, letter)}
                    className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-sm font-semibold uppercase shadow-sm hover:border-sky-500/40"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {revealed && question.speakWhenDone ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-brand-800 dark:text-brand-200">
          {t("anagramSpeakTopic")}:{" "}
          <span className="font-medium italic">{question.speakWhenDone}</span>
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {!revealed ? (
          <Button type="button" size="sm" onClick={handleCheck}>
            <Check className="size-4" aria-hidden />
            {t("checkAnswers")}
          </Button>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={handleTryAgain}>
            <RotateCcw className="size-4" aria-hidden />
            {t("anagramTryAgain")}
          </Button>
        )}
      </div>
    </article>
  );
}
