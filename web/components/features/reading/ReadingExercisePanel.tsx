"use client";

import { useMemo, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import { readingExerciseHintKey } from "@/components/features/exercises/exerciseHintFallbacks";
import { TrueFalseChoiceButtons } from "@/components/features/exercises/TrueFalseChoiceButtons";
import { ExercisePercentBadge } from "@/components/features/topics/ExercisePercentBadge";
import { ExerciseResultDialog } from "@/components/features/topics/ExerciseResultDialog";
import { ExerciseStepNav } from "@/components/features/topics/ExerciseStepNav";
import { Button } from "@/components/ui/Button";
import type { ReadingExerciseBlock } from "@/data/readings/types";
import { useExerciseNavigation } from "@/hooks/useExerciseNavigation";
import { isReadingAnswerAccepted } from "@/lib/readingAnswerCheck";
import {
  flattenReadingExerciseBlock,
  type FlatReadingExercise,
} from "@/lib/reading/flattenReadingExercises";
import { SECTION_PRACTICE_PASS_PERCENT } from "@/lib/sectionPracticePassPercent";
import { cn } from "@/lib/utils";

const PASS_PERCENT = SECTION_PRACTICE_PASS_PERCENT;

type ReadingExercisePanelProps = {
  block: ReadingExerciseBlock;
  onComplete?: (passed: boolean, percent: number) => void;
};

type ReadingAnswerSlot = {
  answer: string;
  trueFalse: boolean | null;
  checked: boolean;
};

function createAnswerSlot(): ReadingAnswerSlot {
  return { answer: "", trueFalse: null, checked: false };
}

function isSlotCorrect(
  item: FlatReadingExercise,
  slot: ReadingAnswerSlot,
): boolean {
  switch (item.kind) {
    case "reference":
      return isReadingAnswerAccepted(
        slot.answer,
        item.question.acceptedAnswers,
      );
    case "shortAnswer":
      return isReadingAnswerAccepted(
        slot.answer,
        item.question.acceptedAnswers,
      );
    case "trueFalse":
      return slot.trueFalse === item.question.answer;
    case "fillBlank": {
      const accepted = [
        item.question.answer,
        ...(item.question.acceptedAnswers ?? []),
      ];
      return isReadingAnswerAccepted(slot.answer, accepted);
    }
    default:
      return false;
  }
}

function countCorrect(
  items: FlatReadingExercise[],
  slots: ReadingAnswerSlot[],
): number {
  return items.reduce((count, item, index) => {
    const slot = slots[index];
    if (slot?.checked && isSlotCorrect(item, slot)) {
      return count + 1;
    }
    return count;
  }, 0);
}

function canCheckItem(
  item: FlatReadingExercise,
  slot: ReadingAnswerSlot,
): boolean {
  if (item.kind === "trueFalse") {
    return slot.trueFalse !== null;
  }
  return slot.answer.trim() !== "";
}

export function ReadingExercisePanel({
  block,
  onComplete,
}: ReadingExercisePanelProps) {
  const tReading = useTranslations("Reading");
  const tTopic = useTranslations("Topic");

  const items = useMemo(() => flattenReadingExerciseBlock(block), [block]);

  const {
    index,
    slots,
    current,
    finished,
    resultOpen,
    setResultOpen,
    nextLabelKey,
    canGoPrevious,
    canGoNext,
    updateCurrent,
    handlePrevious,
    handleAdvance,
    resetSession,
  } = useExerciseNavigation({
    length: items.length,
    createSlot: createAnswerSlot,
  });

  if (items.length === 0) {
    return <p className="page-subtitle mt-0">{tReading("noExercises")}</p>;
  }

  const item = items[index];
  if (!item || !current) {
    return null;
  }

  const isCorrect = current.checked && isSlotCorrect(item, current);
  const canRestart = index > 0;
  const continueLabel = tTopic(nextLabelKey);
  const answered = slots.filter((slot) => slot.checked).length;
  const percent =
    items.length === 0 ? 0 : Math.round((answered / items.length) * 100);
  const correctCount = countCorrect(items, slots);
  const scorePercent =
    items.length === 0 ? 0 : Math.round((correctCount / items.length) * 100);
  const passed = scorePercent >= PASS_PERCENT;

  if (finished) {
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
        <h2 className="page-title">{tTopic("finishedTitle")}</h2>
        <p className="page-subtitle mt-0">
          {tReading("scoreSummary", {
            correct: correctCount,
            total: items.length,
            percent: scorePercent,
          })}
        </p>
        <Button type="button" onClick={resetSession}>
          {tTopic("retry")}
        </Button>
      </div>
    );
  }

  function handleCheck(event?: FormEvent) {
    event?.preventDefault();
    if (!canCheckItem(item, current) || current.checked) {
      return;
    }
    updateCurrent({ checked: true });
    setResultOpen(true);
  }

  function handleNext() {
    handleAdvance((answeredSlots) => {
      const correct = countCorrect(items, answeredSlots);
      const total = items.length;
      const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
      onComplete?.(pct >= PASS_PERCENT, pct);
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brand-500 dark:text-brand-400">
          {tTopic("progress", { current: index + 1, total: items.length })}
        </p>
        <ExercisePercentBadge percent={percent} />
      </div>

      <article className="dashboard-panel space-y-5">
        <ExerciseQuestionBody
          item={item}
          slot={current}
          checked={current.checked}
          isCorrect={isCorrect}
          onAnswerChange={(answer) => updateCurrent({ answer })}
          onTrueFalseChange={(trueFalse) => updateCurrent({ trueFalse })}
        />

        <form className="space-y-4" onSubmit={handleCheck}>
          <ExerciseStepNav
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            nextLabel={continueLabel}
            nextVariant={current.checked ? "default" : "outline"}
            onPrevious={handlePrevious}
            onNext={handleNext}
            trailing={
              canRestart ? (
                <Button type="button" variant="outline" onClick={resetSession}>
                  {tTopic("restart")}
                </Button>
              ) : null
            }
          >
            {!current.checked ? (
              <Button type="submit" disabled={!canCheckItem(item, current)}>
                {tTopic("check")}
              </Button>
            ) : null}
          </ExerciseStepNav>
        </form>
      </article>

      <ExerciseResultDialog
        open={resultOpen && current.checked}
        variant={isCorrect ? "correct" : "incorrect"}
        onOpenChange={setResultOpen}
        onContinue={handleNext}
        continueLabel={continueLabel}
      />
    </div>
  );
}

function ExerciseQuestionBody({
  item,
  slot,
  checked,
  isCorrect,
  onAnswerChange,
  onTrueFalseChange,
}: {
  item: FlatReadingExercise;
  slot: ReadingAnswerSlot;
  checked: boolean;
  isCorrect: boolean;
  onAnswerChange: (value: string) => void;
  onTrueFalseChange: (value: boolean) => void;
}) {
  const tReading = useTranslations("Reading");

  switch (item.kind) {
    case "reference":
      return (
        <div className="space-y-4">
          <ExerciseQuestionHeader
            title={
              <>
                {item.question.prompt}{" "}
                <span className="text-base font-normal text-brand-500">
                  (
                  {tReading("paragraphRef", {
                    number: item.question.paragraphRef,
                  })}
                  )
                </span>
              </>
            }
            hint={item.question.hint}
            fallbackKey={readingExerciseHintKey("reference")}
          />
          <label className="flex w-full flex-col gap-1.5 text-sm">
            <input
              type="text"
              value={slot.answer}
              disabled={checked}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder={tReading("answerPlaceholder")}
              autoComplete="off"
              spellCheck={false}
              className={inputClassName(checked, isCorrect)}
            />
          </label>
        </div>
      );
    case "shortAnswer":
      return (
        <div className="space-y-4">
          <ExerciseQuestionHeader
            title={item.question.prompt}
            hint={item.question.hint}
            fallbackKey={readingExerciseHintKey("shortAnswer")}
          />
          <label className="flex w-full flex-col gap-1.5 text-sm">
            <textarea
              rows={3}
              value={slot.answer}
              disabled={checked}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder={tReading("answerPlaceholderLong")}
              className={cn(
                "w-full resize-y rounded-lg border bg-surface px-3 py-2 text-sm text-brand-950 outline-none transition-colors",
                "placeholder:text-brand-600/60 dark:bg-brand-900 dark:text-brand-100",
                inputBorderClassName(checked, isCorrect),
              )}
            />
          </label>
        </div>
      );
    case "trueFalse":
      return (
        <div className="space-y-4">
          <ExerciseQuestionHeader
            title={item.question.statement}
            hint={item.question.hint}
            fallbackKey={readingExerciseHintKey("trueFalse")}
          />
          <TrueFalseChoiceButtons
            trueLabel={tReading("trueLabel")}
            falseLabel={tReading("falseLabel")}
            trueCaption={tReading("trueCaption")}
            falseCaption={tReading("falseCaption")}
            selected={slot.trueFalse}
            correctAnswer={item.question.answer}
            revealed={checked}
            onSelect={onTrueFalseChange}
          />
        </div>
      );
    case "fillBlank":
      return (
        <div className="space-y-4">
          <ExerciseQuestionHeader
            title={tReading("sectionFillBlank")}
            hint={item.question.hint}
            fallbackKey={readingExerciseHintKey("fillBlank")}
          />
          <p className="flex flex-wrap items-center gap-1 text-base leading-7 text-brand-800 dark:text-brand-200">
            <span>{item.question.before}</span>
            <input
              type="text"
              value={slot.answer}
              disabled={checked}
              onChange={(event) => onAnswerChange(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "inline-flex h-11 max-w-48 min-w-28 rounded-lg border bg-surface px-3 text-sm outline-none",
                inputBorderClassName(checked, isCorrect),
              )}
            />
            <span>{item.question.after}</span>
          </p>
        </div>
      );
    default:
      return null;
  }
}

function inputClassName(checked: boolean, isCorrect: boolean): string {
  return cn(
    "h-11 rounded-lg border bg-surface px-3 text-brand-950 outline-none transition-colors",
    "placeholder:text-brand-600/60 focus:ring-2",
    "dark:bg-brand-900 dark:text-brand-100 dark:placeholder:text-brand-400/70",
    inputBorderClassName(checked, isCorrect),
  );
}

function inputBorderClassName(checked: boolean, isCorrect: boolean): string {
  if (checked && isCorrect) {
    return "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/20";
  }
  if (checked && !isCorrect) {
    return "border-red-500/60 focus:border-red-500 focus:ring-red-500/20";
  }
  return "border-brand-400/70 focus:border-brand-800 focus:ring-brand-800/20 dark:border-brand-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/20";
}
