/* eslint-disable react-hooks/refs */
"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CrosswordExerciseView } from "@/components/features/topics/CrosswordExerciseView";
import { ExerciseTypePicker } from "@/components/features/topics/ExerciseTypePicker";
import { FillBlankExercises } from "@/components/features/topics/FillBlankExercises";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import { ErrorCorrectionExercises } from "@/components/features/topics/ErrorCorrectionExercises";
import { ListeningExercises } from "@/components/features/topics/ListeningExercises";
import { TopicMixedQuizExercises } from "@/components/features/topics/TopicMixedQuizExercises";
import type {
  CrosswordExercise,
  ErrorCorrectionExercise,
  FillBlankExercise,
  ListeningExercise,
  MultipleChoiceExercise,
  TopicQuizExercise,
} from "@/data/grammar/types";
import { clearCrosswordDraft } from "@/lib/exerciseDraftStorage";
import { totalCrosswordClueCount } from "@/lib/exerciseTypeProgress";
import { didPassTopicExamScore } from "@/lib/topicExam";
import {
  emptyTopicExamDraft,
  readTopicExamDraft,
  writeTopicExamDraft,
  type TopicExamDraft,
  type TopicExamPartDraft,
  type TopicQuizPart,
} from "@/lib/topicExamDraftStorage";
import {
  isTopicExamPassed,
  markTopicExamPassed,
} from "@/lib/topicProgressStorage";
import {
  buildQuizOrderIds,
  orderItemsByIds,
  quizPartProgressPercent,
  quizPartSessionStarted,
} from "@/lib/topicQuizOrder";

type TopicExamViewProps = {
  topicId: string;
  multipleChoice: MultipleChoiceExercise[];
  fillBlanks: FillBlankExercise[];
  crosswords: CrosswordExercise[];
  mixedQuiz?: TopicQuizExercise[];
  listeningQuiz?: ListeningExercise[];
  errorCorrectionQuiz?: ErrorCorrectionExercise[];
  quizIntro?: string;
};

type PartOutcome = "passed" | "failed";

type PartSession = {
  index: number;
  correct: number;
  total: number;
  slots: TopicExamPartDraft["slots"];
};

function defaultQuizPart(
  multipleChoice: MultipleChoiceExercise[],
  fillBlanks: FillBlankExercise[],
  crosswords: CrosswordExercise[],
): TopicQuizPart {
  if (multipleChoice.length > 0) {
    return "multiple_choice";
  }
  if (fillBlanks.length > 0) {
    return "fill_blank";
  }
  return "crossword";
}

