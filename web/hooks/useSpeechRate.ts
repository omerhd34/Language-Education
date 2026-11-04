"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SPEECH_RATE,
  getSpeechRate,
  setSpeechRate,
  SPEECH_RATE_CHANGED_EVENT,
  type SpeechRatePreset,
} from "@/lib/speakText";

export function useSpeechRate() {
  const [rate, setRate] = useState(DEFAULT_SPEECH_RATE);

  useEffect(() => {
    setRate(getSpeechRate());

    function handleChange(event: Event) {
      const custom = event as CustomEvent<{ rate?: number }>;
      const next = custom.detail?.rate;
      setRate(typeof next === "number" ? next : getSpeechRate());
    }

    window.addEventListener(SPEECH_RATE_CHANGED_EVENT, handleChange);
    return () => {
      window.removeEventListener(SPEECH_RATE_CHANGED_EVENT, handleChange);
    };
  }, []);

  function updateRate(next: SpeechRatePreset) {
    setSpeechRate(next);
    setRate(next);
  }

  return { rate, setRate: updateRate };
}
