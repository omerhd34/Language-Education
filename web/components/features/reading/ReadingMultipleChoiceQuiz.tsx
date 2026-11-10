"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  CheckCircle2,
  RotateCcw,
  Volume2,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ExerciseQuestionHeader } from "@/components/features/exercises/ExerciseQuestionHeader";
import type { ReadingMultipleChoiceQuestion } from "@/data/readings/types";
import { scrollToReadingSection } from "@/lib/readingSectionTab";
import { SECTION_PRACTICE_PASS_PERCENT } from "@/lib/sectionPracticePassPercent";
import { InstantMultipleChoiceOptions } from "@/components/features/exercises/InstantMultipleChoiceOptions";
import { cn } from "@/lib/utils";

const PRACTICE_PASS_PERCENT = SECTION_PRACTICE_PASS_PERCENT;

type QuestionSlot = {
  selected: number;
  revealed: boolean;
};

type SkillQuizNamespace = "Reading" | "Listening";

type ReadingMultipleChoiceQuizProps = {
  questions: ReadingMultipleChoiceQuestion[];
  listened?: boolean;
  onComplete?: (passed: boolean, percent: number) => void;
  messageNamespace?: SkillQuizNamespace;
  scrollToAudio?: () => void;
};

function scoreFromSlots(
  questions: ReadingMultipleChoiceQuestion[],
  slots: Array<QuestionSlot | null>,
): { correct: number; percent: number } {
  const correct = questions.reduce((count, question, index) => {
    const slot = slots[index];
    if (slot?.revealed && slot.selected === question.correctIndex) {
      return count + 1;
    }
    return count;
  }, 0);
  const answered = slots.filter((slot) => slot?.revealed).length;
  const percent =
    answered === 0 ? 0 : Math.round((correct / questions.length) * 100);
  return { correct, percent };
}

export function ReadingMultipleChoiceQuiz({
  questions,
  listened = false,
  onComplete,
  messageNamespace = "Reading",
  scrollToAudio,
}: ReadingMultipleChoiceQuizProps) {
  const t = useTranslations(messageNamespace);
  const goToAudio = scrollToAudio ?? (() => scrollToReadingSection("text"));
  const completionSentRef = useRef(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [slots, setSlots] = useState<Array<QuestionSlot | null>>(() =>
    questions.map(() => null),
  );

  const allRevealed = slots.every((slot) => slot?.revealed === true);
  const { correct, percent } = useMemo(
    () => scoreFromSlots(questions, slots),
    [questions, slots],
  );
  const passed = percent >= PRACTICE_PASS_PERCENT;
  const sectionComplete = passed && listened;

  useEffect(() => {
    if (!allRevealed) {
      return;
    }
    setSummaryOpen(true);
    if (completionSentRef.current) {
      return;
    }
    const result = scoreFromSlots(questions, slots);
    completionSentRef.current = true;
    onComplete?.(result.percent >= PRACTICE_PASS_PERCENT, result.percent);
  }, [allRevealed, onComplete, questions, slots]);

  if (questions.length === 0) {
    return <p className="page-subtitle mt-0">{t("noExercises")}</p>;
  }

  function handleSelect(questionIndex: number, optionIndex: number) {
    const current = slots[questionIndex];
    if (current?.revealed) {
      return;
    }
    setSlots((prev) =>
      prev.map((slot, index) =>
        index === questionIndex
          ? { selected: optionIndex, revealed: true }
          : slot,
      ),
    );
  }

  function handleReset() {
    completionSentRef.current = false;
    setSummaryOpen(false);
    setSlots(questions.map(() => null));
  }

  const hasAnyAnswer = slots.some((slot) => slot?.revealed);

  return (
    <div className="space-y-4">
      <p className="page-subtitle mt-0">{t("sectionMultipleChoice")}</p>

      <div className="dashboard-panel space-y-0 p-4 sm:p-6">
        {questions.map((question, questionIndex) => {
          const slot = slots[questionIndex];
          return (
            <div key={question.id}>
              {questionIndex > 0 ? <Separator className="my-6" /> : null}
              <ReadingChoiceQuestion
                question={question}
                number={questionIndex + 1}
                selected={slot?.selected ?? null}
                revealed={slot?.revealed === true}
                messageNamespace={messageNamespace}
                onSelect={(optionIndex) =>
                  handleSelect(questionIndex, optionIndex)
                }
              />
            </div>
          );
        })}
      </div>

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="items-center text-center sm:items-center sm:text-center">
            <span
              className={cn(
                "mx-auto mb-1 flex size-14 items-center justify-center rounded-full",
                passed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                  : "bg-red-500/15 text-red-600 dark:text-red-300",
              )}
            >
              {passed ? (
                <CheckCircle2 className="size-7" aria-hidden />
              ) : (
                <XCircle className="size-7" aria-hidden />
              )}
            </span>
            <DialogTitle
              className={cn(
                "font-display text-2xl",
                passed
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-700 dark:text-red-300",
              )}
            >
              {sectionComplete
                ? t("sectionPassedTitle")
                : passed
                  ? t("practicePassedTitle")
                  : t("practiceMissedTitle")}
            </DialogTitle>
            <DialogDescription className="text-base text-brand-700 dark:text-brand-300">
              {t("scoreSummary", {
                correct,
                total: questions.length,
                percent,
              })}
            </DialogDescription>
            {passed && !listened ? (
              <p className="text-center text-sm text-brand-700 dark:text-brand-300">
                {t("practiceNeedListen")}
              </p>
            ) : null}
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleReset}
            >
              <RotateCcw aria-hidden />
              {t("resetAnswers")}
            </Button>
            {passed && !listened ? (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => {
                  setSummaryOpen(false);
                  goToAudio();
                }}
              >
                <Volume2 aria-hidden />
                {t("listenAll")}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={() => setSummaryOpen(false)}
              >
                <Check aria-hidden />
                {t("continue")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasAnyAnswer && !summaryOpen ? (
        <Button type="button" variant="outline" onClick={handleReset}>
          <RotateCcw aria-hidden />
          {t("resetAnswers")}
        </Button>
      ) : null}
    </div>
  );
}

function ReadingChoiceQuestion({
  question,
  number,
  selected,
  revealed,
  messageNamespace = "Reading",
  onSelect,
}: {
  question: ReadingMultipleChoiceQuestion;
  number: number;
  selected: number | null;
  revealed: boolean;
  messageNamespace?: SkillQuizNamespace;
  onSelect: (optionIndex: number) => void;
}) {
  const t = useTranslations(messageNamespace);
  const headingId = `${question.id}-prompt`;

  return (
    <div className="space-y-3">
      <ExerciseQuestionHeader
        number={number}
        title={question.prompt}
        hint={question.hint}
        fallbackKey={
          messageNamespace === "Reading" ? "readingMultipleChoice" : undefined
        }
        headingId={headingId}
      />

      <InstantMultipleChoiceOptions
        options={question.options}
        correctIndex={question.correctIndex}
        selected={selected}
        revealed={revealed}
        onSelect={onSelect}
        labelledBy={headingId}
        optionsAriaLabel={t("optionsAria")}
      />
    </div>
  );
}
