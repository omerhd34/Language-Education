"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import type { MultipleChoiceExercise } from "@/data/topics/types";
import { didPassTopicExamScore } from "@/lib/topicExam";
import { markTopicExamPassed } from "@/lib/topicProgressStorage";

type TopicExamViewProps = {
  topicId: string;
  exercises: MultipleChoiceExercise[];
};

type ExamOutcome = "passed" | "failed";

export function TopicExamView({ topicId, exercises }: TopicExamViewProps) {
  const t = useTranslations("Topic");
  const [outcome, setOutcome] = useState<ExamOutcome | null>(null);

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExamQuestions")}
      </p>
    );
  }

  function handleComplete(result: { correct: number; total: number }) {
    if (didPassTopicExamScore(result.correct, result.total)) {
      markTopicExamPassed(topicId);
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

  if (outcome === "failed") {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert className="border-amber-500/40 bg-amber-500/10">
          <AlertTitle>{t("topicExamFailedTitle")}</AlertTitle>
          <AlertDescription>{t("topicExamFailedBody")}</AlertDescription>
        </Alert>
        <MultipleChoiceExercises
          exercises={exercises}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("topicExamIntro")}
      </p>
      <MultipleChoiceExercises
        exercises={exercises}
        onComplete={handleComplete}
      />
    </div>
  );
}
