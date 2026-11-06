/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ExerciseTypePicker } from "@/components/features/topics/ExerciseTypePicker";
import { FillBlankExercises } from "@/components/features/topics/FillBlankExercises";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import type {
  FillBlankExercise,
  MultipleChoiceExercise,
} from "@/data/topics/types";
import { didPassTopicExamScore } from "@/lib/topicExam";
import {
  emptyTopicExamDraft,
  readTopicExamDraft,
  toExamPercent,
  writeTopicExamDraft,
  type TopicExamDraft,
  type TopicExamPartDraft,
  type TopicQuizPart,
} from "@/lib/topicExamDraftStorage";
import {
  isTopicExamPassed,
  markTopicExamPassed,
} from "@/lib/topicProgressStorage";

type TopicExamViewProps = {
  topicId: string;
  multipleChoice: MultipleChoiceExercise[];
  fillBlanks: FillBlankExercise[];
};

type PartOutcome = "passed" | "failed";

type PartSession = {
  index: number;
  correct: number;
  total: number;
  slots: TopicExamPartDraft["slots"];
};

function partProgress(draft: TopicExamDraft, part: TopicQuizPart): number {
  const item = draft.parts[part];
  if (item?.active) {
    const checked = item.slots.filter((slot) => slot.checked).length;
    const total = item.total > 0 ? item.total : item.slots.length;
    return toExamPercent(checked, total);
  }
  if (draft.passedParts.includes(part)) {
    return 100;
  }
  return 0;
}

