/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  TOPIC_PROGRESS_CHANGED_EVENT,
  addTopicLessonViewMs,
  getLessonViewRequiredMs,
  getTopicLessonViewMs,
  getTopicLessonViewRemainingMs,
  isLessonWaitWaivedByExam,
  markTopicLessonViewed,
} from "@/lib/topicProgressStorage";

type TopicLessonProgressTrackerProps = {
  topicId: string;
};

const TICK_MS = 1000;

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatRequiredMinutes(ms: number): string {
  const minutes = ms / 60_000;
  const rounded = Math.round(minutes * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return text.replace(".", ",");
}

export function TopicLessonProgressTracker({
  topicId,
}: TopicLessonProgressTrackerProps) {
  const t = useTranslations("Topic");
  const requiredMs = getLessonViewRequiredMs(topicId);
  const [earned, setEarned] = useState(false);
  const [waivedByExam, setWaivedByExam] = useState(false);
  const [spentMs, setSpentMs] = useState(0);
  const remainingMs = Math.max(0, requiredMs - spentMs);

  useEffect(() => {
    const required = getLessonViewRequiredMs(topicId);

    if (required <= 0) {
      markTopicLessonViewed(topicId);
      setEarned(true);
      setSpentMs(0);
      return;
    }

    const spent = getTopicLessonViewMs(topicId);
    const initialRemaining = getTopicLessonViewRemainingMs(topicId);
    setSpentMs(Math.min(spent, required));

    if (initialRemaining <= 0) {
      setWaivedByExam(isLessonWaitWaivedByExam(topicId));
      setEarned(true);
      return;
    }

    setWaivedByExam(false);
    setEarned(false);

    let lastTick = Date.now();

    function flush(now: number) {
      if (document.visibilityState !== "visible") {
        lastTick = now;
        return;
      }

      const delta = now - lastTick;
      lastTick = now;
      if (delta <= 0) {
        return;
      }

      const done = addTopicLessonViewMs(topicId, delta);
      setSpentMs(getTopicLessonViewMs(topicId));
      if (done) {
        setEarned(true);
      }
    }

    const intervalId = window.setInterval(() => {
      flush(Date.now());
    }, TICK_MS);

    function onVisibility() {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        lastTick = now;
        return;
      }
      flush(now);
    }

    function onProgressEvent() {
      const remaining = getTopicLessonViewRemainingMs(topicId);
      if (remaining <= 0) {
        setWaivedByExam(isLessonWaitWaivedByExam(topicId));
        setSpentMs(getTopicLessonViewMs(topicId));
        setEarned(true);
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(TOPIC_PROGRESS_CHANGED_EVENT, onProgressEvent);

    return () => {
      flush(Date.now());
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(TOPIC_PROGRESS_CHANGED_EVENT, onProgressEvent);
    };
  }, [topicId, requiredMs]);

  if (earned) {
    return (
      <Alert className="border-emerald-500/30 bg-emerald-500/10">
        <Clock aria-hidden />
        <AlertTitle>{t("lessonTimerDoneTitle")}</AlertTitle>
        <AlertDescription>
          {waivedByExam
            ? t("lessonTimerExamDoneBody")
            : t("lessonTimerDoneBody")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="warning">
      <Clock aria-hidden />
      <AlertTitle>{t("lessonTimerTitle")}</AlertTitle>
      <AlertDescription>
        {t("lessonTimerBody", {
          time: formatRemaining(remainingMs),
          minutes: formatRequiredMinutes(requiredMs),
        })}
      </AlertDescription>
    </Alert>
  );
}
