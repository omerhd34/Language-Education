/* eslint-disable react-hooks/refs */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_SPEAKING_REQUIRED_MS = 2 * 60 * 1000;

type UseSpeakingTimedRecorderOptions = {
  sessionKey: string;
  requiredMs?: number;
  onRequirementMet?: () => void;
};

export function useSpeakingTimedRecorder({
  sessionKey,
  requiredMs = DEFAULT_SPEAKING_REQUIRED_MS,
  onRequirementMet,
}: UseSpeakingTimedRecorderOptions) {
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [liveMs, setLiveMs] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const segmentStartRef = useRef<number | null>(null);
  const metRef = useRef(false);
  const onMetRef = useRef(onRequirementMet);
  onMetRef.current = onRequirementMet;

  const commitSegment = useCallback(() => {
    if (segmentStartRef.current === null) {
      return;
    }
    const delta = performance.now() - segmentStartRef.current;
    segmentStartRef.current = null;
    setAccumulatedMs((prev) => prev + delta);
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    commitSegment();
    stopStream();
    setIsRecording(false);
  }, [commitSegment, stopStream]);

  const resetSession = useCallback(() => {
    stopRecording();
    setAccumulatedMs(0);
    setLiveMs(0);
    metRef.current = false;
  }, [stopRecording]);

  useEffect(() => {
    resetSession();
  }, [sessionKey, resetSession]);

  useEffect(() => {
    if (!isRecording) {
      setLiveMs(accumulatedMs);
      return;
    }
    const tick = () => {
      const start = segmentStartRef.current;
      if (start === null) {
        return;
      }
      setLiveMs(accumulatedMs + (performance.now() - start));
    };
    tick();
    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [accumulatedMs, isRecording]);

  useEffect(() => {
    if (liveMs < requiredMs || metRef.current) {
      return;
    }
    metRef.current = true;
    stopRecording();
    onMetRef.current?.();
  }, [liveMs, requiredMs, stopRecording]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      return false;
    }
    try {
      if (isRecording) {
        return true;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      segmentStartRef.current = performance.now();
      setIsRecording(true);
      return true;
    } catch {
      stopStream();
      setIsRecording(false);
      return false;
    }
  }, [isRecording, stopStream]);

  const toggleRecording = useCallback(async (): Promise<boolean> => {
    if (isRecording) {
      stopRecording();
      return true;
    }
    return startRecording();
  }, [isRecording, startRecording, stopRecording]);

  const requirementMet = liveMs >= requiredMs;
  const progressPercent = Math.min(
    100,
    requiredMs > 0 ? Math.round((liveMs / requiredMs) * 100) : 0,
  );

  return {
    isRecording,
    liveMs,
    requiredMs,
    progressPercent,
    requirementMet,
    toggleRecording,
    stopRecording,
  };
}
