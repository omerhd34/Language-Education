/* eslint-disable react-hooks/refs */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createSpeechRecognitionSession } from "@/lib/speakingLineRecognition";
import { lineSpeechMatchesExpected } from "@/lib/speakingLineMatch";

export type SpeakingLineRecording = {
  blob: Blob;
  url: string;
};

export type SpeakingRecordingStopResult = {
  messageId: string;
  blob: Blob;
  transcript: string;
};

type RecordingCompleteHandler = (result: SpeakingRecordingStopResult) => void;

type UseSpeakingLineRecorderResult = {
  activeMessageId: string | null;
  isRecording: boolean;
  recordings: ReadonlyMap<string, SpeakingLineRecording>;
  startRecording: (
    messageId: string,
    expectedLine?: string,
  ) => Promise<boolean>;
  stopRecording: () => void;
  clearRecording: (messageId: string) => void;
  clearAllRecordings: () => void;
  setOnRecordingComplete: (handler: RecordingCompleteHandler | null) => void;
};

export function useSpeakingLineRecorder(): UseSpeakingLineRecorderResult {
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<
    Map<string, SpeakingLineRecording>
  >(() => new Map());

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const pendingMessageIdRef = useRef<string | null>(null);
  const recognitionSessionRef = useRef<ReturnType<
    typeof createSpeechRecognitionSession
  > | null>(null);
  const onCompleteRef = useRef<RecordingCompleteHandler | null>(null);
  const mimeTypeRef = useRef("audio/webm");
  const expectedLineRef = useRef<string | null>(null);
  const autoStopEnabledRef = useRef(false);
  const stopRecordingRef = useRef<() => void>(() => {});

  const stopRecognition = useCallback(() => {
    recognitionSessionRef.current?.stop();
    recognitionSessionRef.current = null;
  }, []);

  const flushRecognitionTranscript = useCallback(async (): Promise<string> => {
    const session = recognitionSessionRef.current;
    recognitionSessionRef.current = null;
    if (!session) {
      return "";
    }
    return session.flushAndStop();
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }
    recorderRef.current = null;
    stopRecognition();
    stopStream();
    setIsRecording(false);
    setActiveMessageId(null);
    pendingMessageIdRef.current = null;
  }, [stopRecognition, stopStream]);

  stopRecordingRef.current = stopRecording;

  const startRecording = useCallback(
    async (messageId: string, expectedLine?: string): Promise<boolean> => {
      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        return false;
      }

      try {
        stopRecording();

        expectedLineRef.current = expectedLine?.trim() || null;
        autoStopEnabledRef.current = Boolean(expectedLineRef.current);

        const recognition = createSpeechRecognitionSession({
          onTranscriptUpdate: (transcript) => {
            if (!autoStopEnabledRef.current) {
              return;
            }
            const expected = expectedLineRef.current;
            if (!expected || !transcript.trim()) {
              return;
            }
            if (lineSpeechMatchesExpected(expected, transcript)) {
              autoStopEnabledRef.current = false;
              stopRecordingRef.current();
            }
          },
        });
        if (!recognition) {
          return false;
        }
        recognitionSessionRef.current = recognition;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        chunksRef.current = [];
        pendingMessageIdRef.current = messageId;

        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;
        mimeTypeRef.current = recorder.mimeType || "audio/webm";

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const targetId = pendingMessageIdRef.current;
          recorderRef.current = null;
          autoStopEnabledRef.current = false;
          expectedLineRef.current = null;

          pendingMessageIdRef.current = null;
          setActiveMessageId(null);
          setIsRecording(false);

          if (!targetId) {
            void flushRecognitionTranscript();
            stopStream();
            return;
          }

          const blob = new Blob(chunksRef.current, {
            type: mimeTypeRef.current,
          });
          chunksRef.current = [];

          void (async () => {
            const transcript = await flushRecognitionTranscript();
            stopStream();

            if (blob.size === 0) {
              return;
            }

            setRecordings((prev) => {
              const next = new Map(prev);
              const existing = next.get(targetId);
              if (existing) {
                URL.revokeObjectURL(existing.url);
              }
              next.set(targetId, { blob, url: URL.createObjectURL(blob) });
              return next;
            });

            onCompleteRef.current?.({
              messageId: targetId,
              blob,
              transcript,
            });
          })();
        };

        recorder.start();
        setActiveMessageId(messageId);
        setIsRecording(true);
        return true;
      } catch {
        stopRecognition();
        stopStream();
        setIsRecording(false);
        setActiveMessageId(null);
        return false;
      }
    },
    [flushRecognitionTranscript, stopRecording, stopRecognition, stopStream],
  );

  const clearRecording = useCallback((messageId: string) => {
    setRecordings((prev) => {
      const next = new Map(prev);
      const existing = next.get(messageId);
      if (existing) {
        URL.revokeObjectURL(existing.url);
        next.delete(messageId);
      }
      return next;
    });
  }, []);

  const clearAllRecordings = useCallback(() => {
    setRecordings((prev) => {
      prev.forEach((recording) => URL.revokeObjectURL(recording.url));
      return new Map();
    });
  }, []);

  const setOnRecordingComplete = useCallback(
    (handler: RecordingCompleteHandler | null) => {
      onCompleteRef.current = handler;
    },
    [],
  );

  useEffect(() => {
    return () => {
      stopRecording();
      setRecordings((prev) => {
        prev.forEach((recording) => URL.revokeObjectURL(recording.url));
        return new Map();
      });
    };
  }, [stopRecording]);

  return {
    activeMessageId,
    isRecording,
    recordings,
    startRecording,
    stopRecording,
    clearRecording,
    clearAllRecordings,
    setOnRecordingComplete,
  };
}
