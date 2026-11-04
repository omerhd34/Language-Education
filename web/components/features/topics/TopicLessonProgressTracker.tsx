/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LESSON_VIEW_REQUIRED_MS,
  TOPIC_PROGRESS_CHANGED_EVENT,
  addTopicLessonViewMs,
  getTopicLessonViewMs,
  getTopicProgressRecord,
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

export function TopicLessonProgressTracker({
  topicId,
}: TopicLessonProgressTrackerProps) {
  const t = useTranslations("Topic");
  const [earned, setEarned] = useState(false);
  const [remainingMs, setRemainingMs] = useState(LESSON_VIEW_REQUIRED_MS);

  useEffect(() => {
    const initial = getTopicProgressRecord(topicId);
    if (initial.lessonViewed) {
      setEarned(true);
      setRemainingMs(0);
      return;
    }

    setEarned(false);
    setRemainingMs(
      Math.max(0, LESSON_VIEW_REQUIRED_MS - getTopicLessonViewMs(topicId)),
    );

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
      const spent = getTopicLessonViewMs(topicId);
      setRemainingMs(Math.max(0, LESSON_VIEW_REQUIRED_MS - spent));
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
      const record = getTopicProgressRecord(topicId);
      if (record.lessonViewed) {
        setEarned(true);
        setRemainingMs(0);
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
  }, [topicId]);

  if (earned) {
    return (
      <Alert className="border-emerald-500/30 bg-emerald-500/10">
        <Clock aria-hidden />
        <AlertTitle>{t("lessonTimerDoneTitle")}</AlertTitle>
        <AlertDescription>{t("lessonTimerDoneBody")}</AlertDescription>
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
          minutes: 3,
        })}
      </AlertDescription>
    </Alert>
  );
}
