"use client";

import { useMemo, type FormEvent } from "react";
import { useTranslations } from "next-intl";
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
import { cn } from "@/lib/utils";

const PASS_PERCENT = 75;

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

  function sectionHint(kind: FlatReadingExercise["kind"]): string | null {
    switch (kind) {
      case "reference":
        return tReading("sectionReference");
      case "shortAnswer":
        return tReading("sectionShortAnswer");
      case "trueFalse":
        return tReading("sectionTrueFalse");
      case "fillBlank":
        return tReading("sectionFillBlank");
      default:
        return null;
    }
  }

  const hint = sectionHint(item.kind);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brand-500 dark:text-brand-400">
          {tTopic("progress", { current: index + 1, total: items.length })}
        </p>
        <ExercisePercentBadge percent={percent} />
      </div>

      <article className="dashboard-panel space-y-5">
        {hint ? (
          <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
            {hint}
          </p>
        ) : null}

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
          <h2 className="section-title">
            {item.question.prompt}{" "}
            <span className="text-base font-normal text-brand-500">
              (
              {tReading("paragraphRef", { number: item.question.paragraphRef })}
              )
            </span>
          </h2>
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
          <h2 className="section-title">{item.question.prompt}</h2>
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
          <h2 className="section-title">{item.question.statement}</h2>
          <div className="flex gap-2" role="group">
            {([true, false] as const).map((value) => {
              const label = value
                ? tReading("trueLabel")
                : tReading("falseLabel");
              const isSelected = slot.trueFalse === value;
              const showCorrect = checked && value === item.question.answer;
              const showWrong =
                checked && isSelected && value !== item.question.answer;

              return (
                <button
                  key={label}
                  type="button"
                  disabled={checked}
                  aria-pressed={isSelected}
                  onClick={() => onTrueFalseChange(value)}
                  className={cn(
                    "min-w-14 cursor-pointer rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                    "disabled:cursor-default",
                    showCorrect &&
                      "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                    showWrong &&
                      "border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-200",
                    !showCorrect &&
                      !showWrong &&
                      isSelected &&
                      "border-sky-500 bg-sky-500/10 text-brand-950 dark:text-brand-100",
                    !showCorrect &&
                      !showWrong &&
                      !isSelected &&
                      "border-border bg-background/50 text-brand-800 hover:border-brand-400 dark:bg-brand-950/40 dark:text-brand-200",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      );
    case "fillBlank":
      return (
        <div className="space-y-4">
          <h2 className="section-title sr-only">
            {tReading("sectionFillBlank")}
          </h2>
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
