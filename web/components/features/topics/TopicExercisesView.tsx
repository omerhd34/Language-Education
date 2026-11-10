"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
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
import {
  LEVEL_EXAM_PROGRESS_EVENT,
  readLevelExamProgress,
  writeLevelExamPartProgress,
} from "@/lib/levelExamProgressStorage";
import {
  getLevelExamParts,
  resolveLevelExamCrosswords,
  resolveLevelExamFillBlanks,
  type LevelExamPart,
} from "@/lib/topicExam";
import {
  TOPIC_PROGRESS_CHANGED_EVENT,
  getCompletedTopicExerciseTypes,
  markTopicExerciseTypeCompleted,
  unmarkTopicExerciseTypeCompleted,
} from "@/lib/topicProgressStorage";
import {
  EXERCISE_DRAFT_EVENT,
  clearCrosswordDraft,
  clearLinearSession,
  readLinearSession,
  readSelectedExerciseType,
  writeLinearSession,
  writeSelectedExerciseType,
  type LinearSlot,
} from "@/lib/exerciseDraftStorage";
import {
  computeExerciseTypeProgress,
  crosswordDraftKey,
} from "@/lib/exerciseTypeProgress";
import { getNextLevel } from "@/lib/topicAccess";
import { VOCABULARY_EXERCISE_SHARE } from "@/lib/vocabularySectionProgress";

type TopicExercisesViewProps = {
  topicId?: string;
  progressKey?: string;
  exercises: TopicExercise[];
  isExam?: boolean;
  level?: CefrLevel;
};

type LinearSessionInput = {
  index: number;
  correct: number;
  total: number;
  slots: Array<{
    selected?: number | null;
    answer?: string;
    englishSelected?: number | null;
    turkishSelected?: number | null;
    checked: boolean;
  }>;
};

type ExamPartScore = { correct: number; total: number };
type LevelExamPartOutcome = "passed" | "failed";

function toLinearSlots(session: LinearSessionInput): LinearSlot[] {
  return session.slots.map((slot) => ({
    selected: slot.selected ?? null,
    answer: slot.answer ?? "",
    englishSelected: slot.englishSelected ?? null,
    turkishSelected: slot.turkishSelected ?? null,
    checked: slot.checked,
  }));
}

