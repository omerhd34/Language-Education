/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Volume2 } from "lucide-react";
import {
  useAnswerVocabularyQuizMutation,
  useCompleteVocabularyQuizMutation,
  useVocabularyQuizQuery,
  type VocabularyQuizWord,
} from "@/store/api";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDurationHms } from "@/lib/formatDuration";
import { speakText, stopSpeaking } from "@/lib/speakText";
import {
  generateMixedQuizItems,
  type VocabularyQuizItem,
} from "@/lib/vocabulary/generateQuizQuestions";
import { writeLastVocabularyQuizResult } from "@/lib/vocabularyQuizResultStorage";
import { cn } from "@/lib/utils";

export function VocabularyQuizView() {
  const t = useTranslations("Vocabulary");
  const { data, isLoading, isError, refetch } = useVocabularyQuizQuery();
  const [answerQuiz, { isLoading: isSubmitting }] =
    useAnswerVocabularyQuizMutation();
  const [completeQuiz] = useCompleteVocabularyQuizMutation();

  const [items, setItems] = useState<VocabularyQuizItem[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastNewlyKnown, setLastNewlyKnown] = useState(false);
  const [expected, setExpected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const remainingMs = useCountdown(data?.nextDueAt);
  const words: VocabularyQuizWord[] = data?.words ?? [];
  const wordKey = words.map((word) => word.id).join("|");
  const question = items[index];

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  useEffect(() => {
    if (index === 0) {
      return;
    }
    if (question?.type === "listening" && question.speakText && !checked) {
      speakText(question.speakText);
    }
  }, [question, checked, index]);

  useEffect(() => {
    if (!wordKey || finished) {
      return;
    }

    setItems(generateMixedQuizItems(words));
    setIndex(0);
    setSelected(null);
    setTextAnswer("");
    setChecked(false);
    setLastCorrect(null);
    setLastNewlyKnown(false);
    setExpected(null);
    setCorrectCount(0);
  }, [wordKey, finished]);

  async function handleCheck() {
    if (!question || checked) {
      return;
    }

    const answer = question.inputMode === "text" ? textAnswer.trim() : selected;
    if (!answer) {
      return;
    }

    try {
      const result = await answerQuiz({
        wordId: question.wordId,
        answer,
        quizType: question.type,
      }).unwrap();

      setChecked(true);
      setLastCorrect(result.correct);
      setLastNewlyKnown(result.newlyKnown);
      setExpected(question.expectedDisplay);
      if (result.correct) {
        setCorrectCount((value) => value + 1);
      }
    } catch {
      setChecked(true);
      setLastCorrect(false);
      setLastNewlyKnown(false);
      setExpected(question.expectedDisplay);
    }
  }

  async function handleNext() {
    if (index >= items.length - 1) {
      const total = items.length;
      const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const wordIds = [...new Set(items.map((item) => item.wordId))];
      if (wordIds.length > 0) {
        try {
          await completeQuiz({ wordIds }).unwrap();
        } catch {
          // Sonuç ekranı yine de açılır; kota yenilemesi sonraki istekte düzelir.
        }
      }
      writeLastVocabularyQuizResult({
        score,
        correct: correctCount,
        total,
        finishedAt: new Date().toISOString(),
      });
      setFinished(true);
      void refetch();
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setTextAnswer("");
    setChecked(false);
    setLastCorrect(null);
    setLastNewlyKnown(false);
    setExpected(null);
  }

  const totalQuestions = items.length;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  if (finished && totalQuestions > 0) {
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-5 text-center">
        <h2 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
          {t("quizFinishedTitle")}
        </h2>
        <p
          className="font-display text-5xl font-semibold tabular-nums tracking-tight text-brand-950 dark:text-brand-100"
          aria-label={t("quizFinishedScorePercent", { score: scorePercent })}
        >
          {scorePercent}
          <span className="ml-1 text-2xl font-medium text-brand-500 dark:text-brand-400">
            / 100
          </span>
        </p>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("quizFinishedScoreDetail", {
            correct: correctCount,
            total: totalQuestions,
          })}
        </p>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("quizFinishedHint")}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <ButtonLink href="/panel/kelime/bugun-calisilan" variant="outline">
            {t("quizBackToStudied")}
          </ButtonLink>
          <ButtonLink
            href="/panel#ilerleme"
            onClick={() => {
              void refetch();
            }}
          >
            {t("backToProgress")}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const quizInProgress = totalQuestions > 0;

  if (!quizInProgress && isLoading && words.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("quizLoading")}
      </p>
    );
  }

  if (!quizInProgress && isError && words.length === 0) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {t("quizError")}
      </p>
    );
  }

  if (!quizInProgress && words.length === 0) {
    return (
      <div className="dashboard-panel mx-auto max-w-lg space-y-4 text-center">
        <h2 className="font-display text-2xl font-semibold text-brand-950 dark:text-brand-100">
          {t("quizEmptyTitle")}
        </h2>
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("quizEmptyBody")}
        </p>
        {data?.nextDueAt && remainingMs > 0 ? (
          <p className="font-mono text-sm font-semibold tabular-nums text-amber-800 dark:text-amber-200">
            {t("quizNextDue", { time: formatDurationHms(remainingMs) })}
          </p>
        ) : null}
        <ButtonLink href="/panel#ilerleme" variant="outline">
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToProgress")}
        </ButtonLink>
      </div>
    );
  }

  if (!question) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("quizLoading")}
      </p>
    );
  }

  const canCheck =
    question.inputMode === "text"
      ? textAnswer.trim().length > 0
      : selected !== null;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonLink
          href="/panel/kelime/bugun-calisilan"
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("quizBackToStudied")}
        </ButtonLink>

        <p className="text-sm text-brand-500 dark:text-brand-400">
          {t("quizProgress", {
            current: index + 1,
            total: items.length,
          })}
        </p>
      </div>

      {checked && (lastCorrect || question.inputMode === "text") ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm font-medium",
            lastCorrect
              ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
              : "border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200",
          )}
        >
          {lastCorrect
            ? lastNewlyKnown
              ? t("quizCorrectFeedback")
              : t("quizCorrectPartialFeedback")
            : t("quizWrongFeedbackWithAnswer", {
                answer: expected ?? "",
              })}
        </div>
      ) : null}

      <article className="dashboard-panel space-y-5">
        <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
          {question.prompt}
        </h2>

        {question.type === "listening" && question.speakText ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => speakText(question.speakText!)}
          >
            <Volume2 className="size-4" aria-hidden />
            {t("quizPlayAudio")}
          </Button>
        ) : null}

        {question.inputMode === "text" ? (
          <input
            type="text"
            value={textAnswer}
            disabled={checked || isSubmitting}
            onChange={(event) => setTextAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleCheck();
              }
            }}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
            placeholder={t("quizFillPlaceholder")}
            autoComplete="off"
            aria-label={t("quizFillPlaceholder")}
          />
        ) : (
          <ul
            className="space-y-2"
            role="listbox"
            aria-label={t("quizOptionsAria")}
          >
            {(question.options ?? []).map((option) => {
              const isSelected = selected === option;
              const showCorrect =
                checked && expected !== null && option === expected;
              const showWrong = checked && isSelected && lastCorrect === false;

              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={checked || isSubmitting}
                    onClick={() => setSelected(option)}
                    className={cn(
                      "w-full cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40",
                      showCorrect &&
                        "border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
                      showWrong &&
                        "border-destructive/40 bg-destructive/10 text-destructive",
                      !showCorrect &&
                        !showWrong &&
                        isSelected &&
                        "border-sky-500 bg-sky-500/10",
                      !showCorrect &&
                        !showWrong &&
                        !isSelected &&
                        "border-border hover:border-sky-500/50",
                    )}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {!checked ? (
            <Button
              type="button"
              disabled={!canCheck || isSubmitting}
              onClick={() => {
                void handleCheck();
              }}
            >
              {t("quizCheck")}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              {index >= items.length - 1 ? t("quizFinish") : t("quizNext")}
            </Button>
          )}
        </div>
      </article>
    </div>
  );
}