export function TopicExamView({
  topicId,
  multipleChoice,
  fillBlanks,
}: TopicExamViewProps) {
  const t = useTranslations("Topic");
  const requiredParts = useMemo<TopicQuizPart[]>(() => {
    const parts: TopicQuizPart[] = [];
    if (multipleChoice.length > 0) {
      parts.push("multiple_choice");
    }
    if (fillBlanks.length > 0) {
      parts.push("fill_blank");
    }
    return parts;
  }, [fillBlanks.length, multipleChoice.length]);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<TopicExamDraft>(emptyTopicExamDraft());
  const [selected, setSelected] = useState<TopicQuizPart | null>(null);
  const [partOutcome, setPartOutcome] = useState<PartOutcome | null>(null);

  useEffect(() => {
    const saved = readTopicExamDraft(topicId) ?? emptyTopicExamDraft();
    let passedParts = saved.passedParts.filter((part) =>
      requiredParts.includes(part),
    );
    const anyActive = requiredParts.some((part) => saved.parts[part]?.active);
    if (passedParts.length === 0 && !anyActive && isTopicExamPassed(topicId)) {
      passedParts = [...requiredParts];
    }

    const next: TopicExamDraft = {
      ...saved,
      requiredParts,
      passedParts,
    };
    writeTopicExamDraft(topicId, next);
    setDraft(next);
    setReady(true);
  }, [fillBlanks.length, multipleChoice.length, requiredParts, topicId]);

  const saveDraft = useCallback(
    (next: TopicExamDraft) => {
      writeTopicExamDraft(topicId, next);
      setDraft(next);
    },
    [topicId],
  );

  const handleSessionChange = useCallback(
    (part: TopicQuizPart, session: PartSession) => {
      const current = readTopicExamDraft(topicId) ?? emptyTopicExamDraft();
      saveDraft({
        ...current,
        requiredParts,
        parts: {
          ...current.parts,
          [part]: {
            active: true,
            index: session.index,
            correct: session.correct,
            total: session.total,
            slots: session.slots,
          },
        },
      });
    },
    [requiredParts, saveDraft, topicId],
  );

  const handleMultipleChoiceSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: { selected: number | null; checked: boolean }[];
    }) => {
      handleSessionChange("multiple_choice", {
        ...session,
        slots: session.slots.map((slot) => ({
          selected: slot.selected,
          answer: "",
          checked: slot.checked,
        })),
      });
    },
    [handleSessionChange],
  );

  const handleFillBlankSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: { answer: string; checked: boolean }[];
    }) => {
      handleSessionChange("fill_blank", {
        ...session,
        slots: session.slots.map((slot) => ({
          selected: null,
          answer: slot.answer,
          checked: slot.checked,
        })),
      });
    },
    [handleSessionChange],
  );

  const clearPartPass = useCallback(
    (part: TopicQuizPart) => {
      const current = readTopicExamDraft(topicId) ?? emptyTopicExamDraft();
      saveDraft({
        ...current,
        passedParts: current.passedParts.filter((item) => item !== part),
      });
    },
    [saveDraft, topicId],
  );

  if (!ready) {
    return null;
  }

  if (multipleChoice.length === 0 && fillBlanks.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExamQuestions")}
      </p>
    );
  }

  function handleComplete(
    part: TopicQuizPart,
    result: { correct: number; total: number },
  ) {
    const current = readTopicExamDraft(topicId) ?? draft;
    if (!didPassTopicExamScore(result.correct, result.total)) {
      setPartOutcome("failed");
      return;
    }

    const passedParts = current.passedParts.includes(part)
      ? current.passedParts
      : [...current.passedParts, part];
    const partDraft = current.parts[part];
    const next: TopicExamDraft = {
      ...current,
      requiredParts,
      passedParts,
      parts: {
        ...current.parts,
        [part]: partDraft ? { ...partDraft, active: false } : partDraft,
      },
    };
    saveDraft(next);

    if (requiredParts.every((item) => passedParts.includes(item))) {
      markTopicExamPassed(topicId);
    }
    setPartOutcome("passed");
  }

  const allPassed = requiredParts.every((part) =>
    draft.passedParts.includes(part),
  );
  const showPicker = fillBlanks.length > 0 && multipleChoice.length > 0;

  if (showPicker && !selected) {
    return (
      <div className="space-y-4">
        {allPassed ? (
          <Alert className="border-emerald-500/40 bg-emerald-500/10">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
            <AlertTitle>{t("topicExamPassedTitle")}</AlertTitle>
            <AlertDescription>{t("topicExamPassedBody")}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-brand-600 dark:text-brand-400">
            {t("topicExamIntro")}
          </p>
        )}
        <ExerciseTypePicker
          counts={{
            multiple_choice: multipleChoice.length,
            fill_blank: fillBlanks.length,
            crossword: 0,
            listening: 0,
          }}
          completedTypes={draft.passedParts}
          progressPercents={{
            multiple_choice: partProgress(draft, "multiple_choice"),
            fill_blank: partProgress(draft, "fill_blank"),
          }}
          title={t("quizChooseTitle")}
          subtitle={t("quizChooseSubtitle")}
          onSelect={(type) => {
            if (type !== "multiple_choice" && type !== "fill_blank") {
              return;
            }
            setPartOutcome(null);
            setSelected(type);
          }}
        />
      </div>
    );
  }

  const activePart: TopicQuizPart =
    selected ?? (multipleChoice.length > 0 ? "multiple_choice" : "fill_blank");
  const partDraft = draft.parts[activePart];

  return (
    <div className="space-y-4">
      {showPicker ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setSelected(null);
            setPartOutcome(null);
          }}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("quizBackToParts")}
        </Button>
      ) : (
        <p className="text-sm text-brand-600 dark:text-brand-400">
          {t("quizSingleIntro")}
        </p>
      )}

      {partOutcome === "failed" ? (
        <Alert className="border-amber-500/40 bg-amber-500/10">
          <AlertTitle>{t("topicExamFailedTitle")}</AlertTitle>
          <AlertDescription>{t("topicExamFailedBody")}</AlertDescription>
        </Alert>
      ) : null}

      {partOutcome === "passed" ? (
        <Alert className="border-emerald-500/40 bg-emerald-500/10">
          <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
          <AlertTitle>
            {allPassed ? t("topicExamPassedTitle") : t("quizPartPassedTitle")}
          </AlertTitle>
          <AlertDescription>
            {allPassed ? t("topicExamPassedBody") : t("quizPartPassedBody")}
          </AlertDescription>
        </Alert>
      ) : null}

      {partOutcome === "passed" ? (
        showPicker ? null : (
          <ButtonLink href="/panel#dilbilgisi" size="sm">
            {t("examBackToTopics")}
          </ButtonLink>
        )
      ) : activePart === "fill_blank" ? (
        <FillBlankExercises
          key="fill_blank"
          exercises={fillBlanks}
          initialIndex={
            partDraft && partDraft.slots.length === fillBlanks.length
              ? partDraft.index
              : 0
          }
          initialSlots={
            partDraft && partDraft.slots.length === fillBlanks.length
              ? partDraft.slots.map((slot) => ({
                  answer: slot.answer,
                  checked: slot.checked,
                }))
              : undefined
          }
          onSessionChange={handleFillBlankSession}
          onRestart={() => clearPartPass("fill_blank")}
          onComplete={(result) => handleComplete("fill_blank", result)}
        />
      ) : (
        <MultipleChoiceExercises
          key="multiple_choice"
          exercises={multipleChoice}
          initialIndex={
            partDraft && partDraft.slots.length === multipleChoice.length
              ? partDraft.index
              : 0
          }
          initialSlots={
            partDraft && partDraft.slots.length === multipleChoice.length
              ? partDraft.slots.map((slot) => ({
                  selected: slot.selected,
                  checked: slot.checked,
                }))
              : undefined
          }
          onSessionChange={handleMultipleChoiceSession}
          onRestart={() => clearPartPass("multiple_choice")}
          onComplete={(result) => handleComplete("multiple_choice", result)}
        />
      )}
    </div>
  );
}
