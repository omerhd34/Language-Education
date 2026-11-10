"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { Check, Mic, Square, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/toast";
import type {
  SpeakingChatMessage,
  SpeakingModelChat,
} from "@/data/speakings/types";
import {
  type SpeakingRecordingStopResult,
  useSpeakingLineRecorder,
} from "@/hooks/useSpeakingLineRecorder";
import { canUseSpeechRecognition } from "@/lib/speakingLineRecognition";
import { lineSpeechMatchesExpected } from "@/lib/speakingLineMatch";
import {
  SPEAKING_PROGRESS_EVENT,
  clearSpeakingModelDialogueProgress,
  getSpeakingRecordedMessageIds,
  markSpeakingLinePassed,
} from "@/lib/speakingProgressStorage";
import { speakDialogue, stopSpeaking } from "@/lib/speakText";
import { cn } from "@/lib/utils";

type SpeakingChatThreadProps = {
  sectionId: string;
  model: SpeakingModelChat;
  showTranslation: boolean;
  onAllLinesSpoken?: () => void;
};

export type SpeakingChatThreadHandle = {
  resetDialogue: () => void;
};

function contactInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "?";
  }
  return trimmed.charAt(0).toLocaleUpperCase("en");
}

function messageById(
  messages: SpeakingChatMessage[],
  messageId: string,
): SpeakingChatMessage | undefined {
  return messages.find((message) => message.id === messageId);
}

export const SpeakingChatThread = forwardRef<
  SpeakingChatThreadHandle,
  SpeakingChatThreadProps
