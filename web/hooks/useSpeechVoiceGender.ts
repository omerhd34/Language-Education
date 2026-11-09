"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SPEECH_VOICE_GENDER,
  getSpeechVoiceGender,
  setSpeechVoiceGender,
  SPEECH_VOICE_GENDER_CHANGED_EVENT,
  type SpeechVoiceGender,
} from "@/lib/speechVoiceGender";

export function useSpeechVoiceGender() {
  const [gender, setGender] = useState<SpeechVoiceGender>(
    DEFAULT_SPEECH_VOICE_GENDER,
  );

  useEffect(() => {
    setGender(getSpeechVoiceGender());

    function handleChange(event: Event) {
      const custom = event as CustomEvent<{ gender?: SpeechVoiceGender }>;
      const next = custom.detail?.gender;
      setGender(next ?? getSpeechVoiceGender());
    }

    window.addEventListener(SPEECH_VOICE_GENDER_CHANGED_EVENT, handleChange);
    return () => {
      window.removeEventListener(
        SPEECH_VOICE_GENDER_CHANGED_EVENT,
        handleChange,
      );
    };
  }, []);

  function updateGender(next: SpeechVoiceGender) {
    setSpeechVoiceGender(next);
    setGender(next);
  }

  return { gender, setGender: updateGender };
}
