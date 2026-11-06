/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import type { MultipleChoiceExercise } from "@/data/topics/types";
import { didPassTopicExamScore } from "@/lib/topicExam";
import {
  clearTopicExamDraft,
  readTopicExamDraft,
  readTopicExamPercent,
  toExamPercent,
  writeTopicExamDraft,
  type TopicExamDraft,
} from "@/lib/topicExamDraftStorage";
import { markTopicExamPassed } from "@/lib/topicProgressStorage";
import { cn } from "@/lib/utils";

type TopicExamViewProps = {
  topicId: string;
  exercises: MultipleChoiceExercise[];
};

type ExamOutcome = "passed" | "failed";

type ExamSession = {
  index: number;
  correct: number;
  total: number;
  slots: TopicExamDraft["slots"];
};

function ExamPercentBadge({ percent }: { percent: number }) {
  const t = useTranslations("Topic");
  const done = percent >= 100;

  return (
    <Badge
      variant="outline"
      aria-label={t("typeProgressAria", { percent })}
      className={cn(
        "shrink-0 tabular-nums",
        done
          ? "border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
          : percent > 0
            ? "border-sky-500/40 text-sky-700 dark:text-sky-300"
            : "text-brand-500 dark:text-brand-400",
      )}
    >
      {t("typeProgressBadge", { percent })}
    </Badge>
  );
}

export function TopicExamView({ topicId, exercises }: TopicExamViewProps) {
  const t = useTranslations("Topic");
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<TopicExamDraft | null>(null);
  const [percent, setPercent] = useState(0);
  const [outcome, setOutcome] = useState<ExamOutcome | null>(null);

  useEffect(() => {
    const saved = readTopicExamDraft(topicId);
    const compatible =
      saved && saved.slots.length === exercises.length ? saved : null;
    if (saved && !compatible) {
      clearTopicExamDraft(topicId);
    }
    setDraft(compatible);
    setPercent(
      compatible?.active
        ? toExamPercent(compatible.correct, compatible.total)
        : readTopicExamPercent(topicId),
    );
    setReady(true);
  }, [exercises.length, topicId]);

  const handleSessionChange = useCallback(
    (session: ExamSession) => {
      const next: TopicExamDraft = {
        active: true,
        index: session.index,
        correct: session.correct,
        total: session.total,
        slots: session.slots,
      };
      writeTopicExamDraft(topicId, next);
      setDraft(next);
      setPercent(toExamPercent(session.correct, session.total));
    },
    [topicId],
  );

  if (!ready) {
    return null;
  }

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExamQuestions")}
      </p>
    );
  }

  function handleComplete(result: { correct: number; total: number }) {
    if (didPassTopicExamScore(result.correct, result.total)) {
      clearTopicExamDraft(topicId);
      markTopicExamPassed(topicId);
      setDraft(null);
      setPercent(100);
      setOutcome("passed");
      return;
    }
    setOutcome("failed");
  }

  if (outcome === "passed") {
    return (
      <Alert className="mx-auto max-w-lg border-emerald-500/40 bg-emerald-500/10">
        <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
        <AlertTitle>{t("topicExamPassedTitle")}</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{t("topicExamPassedBody")}</p>
          <ButtonLink href="/panelim#konular" size="sm">
            {t("examBackToTopics")}
          </ButtonLink>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {outcome === "failed" ? (
        <Alert className="border-amber-500/40 bg-amber-500/10">
          <AlertTitle>{t("topicExamFailedTitle")}</AlertTitle>
          <AlertDescription>{t("topicExamFailedBody")}</AlertDescription>
        </Alert>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("topicExamIntro", {
              questionCount: exercises.length,
              optionCount: exercises[0]?.options.length ?? 4,
            })}
          </p>
          <ExamPercentBadge percent={percent} />
        </div>
      )}
      {outcome === "failed" ? (
        <div className="flex justify-end">
          <ExamPercentBadge percent={percent} />
        </div>
      ) : null}
      <MultipleChoiceExercises
        exercises={exercises}
        initialIndex={draft?.active ? draft.index : 0}
        initialSlots={draft?.active ? draft.slots : undefined}
        onSessionChange={handleSessionChange}
        onComplete={handleComplete}
      />
    </div>
  );
}