export function TopicExamView({
  topicId,
  multipleChoice,
  fillBlanks,
  crosswords,
  mixedQuiz = [],
  listeningQuiz = [],
  errorCorrectionQuiz = [],
  quizIntro,
}: TopicExamViewProps) {
  const t = useTranslations("Topic");
  const examCrosswordDraftKey = `topic:${topicId}:exam:crossword`;
  const isMixedQuiz = mixedQuiz.length > 0;
  const isListeningQuiz = listeningQuiz.length > 0;
  const isErrorCorrectionQuiz = errorCorrectionQuiz.length > 0;
  const requiredParts = useMemo<TopicQuizPart[]>(() => {
    if (isListeningQuiz) {
      return ["listening"];
    }
    if (isErrorCorrectionQuiz) {
      return ["error_correction"];
    }
    if (isMixedQuiz) {
      return ["mixed"];
    }
    const parts: TopicQuizPart[] = [];
    if (multipleChoice.length > 0) {
      parts.push("multiple_choice");
    }
    if (fillBlanks.length > 0) {
      parts.push("fill_blank");
    }
    if (crosswords.length > 0) {
      parts.push("crossword");
    }
    return parts;
  }, [
    crosswords.length,
    errorCorrectionQuiz.length,
    fillBlanks.length,
    isErrorCorrectionQuiz,
    isListeningQuiz,
    isMixedQuiz,
    multipleChoice.length,
  ]);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<TopicExamDraft>(emptyTopicExamDraft());
  const [selected, setSelected] = useState<TopicQuizPart | null>(null);
  const [partOutcome, setPartOutcome] = useState<PartOutcome | null>(null);
  const freshMixedOrderRef = useRef<string[] | null>(null);
  const freshListeningOrderRef = useRef<string[] | null>(null);
  const freshErrorCorrectionOrderRef = useRef<string[] | null>(null);
  const freshMultipleChoiceOrderRef = useRef<string[] | null>(null);

  const mixedSessionStarted = useMemo(
    () => quizPartSessionStarted("mixed", draft.parts.mixed),
    [draft.parts.mixed],
  );

  const multipleChoiceSessionStarted = useMemo(
    () =>
      quizPartSessionStarted("multiple_choice", draft.parts.multiple_choice),
    [draft.parts.multiple_choice],
  );

  const mixedOrderIds = useMemo(() => {
    if (mixedQuiz.length === 0) {
      return [] as string[];
    }
    const saved = draft.quizOrderByPart?.mixed;
    if (mixedSessionStarted && saved?.length === mixedQuiz.length) {
      return saved;
    }
    if (!mixedSessionStarted) {
      if (
        !freshMixedOrderRef.current ||
        freshMixedOrderRef.current.length !== mixedQuiz.length
      ) {
        freshMixedOrderRef.current = buildQuizOrderIds(
          mixedQuiz,
          undefined,
          false,
        );
      }
      return freshMixedOrderRef.current;
    }
    if (
      freshMixedOrderRef.current &&
      freshMixedOrderRef.current.length === mixedQuiz.length
    ) {
      return freshMixedOrderRef.current;
    }
    return mixedQuiz.map((item) => item.id);
  }, [draft.quizOrderByPart?.mixed, mixedQuiz, mixedSessionStarted]);

  const orderedMixedQuiz = useMemo(
    () => orderItemsByIds(mixedQuiz, mixedOrderIds),
    [mixedOrderIds, mixedQuiz],
  );

  const listeningSessionStarted = useMemo(
    () => quizPartSessionStarted("listening", draft.parts.listening),
    [draft.parts.listening],
  );

  const listeningOrderIds = useMemo(() => {
    if (listeningQuiz.length === 0) {
      return [] as string[];
    }
    const saved = draft.quizOrderByPart?.listening;
    if (listeningSessionStarted && saved?.length === listeningQuiz.length) {
      return saved;
    }
    if (!listeningSessionStarted) {
      if (
        !freshListeningOrderRef.current ||
        freshListeningOrderRef.current.length !== listeningQuiz.length
      ) {
        freshListeningOrderRef.current = buildQuizOrderIds(
          listeningQuiz,
          undefined,
          false,
        );
      }
      return freshListeningOrderRef.current;
    }
    if (
      freshListeningOrderRef.current &&
      freshListeningOrderRef.current.length === listeningQuiz.length
    ) {
      return freshListeningOrderRef.current;
    }
    return listeningQuiz.map((item) => item.id);
  }, [
    draft.quizOrderByPart?.listening,
    listeningQuiz,
    listeningSessionStarted,
  ]);

  const orderedListeningQuiz = useMemo(
    () => orderItemsByIds(listeningQuiz, listeningOrderIds),
    [listeningOrderIds, listeningQuiz],
  );

  const errorCorrectionSessionStarted = useMemo(
    () =>
      quizPartSessionStarted("error_correction", draft.parts.error_correction),
    [draft.parts.error_correction],
  );

  const errorCorrectionOrderIds = useMemo(() => {
    if (errorCorrectionQuiz.length === 0) {
      return [] as string[];
    }
    const saved = draft.quizOrderByPart?.error_correction;
    if (
      errorCorrectionSessionStarted &&
      saved?.length === errorCorrectionQuiz.length
    ) {
      return saved;
    }
    if (!errorCorrectionSessionStarted) {
      if (
        !freshErrorCorrectionOrderRef.current ||
        freshErrorCorrectionOrderRef.current.length !==
          errorCorrectionQuiz.length
      ) {
        freshErrorCorrectionOrderRef.current = buildQuizOrderIds(
          errorCorrectionQuiz,
          undefined,
          false,
        );
      }
      return freshErrorCorrectionOrderRef.current;
    }
    if (
      freshErrorCorrectionOrderRef.current &&
      freshErrorCorrectionOrderRef.current.length === errorCorrectionQuiz.length
    ) {
      return freshErrorCorrectionOrderRef.current;
    }
    return errorCorrectionQuiz.map((item) => item.id);
  }, [
    draft.quizOrderByPart?.error_correction,
    errorCorrectionQuiz,
    errorCorrectionSessionStarted,
  ]);

  const orderedErrorCorrectionQuiz = useMemo(
    () => orderItemsByIds(errorCorrectionQuiz, errorCorrectionOrderIds),
    [errorCorrectionOrderIds, errorCorrectionQuiz],
  );

  const multipleChoiceOrderIds = useMemo(() => {
    if (multipleChoice.length === 0) {
      return [] as string[];
    }
    const saved = draft.quizOrderByPart?.multiple_choice;
    if (
      multipleChoiceSessionStarted &&
      saved?.length === multipleChoice.length
    ) {
      return saved;
    }
    if (!multipleChoiceSessionStarted) {
      if (
        !freshMultipleChoiceOrderRef.current ||
        freshMultipleChoiceOrderRef.current.length !== multipleChoice.length
      ) {
        freshMultipleChoiceOrderRef.current = buildQuizOrderIds(
          multipleChoice,
          undefined,
          false,
        );
      }
      return freshMultipleChoiceOrderRef.current;
    }
    if (
      freshMultipleChoiceOrderRef.current &&
      freshMultipleChoiceOrderRef.current.length === multipleChoice.length
    ) {
      return freshMultipleChoiceOrderRef.current;
    }
    return multipleChoice.map((item) => item.id);
  }, [
    draft.quizOrderByPart?.multiple_choice,
    multipleChoice,
    multipleChoice.length,
    multipleChoiceSessionStarted,
  ]);

  const orderedMultipleChoice = useMemo(
    () => orderItemsByIds(multipleChoice, multipleChoiceOrderIds),
    [multipleChoice, multipleChoiceOrderIds],
  );

  useEffect(() => {
    freshMixedOrderRef.current = null;
    freshListeningOrderRef.current = null;
    freshErrorCorrectionOrderRef.current = null;
    freshMultipleChoiceOrderRef.current = null;
  }, [topicId]);

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
    setDraft(next);
    setReady(true);
  }, [
    crosswords.length,
    fillBlanks.length,
    multipleChoice.length,
    requiredParts,
    topicId,
  ]);

  const saveDraft = useCallback(
    (next: TopicExamDraft) => {
      writeTopicExamDraft(topicId, next);
      setDraft(next);
    },
    [topicId],
  );

  const handleSessionChange = useCallback(
    (
      part: TopicQuizPart,
      session: PartSession,
      lockOrderIds?: readonly string[],
    ) => {
      const current = readTopicExamDraft(topicId) ?? emptyTopicExamDraft();
      const hasProgress =
        session.index > 0 || session.slots.some((slot) => slot.checked);
      const quizOrderByPart = { ...current.quizOrderByPart };
      if (
        hasProgress &&
        lockOrderIds &&
        lockOrderIds.length > 0 &&
        !quizOrderByPart[part]?.length
      ) {
        quizOrderByPart[part] = [...lockOrderIds];
      }

      const partDraft = {
        active: true,
        index: session.index,
        correct: session.correct,
        total: session.total,
        slots: session.slots,
      };

      const nextParts = { ...current.parts, [part]: partDraft };
      const next: TopicExamDraft = {
        ...current,
        requiredParts,
        quizOrderByPart,
        parts: nextParts,
      };

      const prevPart = current.parts[part];
      const orderUnchanged =
        quizOrderByPart[part]?.join("|") ===
        current.quizOrderByPart?.[part]?.join("|");
      const partUnchanged =
        prevPart?.index === partDraft.index &&
        prevPart.correct === partDraft.correct &&
        prevPart.total === partDraft.total &&
        prevPart.slots.length === partDraft.slots.length &&
        prevPart.slots.every((slot, slotIndex) => {
          const nextSlot = partDraft.slots[slotIndex];
          return (
            nextSlot !== undefined &&
            slot.selected === nextSlot.selected &&
            slot.answer === nextSlot.answer &&
            slot.checked === nextSlot.checked
          );
        });

      if (orderUnchanged && partUnchanged) {
        return;
      }

      saveDraft(next);
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
      handleSessionChange(
        "multiple_choice",
        {
          ...session,
          slots: session.slots.map((slot) => ({
            selected: slot.selected,
            answer: "",
            checked: slot.checked,
          })),
        },
        multipleChoiceOrderIds,
      );
    },
    [handleSessionChange, multipleChoiceOrderIds],
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

  const handleMixedQuizSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: {
        selected: number | null;
        answer: string;
        checked: boolean;
      }[];
    }) => {
      handleSessionChange("mixed", session, mixedOrderIds);
    },
    [handleSessionChange, mixedOrderIds],
  );

  const handleListeningSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: {
        englishSelected: number | null;
        turkishSelected: number | null;
        v2Selected: number | null;
        checked: boolean;
      }[];
    }) => {
      handleSessionChange(
        "listening",
        {
          index: session.index,
          correct: session.correct,
          total: session.total,
          slots: session.slots.map((slot) => ({
            selected: slot.englishSelected,
            answer:
              slot.turkishSelected !== null ? String(slot.turkishSelected) : "",
            checked: slot.checked,
            englishSelected: slot.englishSelected,
            turkishSelected: slot.turkishSelected,
            v2Selected: slot.v2Selected,
          })),
        },
        listeningOrderIds,
      );
    },
    [handleSessionChange, listeningOrderIds],
  );

  const handleErrorCorrectionSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: {
        selected: number | null;
        answer: string;
        checked: boolean;
      }[];
    }) => {
      handleSessionChange("error_correction", session, errorCorrectionOrderIds);
    },
    [errorCorrectionOrderIds, handleSessionChange],
  );

  const handleCrosswordProgress = useCallback(
    (percent: number) => {
      handleSessionChange("crossword", {
        index: 0,
        correct: percent,
        total: 100,
        slots: [],
      });
    },
    [handleSessionChange],
  );

  const clearPartPass = useCallback(
    (part: TopicQuizPart) => {
      if (part === "crossword") {
        clearCrosswordDraft(examCrosswordDraftKey);
      }
      if (part === "mixed") {
        freshMixedOrderRef.current = null;
      }
      if (part === "listening") {
        freshListeningOrderRef.current = null;
      }
      if (part === "error_correction") {
        freshErrorCorrectionOrderRef.current = null;
      }
      if (part === "multiple_choice") {
        freshMultipleChoiceOrderRef.current = null;
      }
      const current = readTopicExamDraft(topicId) ?? emptyTopicExamDraft();
      const quizOrderByPart = { ...current.quizOrderByPart };
      delete quizOrderByPart[part];
      saveDraft({
        ...current,
        passedParts: current.passedParts.filter((item) => item !== part),
        parts: {
          ...current.parts,
          [part]: undefined,
        },
        quizOrderByPart,
      });
    },
    [examCrosswordDraftKey, saveDraft, topicId],
  );

  if (!ready) {
    return null;
  }

  if (
    !isMixedQuiz &&
    !isListeningQuiz &&
    !isErrorCorrectionQuiz &&
    multipleChoice.length === 0 &&
    fillBlanks.length === 0 &&
    crosswords.length === 0
  ) {
    return <p className="page-subtitle mt-0">{t("noExamQuestions")}</p>;
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
  const showPicker = requiredParts.length > 1;

  if (showPicker && !selected) {
    return (
      <div className="space-y-4">
        {allPassed ? (
          <Alert className="border-emerald-500/40 bg-emerald-500/10">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />
            <AlertTitle>{t("topicExamPassedTitle")}</AlertTitle>
            <AlertDescription>{t("topicExamPassedBody")}</AlertDescription>
          </Alert>
        ) : null}
        <ExerciseTypePicker
          counts={{
            multiple_choice: multipleChoice.length,
            true_false: 0,
            fill_blank: fillBlanks.length,
            crossword: totalCrosswordClueCount(crosswords),
            listening: 0,
            matching: 0,
            mixed: 0,
          }}
          completedTypes={draft.passedParts.filter(
            (
              part,
            ): part is Exclude<TopicQuizPart, "mixed" | "error_correction"> =>
              part !== "mixed" && part !== "error_correction",
          )}
          progressPercents={{
            multiple_choice: quizPartProgressPercent(
              "multiple_choice",
              draft.parts.multiple_choice,
              draft.passedParts.includes("multiple_choice"),
            ),
            fill_blank: quizPartProgressPercent(
              "fill_blank",
              draft.parts.fill_blank,
              draft.passedParts.includes("fill_blank"),
            ),
            crossword: quizPartProgressPercent(
              "crossword",
              draft.parts.crossword,
              draft.passedParts.includes("crossword"),
            ),
          }}
          title={t("quizChooseTitle")}
          subtitle={t("quizChooseSubtitle")}
          onSelect={(type) => {
            if (
              type !== "multiple_choice" &&
              type !== "fill_blank" &&
              type !== "crossword"
            ) {
              return;
            }
            setPartOutcome(null);
            setSelected(type);
          }}
        />
      </div>
    );
  }

  const activePart: TopicQuizPart = isListeningQuiz
    ? "listening"
    : isErrorCorrectionQuiz
      ? "error_correction"
      : isMixedQuiz
        ? "mixed"
        : (selected ?? defaultQuizPart(multipleChoice, fillBlanks, crosswords));
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
        <p className="page-subtitle mt-0">
          {quizIntro ?? t("quizSingleIntro")}
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
          <ButtonLink href="/panel#grammer" size="sm">
            {t("examBackToTopics")}
          </ButtonLink>
        )
      ) : activePart === "listening" ? (
        <ListeningExercises
          key={`listening-quiz-${listeningOrderIds.join("|")}`}
          exercises={orderedListeningQuiz}
          initialIndex={
            listeningSessionStarted &&
            partDraft &&
            partDraft.slots.length === orderedListeningQuiz.length
              ? partDraft.index
              : 0
          }
          initialSlots={
            listeningSessionStarted &&
            partDraft &&
            partDraft.slots.length === orderedListeningQuiz.length
              ? partDraft.slots.map((slot) => ({
                  englishSelected:
                    slot.englishSelected ?? slot.selected ?? null,
                  turkishSelected:
                    slot.turkishSelected ??
                    (slot.answer.length > 0 && /^\d+$/.test(slot.answer)
                      ? Number(slot.answer)
                      : null),
                  v2Selected: slot.v2Selected ?? null,
                  checked: slot.checked,
                }))
              : undefined
          }
          onSessionChange={handleListeningSession}
          onRestart={() => clearPartPass("listening")}
          onComplete={(result) => handleComplete("listening", result)}
        />
      ) : activePart === "error_correction" ? (
        <ErrorCorrectionExercises
          key={`error-correction-${errorCorrectionOrderIds.join("|")}`}
          exercises={orderedErrorCorrectionQuiz}
          showHint={false}
          liveProgressPercent={false}
          initialIndex={
            errorCorrectionSessionStarted &&
            partDraft &&
            partDraft.slots.length === orderedErrorCorrectionQuiz.length
              ? partDraft.index
              : 0
          }
          initialSlots={
            errorCorrectionSessionStarted &&
            partDraft &&
            partDraft.slots.length === orderedErrorCorrectionQuiz.length
              ? partDraft.slots.map((slot) => ({
                  selected: slot.selected,
                  answer: slot.answer,
                  checked: slot.checked,
                }))
              : undefined
          }
          onSessionChange={handleErrorCorrectionSession}
          onRestart={() => clearPartPass("error_correction")}
          onComplete={(result) => handleComplete("error_correction", result)}
        />
      ) : activePart === "mixed" ? (
        <TopicMixedQuizExercises
          key={`mixed-quiz-${mixedOrderIds.join("|")}`}
          exercises={orderedMixedQuiz}
          showHint={false}
          liveProgressPercent={false}
          initialIndex={
            mixedSessionStarted &&
            partDraft &&
            partDraft.slots.length === orderedMixedQuiz.length
              ? partDraft.index
              : 0
          }
          initialSlots={
            mixedSessionStarted &&
            partDraft &&
            partDraft.slots.length === orderedMixedQuiz.length
              ? partDraft.slots.map((slot) => ({
                  selected: slot.selected,
                  answer: slot.answer,
                  checked: slot.checked,
                }))
              : undefined
          }
          onSessionChange={handleMixedQuizSession}
          onRestart={() => clearPartPass("mixed")}
          onComplete={(result) => handleComplete("mixed", result)}
        />
      ) : activePart === "crossword" ? (
        <CrosswordExerciseView
          key={`exam-cw-${crosswords[0]?.id ?? "cw"}`}
          exercises={crosswords}
          draftKey={examCrosswordDraftKey}
          liveProgressPercent={false}
          onProgress={handleCrosswordProgress}
          onRestart={() => clearPartPass("crossword")}
          onComplete={(result) => handleComplete("crossword", result)}
        />
      ) : activePart === "fill_blank" ? (
        <FillBlankExercises
          key="fill_blank"
          exercises={fillBlanks}
          liveProgressPercent={false}
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
          key={`multiple_choice-${multipleChoiceOrderIds.join("|")}`}
          exercises={orderedMultipleChoice}
          liveProgressPercent={false}
          initialIndex={
            partDraft && partDraft.slots.length === orderedMultipleChoice.length
              ? partDraft.index
              : 0
          }
          initialSlots={
            partDraft && partDraft.slots.length === orderedMultipleChoice.length
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
