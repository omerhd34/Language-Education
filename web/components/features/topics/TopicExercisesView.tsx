/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CrosswordExerciseView } from "@/components/features/topics/CrosswordExerciseView";
import { ExerciseTypePicker } from "@/components/features/topics/ExerciseTypePicker";
import { FillBlankExercises } from "@/components/features/topics/FillBlankExercises";
import { ListeningExercises } from "@/components/features/topics/ListeningExercises";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import type { CefrLevel } from "@/data/dashboardTopics";
import type {
  CrosswordExercise,
  ExerciseType,
  FillBlankExercise,
  ListeningExercise,
  MultipleChoiceExercise,
  TopicExercise,
} from "@/data/topics/types";
import { didPassExamScore, markLevelExamPassed } from "@/lib/levelExamStorage";
import { resolveLevelExamCrosswords } from "@/lib/topicExam";
import {
  TOPIC_PROGRESS_CHANGED_EVENT,
  getCompletedTopicExerciseTypes,
  markTopicExerciseTypeCompleted,
} from "@/lib/topicProgressStorage";
import { getNextLevel } from "@/lib/topicAccess";

type TopicExercisesViewProps = {
  topicId?: string;
  exercises: TopicExercise[];
  isExam?: boolean;
  level?: CefrLevel;
};

type ExamOutcome = "passed" | "failed";

export function TopicExercisesView({
  topicId,
  exercises,
  isExam = false,
  level,
}: TopicExercisesViewProps) {
  const t = useTranslations("Topic");
  const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);
  const [examOutcome, setExamOutcome] = useState<ExamOutcome | null>(null);
  const [completedTypes, setCompletedTypes] = useState<ExerciseType[]>([]);
  const nextLevel = level ? getNextLevel(level) : null;

  const levelExamCrosswords = useMemo(() => {
    if (!isExam || !level) {
      return [] as CrosswordExercise[];
    }
    return resolveLevelExamCrosswords(level);
  }, [isExam, level]);

  useEffect(() => {
    if (!topicId) {
      setCompletedTypes([]);
      return;
    }

    function refresh() {
      setCompletedTypes(getCompletedTopicExerciseTypes(topicId!));
    }

    refresh();
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [topicId]);

  const counts = useMemo(
    () => ({
      multiple_choice: exercises.filter(
        (item) => item.type === "multiple_choice",
      ).length,
      fill_blank: exercises.filter((item) => item.type === "fill_blank").length,
      crossword: exercises.filter((item) => item.type === "crossword").length,
      listening: exercises.filter((item) => item.type === "listening").length,
    }),
    [exercises],
  );

  function handleLevelExamComplete(result: {
    correct: number;
    total: number;
  }) {
    if (!level) {
      return;
    }

    if (didPassExamScore(result.correct, result.total)) {
      markLevelExamPassed(level);
      setExamOutcome("passed");
      return;
    }

    setExamOutcome("failed");
  }

  function handleSessionComplete(result: { correct: number; total: number }) {
    if (topicId && selectedType) {
      markTopicExerciseTypeCompleted(topicId, selectedType);
    }

    if (!isExam || !level) {
      return;
    }

    handleLevelExamComplete(result);
  }

  if (isExam && level) {
    if (levelExamCrosswords.length === 0) {
      return (
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("noExamQuestions")}
        </p>
      );
    }

    if (examOutcome === "passed") {
      return (
        <div
          className="dashboard-panel mx-auto max-w-lg space-y-3 border-emerald-500/40 bg-emerald-500/10 text-center"
          role="status"
        >
          <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
            {t("examPassedTitle")}
          </h2>
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {nextLevel
              ? t("examPassedBody", { nextLevel })
              : t("examPassedBodyFinal")}
          </p>
          <ButtonLink href="/panelim#konular" size="sm">
            {t("examBackToTopics")}
          </ButtonLink>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {examOutcome === "failed" ? (
          <div
            className="dashboard-panel space-y-3 border-amber-500/40 bg-amber-500/10 text-center"
            role="status"
          >
            <h2 className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100">
              {t("examFailedTitle")}
            </h2>
            <p className="text-sm text-brand-600 dark:text-brand-400">
              {t("examFailedBody")}
            </p>
          </div>
        ) : (
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("levelExamIntro")}
          </p>
        )}
        <CrosswordExerciseView
          exercises={levelExamCrosswords}
          onComplete={handleLevelExamComplete}
        />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExercises")}
      </p>
    );
  }

  if (!selectedType) {
    return (
      <ExerciseTypePicker
        counts={counts}
        completedTypes={completedTypes}
        onSelect={setSelectedType}
      />
    );
  }

  const filtered = exercises.filter((item) => item.type === selectedType);
  const alreadyCompleted = completedTypes.includes(selectedType);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setSelectedType(null);
          setExamOutcome(null);
        }}
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToTypes")}
      </Button>

      {alreadyCompleted ? (
        <Alert className="border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 aria-hidden />
          <AlertTitle>{t("typeAlreadyCompletedTitle")}</AlertTitle>
          <AlertDescription>{t("typeAlreadyCompletedBody")}</AlertDescription>
        </Alert>
      ) : null}

      {selectedType === "multiple_choice" ? (
        <MultipleChoiceExercises
          exercises={filtered as MultipleChoiceExercise[]}
          onComplete={handleSessionComplete}
        />
      ) : null}

      {selectedType === "fill_blank" ? (
        <FillBlankExercises
          exercises={filtered as FillBlankExercise[]}
          onComplete={handleSessionComplete}
        />
      ) : null}

      {selectedType === "crossword" ? (
        <CrosswordExerciseView
          exercises={filtered as CrosswordExercise[]}
          onComplete={handleSessionComplete}
        />
      ) : null}

      {selectedType === "listening" ? (
        <ListeningExercises
          exercises={filtered as ListeningExercise[]}
          onComplete={handleSessionComplete}
        />
      ) : null}
    </div>
  );
}
