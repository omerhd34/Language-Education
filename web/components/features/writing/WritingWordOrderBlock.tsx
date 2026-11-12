"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, RotateCcw } from "lucide-react";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { ExerciseCheckButton } from "@/components/features/exercises/ExerciseCheckButton";
import { Button } from "@/components/ui/Button";
import type { WritingWordOrderQuestion } from "@/data/writings/types";
import { cn } from "@/lib/utils";

type WritingWordOrderBlockProps = {
  question: WritingWordOrderQuestion;
  number: number;
  onGraded: (correct: boolean) => void;
  onReset?: () => void;
};

function normalizeToken(token: string): string {
  return token.trim();
}

export function WritingWordOrderBlock({
  question,
  number,
  onGraded,
  onReset,
}: WritingWordOrderBlockProps) {
  const t = useTranslations("Writing");
  const [slots, setSlots] = useState<Array<string | null>>(() =>
    question.answer.map(() => null),
  );
  const [bank, setBank] = useState(() => [...question.words]);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = useMemo(() => {
    return slots.every(
      (slot, index) =>
        normalizeToken(slot ?? "") ===
        normalizeToken(question.answer[index] ?? ""),
    );
  }, [question.answer, slots]);

  function handlePickWord(word: string) {
    if (revealed) {
      return;
    }
    const emptyIndex = slots.findIndex((slot) => slot === null);
    if (emptyIndex < 0) {
      return;
    }
    setSlots((prev) =>
      prev.map((slot, index) => (index === emptyIndex ? word : slot)),
    );
    setBank((prev) => {
      const wordIndex = prev.indexOf(word);
      if (wordIndex < 0) {
        return prev;
      }
      return [...prev.slice(0, wordIndex), ...prev.slice(wordIndex + 1)];
    });
  }

  function handleClearSlot(index: number) {
    if (revealed) {
      return;
    }
    const word = slots[index];
    if (!word) {
      return;
    }
    setSlots((prev) =>
      prev.map((slot, slotIndex) => (slotIndex === index ? null : slot)),
    );
    setBank((prev) => [...prev, word]);
  }

  function handleCheck() {
    const filled = slots.every((slot) => slot !== null);
    if (!filled) {
      return;
    }
    setRevealed(true);
    onGraded(isCorrect);
  }

  function handleReset() {
    setSlots(question.answer.map(() => null));
    setBank([...question.words]);
    setRevealed(false);
    onReset?.();
  }

  const filled = slots.every((slot) => slot !== null);

  return (
    <div className="space-y-4">
      <ExerciseQuestionHeader
        number={number}
        hint={question.hint}
        fallbackKey="writingWordOrder"
      />

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t("wordSlotsAria")}
      >
        {slots.map((slot, index) => {
          const target = question.answer[index] ?? "";
          const showCorrect = revealed && slot === target;
          const showWrong = revealed && slot !== null && slot !== target;

          return (
            <button
              key={`slot-${index}`}
              type="button"
              disabled={!slot || revealed}
              onClick={() => handleClearSlot(index)}
              className={cn(
                "flex h-12 min-w-14 items-center justify-center rounded-xl border px-2 text-sm font-medium transition-colors",
                slot && !revealed && "cursor-pointer",
                showCorrect &&
                  "border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
                showWrong &&
                  "border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100",
                !slot && "border-dashed border-border bg-background/40",
                slot &&
                  !revealed &&
                  "border-border bg-card text-brand-900 dark:text-brand-100",
              )}
            >
              {slot ?? ""}
            </button>
          );
        })}
      </div>

      <div
        className="flex flex-wrap gap-2 rounded-2xl border border-border bg-(--glass-2)/50 p-3"
        role="group"
        aria-label={t("wordBankAria")}
      >
        {bank.map((word, index) => (
          <button
            key={`${word}-${index}`}
            type="button"
            disabled={revealed}
            onClick={() => handlePickWord(word)}
            className="cursor-pointer rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-brand-900 hover:border-brand-400 disabled:cursor-not-allowed dark:text-brand-100"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <ExerciseCheckButton
          type="button"
          disabled={!filled || revealed}
          onClick={handleCheck}
        >
          <Check className="size-4" aria-hidden />
          {t("checkAnswers")}
        </ExerciseCheckButton>
        {revealed ? (
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw aria-hidden />
            {t("wordOrderTryAgain")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