export function TopicExercisesView({
  topicId,
  progressKey,
  exercises,
  isExam = false,
  level,
}: TopicExercisesViewProps) {
  const t = useTranslations("Topic");
  const selectionKey = progressKey ?? topicId ?? null;
  const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);
  const [sessionReady, setSessionReady] = useState(isExam);
  const [sessionNonce, setSessionNonce] = useState(0);
  const [progressReady, setProgressReady] = useState(false);
  const [draftVersion, setDraftVersion] = useState(0);
  const restoredTopicRef = useRef<string | null>(null);
  const [completedTypes, setCompletedTypes] = useState<ExerciseType[]>([]);
  const nextLevel = level ? getNextLevel(level) : null;

  const [levelExamSelected, setLevelExamSelected] =
    useState<LevelExamPart | null>(null);
  const [passedLevelParts, setPassedLevelParts] = useState<LevelExamPart[]>([]);
  const [levelPartOutcome, setLevelPartOutcome] =
    useState<LevelExamPartOutcome | null>(null);
  const [levelExamPassed, setLevelExamPassed] = useState(false);
  const [levelExamCrosswords, setLevelExamCrosswords] = useState<
    CrosswordExercise[] | null
  >(null);
  const [levelExamFillBlanks, setLevelExamFillBlanks] = useState<
    FillBlankExercise[] | null
  >(null);
  const [crosswordSessionKey, setCrosswordSessionKey] = useState(0);
  const [fillBlankSessionKey, setFillBlankSessionKey] = useState(0);

  useEffect(() => {
    if (!isExam || !level) {
      setLevelExamCrosswords([]);
      setLevelExamFillBlanks([]);
      setLevelExamSelected(null);
      setPassedLevelParts([]);
      setLevelPartOutcome(null);
      setLevelExamPassed(false);
      return;
    }
    const saved = readLevelExamProgress(level);
    const restored = getLevelExamParts(level).filter(
      (part) => saved.parts[part]?.passed,
    );
    setLevelExamCrosswords(resolveLevelExamCrosswords(level));
    setLevelExamFillBlanks(resolveLevelExamFillBlanks(level));
    setLevelExamSelected(null);
    setPassedLevelParts(restored);
    setLevelPartOutcome(null);
    setLevelExamPassed(false);
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

  useEffect(() => {
    setProgressReady(true);
  }, []);

  useEffect(() => {
    function refresh() {
      setDraftVersion((value) => value + 1);
    }

    window.addEventListener(EXERCISE_DRAFT_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EXERCISE_DRAFT_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    if (isExam || !selectionKey) {
      setSessionReady(true);
      return;
    }

    if (restoredTopicRef.current === selectionKey) {
      return;
    }
    restoredTopicRef.current = selectionKey;

    const saved = readSelectedExerciseType(selectionKey);
    const available = new Set(exercises.map((item) => item.type));
    setSelectedType(saved && available.has(saved) ? saved : null);
    setSessionReady(true);
  }, [exercises, isExam, selectionKey]);

  useEffect(() => {
    if (!sessionReady || isExam || !selectionKey) {
      return;
    }
    writeSelectedExerciseType(selectionKey, selectedType);
  }, [isExam, selectedType, selectionKey, sessionReady]);

  const exerciseShare = selectionKey?.startsWith("vocabulary:")
    ? VOCABULARY_EXERCISE_SHARE
    : 100;

  const typeProgress = useMemo(() => {
    if (!progressReady) {
      return undefined;
    }

    const raw = computeExerciseTypeProgress({
      topicId,
      progressKey: selectionKey ?? undefined,
      exercises,
      completedTypes,
    });

    if (exerciseShare === 100) {
      return raw;
    }

    const scaled: Partial<Record<ExerciseType, number>> = {};
    for (const type of Object.keys(raw) as ExerciseType[]) {
      const value = raw[type] ?? 0;
      scaled[type] = Math.round((value / 100) * exerciseShare);
    }
    return scaled;
  }, [
    completedTypes,
    draftVersion,
    exerciseShare,
    exercises,
    progressReady,
    selectionKey,
    topicId,
  ]);

  const persistPracticeSession = useCallback(
    (type: ExerciseType, session: LinearSessionInput) => {
      if (!selectionKey || isExam) {
        return;
      }
      writeLinearSession(`${selectionKey}:${type}`, {
        index: session.index,
        correct: session.correct,
        total: session.total,
        slots: toLinearSlots(session),
      });
    },
    [isExam, selectionKey],
  );

  function savedPracticeSession(type: ExerciseType, total: number) {
    if (!selectionKey || isExam) {
      return null;
    }
    const saved = readLinearSession(`${selectionKey}:${type}`);
    if (!saved || saved.slots.length !== total) {
      return null;
    }
    return saved;
  }

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

  const [levelPartPercents, setLevelPartPercents] = useState<
    Partial<Record<LevelExamPart, number>>
  >({});

  useEffect(() => {
    if (!isExam || !level) {
      return;
    }

    function refresh() {
      const saved = readLevelExamProgress(level!);
      const next: Partial<Record<LevelExamPart, number>> = {};
      for (const part of getLevelExamParts(level!)) {
        const item = saved.parts[part];
        next[part] = item ? (item.passed ? 100 : item.percent) : 0;
      }
      setLevelPartPercents(next);
    }

    refresh();
    window.addEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(LEVEL_EXAM_PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [isExam, level]);

  const reportLevelPart = useCallback(
    (part: LevelExamPart, percent: number, passed: boolean) => {
      if (!level) {
        return;
      }
      const current = readLevelExamProgress(level).parts[part];
      if (current?.passed && !passed) {
        return;
      }
      writeLevelExamPartProgress(level, part, {
        percent: passed ? 100 : percent,
        passed,
      });
    },
    [level],
  );

  const handleCrosswordProgress = useCallback(
    (percent: number) => {
      reportLevelPart("crossword", percent, false);
    },
    [reportLevelPart],
  );

  const handleFillBlankSession = useCallback(
    (session: {
      index: number;
      correct: number;
      total: number;
      slots: { answer: string; checked: boolean }[];
    }) => {
      const checked = session.slots.filter((slot) => slot.checked).length;
      const percent =
        session.total <= 0 ? 0 : Math.round((checked / session.total) * 100);
      reportLevelPart("fill_blank", percent, false);
      if (level) {
        writeLinearSession(`level:${level}:fill_blank`, {
          index: session.index,
          correct: session.correct,
          total: session.total,
          slots: toLinearSlots(session),
        });
      }
    },
    [level, reportLevelPart],
  );

  const restartLevelPart = useCallback(
    (part: LevelExamPart) => {
      if (!level) {
        return;
      }
      writeLevelExamPartProgress(level, part, { percent: 0, passed: false });
      setPassedLevelParts((current) => current.filter((item) => item !== part));
    },
    [level],
  );

  const levelExamCounts = useMemo(
    () =>
      ({
        multiple_choice: 0,
        fill_blank: levelExamFillBlanks?.length ?? 0,
        crossword: levelExamCrosswords?.length ?? 0,
        listening: 0,
      }) satisfies Record<ExerciseType, number>,
    [levelExamCrosswords, levelExamFillBlanks],
  );

  function tryFinalizeLevelExam(nextPassed: LevelExamPart[]) {
    if (!level) {
      return;
    }
    const required = getLevelExamParts(level);
    if (
      required.length > 0 &&
      required.every((part) => nextPassed.includes(part))
    ) {
      markLevelExamPassed(level);
      setLevelExamPassed(true);
      setLevelExamSelected(null);
      setLevelPartOutcome(null);
    }
  }

  function handleLevelExamPartComplete(
    part: LevelExamPart,
    result: ExamPartScore,
  ) {
    const percent =
      result.total <= 0 ? 0 : Math.round((result.correct / result.total) * 100);
    if (didPassExamScore(result.correct, result.total)) {
      const nextPassed = passedLevelParts.includes(part)
        ? passedLevelParts
        : [...passedLevelParts, part];
      setPassedLevelParts(nextPassed);
      reportLevelPart(part, percent, true);
      setLevelPartOutcome("passed");
      tryFinalizeLevelExam(nextPassed);
      return;
    }

    reportLevelPart(part, percent, false);
    setLevelPartOutcome("failed");
  }

  function retryCurrentLevelPart() {
    if (!level || !levelExamSelected) {
      return;
    }
    setLevelPartOutcome(null);
    writeLevelExamPartProgress(level, levelExamSelected, {
      percent: 0,
      passed: false,
    });
    setPassedLevelParts((current) =>
      current.filter((part) => part !== levelExamSelected),
    );
    if (levelExamSelected === "crossword") {
      clearCrosswordDraft(`level:${level}:crossword`);
      setLevelExamCrosswords(resolveLevelExamCrosswords(level));
      setCrosswordSessionKey((value) => value + 1);
      return;
    }
    clearLinearSession(`level:${level}:fill_blank`);
    setLevelExamFillBlanks(resolveLevelExamFillBlanks(level));
    setFillBlankSessionKey((value) => value + 1);
  }

  function backToLevelExamPicker() {
    setLevelExamSelected(null);
    setLevelPartOutcome(null);
  }

  function handleSessionComplete() {
    if (topicId && selectedType) {
      markTopicExerciseTypeCompleted(topicId, selectedType);
    }
  }

  function handleSessionRestart() {
    if (topicId && selectedType) {
      unmarkTopicExerciseTypeCompleted(topicId, selectedType);
    }
    if (selectionKey && selectedType) {
      clearLinearSession(`${selectionKey}:${selectedType}`);
      if (selectedType === "crossword") {
        clearCrosswordDraft(
          crosswordDraftKey(
            topicId,
            exercises.filter(
              (item): item is CrosswordExercise => item.type === "crossword",
            ),
          ),
        );
      }
    }
    setSessionNonce((value) => value + 1);
  }

  if (isExam && level) {
    if (levelExamCrosswords === null || levelExamFillBlanks === null) {
      return <p className="page-subtitle mt-0">{t("levelExamIntro")}</p>;
    }

    if (levelExamCrosswords.length === 0 || levelExamFillBlanks.length === 0) {
      return <p className="page-subtitle mt-0">{t("noExamQuestions")}</p>;
    }

    if (levelExamPassed) {
      return (
        <div
          className="dashboard-panel mx-auto max-w-lg space-y-3 border-emerald-500/40 bg-emerald-500/10 text-center"
          role="status"
        >
          <h2 className="section-title">{t("examPassedTitle")}</h2>
          <p className="page-subtitle mt-0">
            {nextLevel
              ? t("examPassedBody", { nextLevel })
              : t("examPassedBodyFinal")}
          </p>
          <ButtonLink href="/panel#grammer" size="sm">
            {t("examBackToTopics")}
          </ButtonLink>
        </div>
      );
    }

    if (!levelExamSelected) {
      return (
        <div className="space-y-4">
          <p className="page-subtitle mt-0">{t("levelExamIntro")}</p>
          <ExerciseTypePicker
            counts={levelExamCounts}
            completedTypes={passedLevelParts}
            progressPercents={{
              multiple_choice: 0,
              fill_blank: levelPartPercents.fill_blank ?? 0,
              crossword: levelPartPercents.crossword ?? 0,
              listening: 0,
            }}
            title={t("levelExamChooseTitle")}
            subtitle={t("levelExamChooseSubtitle")}
            onSelect={(type) => {
              if (type !== "crossword" && type !== "fill_blank") {
                return;
              }
              setLevelPartOutcome(null);
              setLevelExamSelected(type);
            }}
          />
        </div>
      );
    }

    const levelFillDraft = level
      ? readLinearSession(`level:${level}:fill_blank`)
      : null;

    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={backToLevelExamPicker}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("backToTypes")}
        </Button>

        {levelPartOutcome === "failed" ? (
          <div
            className="dashboard-panel space-y-3 border-amber-500/40 bg-amber-500/10 text-center"
            role="status"
          >
            <h2 className="section-title">{t("levelExamPartFailedTitle")}</h2>
            <p className="page-subtitle mt-0">{t("levelExamPartFailedBody")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" size="sm" onClick={retryCurrentLevelPart}>
                <RotateCcw className="size-4" aria-hidden />
                {t("retry")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={backToLevelExamPicker}
              >
                {t("backToTypes")}
              </Button>
            </div>
          </div>
        ) : null}

        {levelPartOutcome === "passed" ? (
          <div
            className="dashboard-panel space-y-3 border-emerald-500/40 bg-emerald-500/10 text-center"
            role="status"
          >
            <h2 className="section-title">{t("levelExamPartPassedTitle")}</h2>
            <p className="page-subtitle mt-0">{t("levelExamPartPassedBody")}</p>
            <Button type="button" size="sm" onClick={backToLevelExamPicker}>
              {t("backToTypes")}
            </Button>
          </div>
        ) : null}

        {levelPartOutcome === null ? (
          levelExamSelected === "crossword" ? (
            <CrosswordExerciseView
              key={`cw-${crosswordSessionKey}-${levelExamCrosswords[0]?.id ?? "cw"}`}
              exercises={levelExamCrosswords}
              draftKey={level ? `level:${level}:crossword` : null}
              onProgress={handleCrosswordProgress}
              onRestart={() => restartLevelPart("crossword")}
              onComplete={(result) =>
                handleLevelExamPartComplete("crossword", result)
              }
            />
          ) : (
            <FillBlankExercises
              key={`fb-${fillBlankSessionKey}-${levelExamFillBlanks[0]?.id ?? "fb"}`}
              exercises={levelExamFillBlanks}
              initialIndex={
                levelFillDraft &&
                levelFillDraft.slots.length === levelExamFillBlanks.length
                  ? levelFillDraft.index
                  : 0
              }
              initialSlots={
                levelFillDraft &&
                levelFillDraft.slots.length === levelExamFillBlanks.length
                  ? levelFillDraft.slots.map((slot) => ({
                      answer: slot.answer,
                      checked: slot.checked,
                    }))
                  : undefined
              }
              onSessionChange={handleFillBlankSession}
              onRestart={() => restartLevelPart("fill_blank")}
              onComplete={(result) =>
                handleLevelExamPartComplete("fill_blank", result)
              }
            />
          )
        ) : null}
      </div>
    );
  }

  if (exercises.length === 0) {
    return <p className="page-subtitle mt-0">{t("noExercises")}</p>;
  }

  if (!isExam && selectionKey && !sessionReady) {
    return null;
  }

  if (!selectedType) {
    return (
      <ExerciseTypePicker
        counts={counts}
        completedTypes={completedTypes}
        progressPercents={typeProgress}
        completeAt={exerciseShare}
        onSelect={setSelectedType}
      />
    );
  }

  const filtered = exercises.filter((item) => item.type === selectedType);
  const alreadyCompleted = completedTypes.includes(selectedType);
  const savedMultipleChoice = savedPracticeSession(
    "multiple_choice",
    filtered.length,
  );
  const savedFillBlank = savedPracticeSession("fill_blank", filtered.length);
  const savedListening = savedPracticeSession("listening", filtered.length);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setSelectedType(null)}
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
          key={`mc-${sessionNonce}`}
          exercises={filtered as MultipleChoiceExercise[]}
          initialIndex={savedMultipleChoice?.index ?? 0}
          initialSlots={savedMultipleChoice?.slots.map((slot) => ({
            selected: slot.selected,
            checked: slot.checked,
          }))}
          progressShare={exerciseShare}
          onSessionChange={(session) =>
            persistPracticeSession("multiple_choice", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
        />
      ) : null}

      {selectedType === "fill_blank" ? (
        <FillBlankExercises
          key={`fb-${sessionNonce}`}
          exercises={filtered as FillBlankExercise[]}
          initialIndex={savedFillBlank?.index ?? 0}
          initialSlots={savedFillBlank?.slots.map((slot) => ({
            answer: slot.answer,
            checked: slot.checked,
          }))}
          progressShare={exerciseShare}
          onSessionChange={(session) =>
            persistPracticeSession("fill_blank", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
        />
      ) : null}

      {selectedType === "crossword" ? (
        <CrosswordExerciseView
          key={`cw-${sessionNonce}`}
          exercises={filtered as CrosswordExercise[]}
          draftKey={crosswordDraftKey(topicId, filtered as CrosswordExercise[])}
          progressShare={exerciseShare}
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
        />
      ) : null}

      {selectedType === "listening" ? (
        <ListeningExercises
          key={`listen-${sessionNonce}`}
          exercises={filtered as ListeningExercise[]}
          initialIndex={savedListening?.index ?? 0}
          initialSlots={savedListening?.slots.map((slot) => ({
            englishSelected: slot.englishSelected,
            turkishSelected: slot.turkishSelected,
            checked: slot.checked,
          }))}
          progressShare={exerciseShare}
          onSessionChange={(session) =>
            persistPracticeSession("listening", session)
          }
          onComplete={handleSessionComplete}
          onRestart={handleSessionRestart}
        />
      ) : null}
    </div>
  );
}