>(function SpeakingChatThread(
  { sectionId, model, showTranslation, onAllLinesSpoken },
  ref,
) {
  const t = useTranslations("Speaking");
  const { contactName, contactStatus, messages } = model;
  const [passedIds, setPassedIds] = useState<string[]>(() =>
    getSpeakingRecordedMessageIds(sectionId),
  );
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());
  const [listeningMessageId, setListeningMessageId] = useState<string | null>(
    null,
  );
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(
    null,
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const {
    activeMessageId,
    isRecording,
    recordings,
    startRecording,
    stopRecording,
    clearRecording,
    clearAllRecordings,
    setOnRecordingComplete,
  } = useSpeakingLineRecorder();

  const refreshPassed = useCallback(() => {
    setPassedIds(getSpeakingRecordedMessageIds(sectionId));
  }, [sectionId]);

  useEffect(() => {
    refreshPassed();
    function onProgress() {
      refreshPassed();
    }
    window.addEventListener(SPEAKING_PROGRESS_EVENT, onProgress);
    return () =>
      window.removeEventListener(SPEAKING_PROGRESS_EVENT, onProgress);
  }, [refreshPassed]);

  const handleRecordingComplete = useCallback(
    (result: SpeakingRecordingStopResult) => {
      const message = messageById(messagesRef.current, result.messageId);
      if (!message) {
        return;
      }

      const matches = lineSpeechMatchesExpected(
        message.text,
        result.transcript,
      );

      if (matches) {
        setFailedIds((prev) => {
          const next = new Set(prev);
          next.delete(result.messageId);
          return next;
        });
        markSpeakingLinePassed(sectionId, result.messageId);
      } else {
        setFailedIds((prev) => new Set(prev).add(result.messageId));
        clearRecording(result.messageId);
        toast.add({
          id: `speaking-line-mismatch-${result.messageId}`,
          type: "error",
          title: t("lineSpeechMismatchTitle"),
          description: t("lineSpeechMismatchDescription"),
          timeout: 5_000,
        });
      }
    },
    [clearRecording, sectionId, t],
  );

  useEffect(() => {
    setOnRecordingComplete(handleRecordingComplete);
    return () => setOnRecordingComplete(null);
  }, [handleRecordingComplete, setOnRecordingComplete]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const allMessageIds = messages.map((message) => message.id);

  useEffect(() => {
    if (allMessageIds.length === 0) {
      return;
    }
    const allDone = allMessageIds.every((id) => passedIds.includes(id));
    if (allDone) {
      onAllLinesSpoken?.();
    }
  }, [allMessageIds, onAllLinesSpoken, passedIds]);

  function handleListenLine(
    messageId: string,
    text: string,
    sender: SpeakingChatMessage["sender"],
  ) {
    if (listeningMessageId === messageId) {
      stopSpeaking();
      setListeningMessageId(null);
      return;
    }
    stopSpeaking();
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingRecordingId(null);
    }
    setListeningMessageId(messageId);
    const gender = sender === "me" ? ("female" as const) : ("male" as const);
    speakDialogue([{ text, gender }], "en-US", undefined, {
      onEnd: () => setListeningMessageId(null),
      onCancel: () => setListeningMessageId(null),
    });
  }

  function handlePlayRecording(messageId: string) {
    const recording = recordings.get(messageId);
    if (!recording) {
      return;
    }
    if (playingRecordingId === messageId && audioRef.current) {
      audioRef.current.pause();
      setPlayingRecordingId(null);
      return;
    }
    stopSpeaking();
    setListeningMessageId(null);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(recording.url);
    audioRef.current = audio;
    setPlayingRecordingId(messageId);
    audio.onended = () => setPlayingRecordingId(null);
    audio.onerror = () => setPlayingRecordingId(null);
    void audio.play();
  }

  const resetDialogue = useCallback(() => {
    stopSpeaking();
    setListeningMessageId(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingRecordingId(null);
    if (isRecording) {
      stopRecording();
    }
    clearAllRecordings();
    setFailedIds(new Set());
    clearSpeakingModelDialogueProgress(sectionId);
  }, [clearAllRecordings, isRecording, sectionId, stopRecording]);

  useImperativeHandle(ref, () => ({ resetDialogue }), [resetDialogue]);

  async function handleMicToggle(messageId: string) {
    if (passedIds.includes(messageId)) {
      return;
    }
    if (isRecording && activeMessageId === messageId) {
      stopRecording();
      return;
    }
    if (isRecording) {
      stopRecording();
    }
    setFailedIds((prev) => {
      const next = new Set(prev);
      next.delete(messageId);
      return next;
    });
    if (recordings.has(messageId)) {
      clearRecording(messageId);
    }
    stopSpeaking();

    if (!canUseSpeechRecognition()) {
      toast.add({
        id: "speaking-stt-unavailable",
        type: "error",
        title: t("speechRecognitionUnavailableTitle"),
        description: t("speechRecognitionUnavailableDescription"),
      });
      return;
    }

    const message = messageById(messages, messageId);
    const ok = await startRecording(messageId, message?.text);
    if (!ok) {
      toast.add({
        id: "speaking-mic-denied",
        type: "error",
        title: t("micUnavailableTitle"),
        description: t("micUnavailableDescription"),
      });
    }
  }

  function toolbarButtonClass(outgoing: boolean, active?: boolean): string {
    return cn(
      "size-7 shrink-0 rounded-lg",
      active
        ? outgoing
          ? "bg-emerald-800/15 text-emerald-950 dark:bg-emerald-400/20 dark:text-emerald-50"
          : "bg-brand-100 text-brand-900 dark:bg-brand-800/60 dark:text-brand-50"
        : outgoing
          ? "text-emerald-950/75 hover:bg-emerald-900/10 dark:text-emerald-50/85 dark:hover:bg-emerald-950/35"
          : "text-brand-700/90 hover:bg-black/5 dark:text-brand-200 dark:hover:bg-white/10",
    );
  }

  function renderMessageToolbar(
    message: SpeakingChatMessage,
    outgoing: boolean,
  ) {
    const messageId = message.id;
    const passed = passedIds.includes(messageId);
    const failed = failedIds.has(messageId);
    const hasRecording = recordings.has(messageId);
    const recordingActive = isRecording && activeMessageId === messageId;
    const playing = playingRecordingId === messageId;
    const listening = listeningMessageId === messageId;

    return (
      <div
        className={cn(
          "mt-2 flex items-center justify-between gap-2 border-t pt-1.5",
          outgoing
            ? "border-emerald-900/10 dark:border-emerald-200/15"
            : "border-black/5 dark:border-white/10",
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-0.5">
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            aria-pressed={listening}
            aria-label={t("lineListenAria")}
            className={toolbarButtonClass(outgoing, listening)}
            onClick={() =>
              handleListenLine(messageId, message.text, message.sender)
            }
          >
            {listening ? (
              <VolumeX className="size-3.5" aria-hidden />
            ) : (
              <Volume2 className="size-3.5" aria-hidden />
            )}
          </Button>

          {passed ? (
            <span
              className="flex size-7 shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400"
              role="img"
              aria-label={t("lineSpokenAria")}
            >
              <Check className="size-4" aria-hidden />
            </span>
          ) : null}

          {failed ? (
            <span
              className="flex size-7 shrink-0 items-center justify-center text-red-600 dark:text-red-400"
              role="img"
              aria-label={t("lineFailedAria")}
            >
              <X className="size-4" aria-hidden />
            </span>
          ) : null}

          {!passed && hasRecording && !recordingActive ? (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-label={t("linePlayRecordingAria")}
              className={toolbarButtonClass(outgoing, playing)}
              onClick={() => handlePlayRecording(messageId)}
            >
              {playing ? (
                <VolumeX className="size-3.5" aria-hidden />
              ) : (
                <Volume2 className="size-3.5" aria-hidden />
              )}
            </Button>
          ) : null}

          {!passed ? (
            <Button
              type="button"
              size="icon-xs"
              variant="ghost"
              aria-pressed={recordingActive}
              aria-label={
                recordingActive
                  ? t("lineStopRecordAria")
                  : failed || hasRecording
                    ? t("lineRecordAgainAria")
                    : t("lineRecordAria")
              }
              className={cn(
                toolbarButtonClass(outgoing, recordingActive),
                recordingActive && "ring-2 ring-red-500/35",
              )}
              onClick={() => void handleMicToggle(messageId)}
            >
              {recordingActive ? (
                <Square className="size-3.5" aria-hidden />
              ) : (
                <Mic className="size-3.5" aria-hidden />
              )}
            </Button>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 text-[10px] tabular-nums",
            outgoing
              ? "text-emerald-900/45 dark:text-emerald-100/50"
              : "text-brand-500/80 dark:text-brand-400/70",
          )}
        >
          {message.time}
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] ring-1 ring-black/5 sm:max-w-2xl dark:ring-white/10">
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white dark:bg-[#054640]">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold ring-1 ring-white/20"
          aria-hidden
        >
          {contactInitial(contactName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold tracking-tight">{contactName}</p>
          {contactStatus ? (
            <p className="flex items-center gap-1.5 text-xs text-emerald-100/90">
              <span
                className="size-1.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.8)]"
                aria-hidden
              />
              {contactStatus}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "relative min-h-70 px-3 py-4 sm:px-5 sm:py-5",
          "bg-[#e7e0d4] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] bg-size-[18px_18px]",
          "dark:bg-[#0f1419] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]",
        )}
      >
        <ul className="flex flex-col gap-2.5">
          {messages.map((message) => {
            const outgoing = message.sender === "me";

            return (
              <li
                key={message.id}
                className={cn(
                  "flex w-full",
                  outgoing ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[min(100%,28rem)] rounded-2xl px-3 py-2 text-[16px] leading-snug shadow-sm",
                    outgoing
                      ? "bg-[#d9fdd3] text-[#111b21] dark:bg-emerald-900/55 dark:text-emerald-50"
                      : "bg-white text-[#111b21] dark:bg-[#1f2c3a] dark:text-[#e9edef]",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {showTranslation && message.textTr ? (
                    <p
                      className={cn(
                        "mt-1.5 border-t pt-1.5 text-xs leading-relaxed",
                        outgoing
                          ? "border-emerald-900/10 text-emerald-950/75 dark:border-emerald-200/15 dark:text-emerald-100/80"
                          : "border-black/5 text-brand-600 dark:border-white/10 dark:text-brand-300",
                      )}
                    >
                      {message.textTr}
                    </p>
                  ) : null}
                  {renderMessageToolbar(message, outgoing)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});
