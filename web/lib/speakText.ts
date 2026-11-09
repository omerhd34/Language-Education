import {
  getSpeechVoiceGender,
  pickEnglishSpeechVoice,
} from "@/lib/speechVoiceGender";

export {
  DEFAULT_SPEECH_VOICE_GENDER,
  getSpeechVoiceGender,
  setSpeechVoiceGender,
  SPEECH_VOICE_GENDERS,
  SPEECH_VOICE_GENDER_CHANGED_EVENT,
  type SpeechVoiceGender,
} from "@/lib/speechVoiceGender";

export const SPEECH_RATE_STORAGE_KEY = "pylmor-speech-rate";
export const SPEECH_RATE_CHANGED_EVENT = "pylmor:speech-rate-changed";

export const DEFAULT_SPEECH_RATE = 0.9;

export const SPEECH_RATE_PRESETS = [0.3, 0.6, 0.9, 1.2, 1.5] as const;

export type SpeechRatePreset = (typeof SPEECH_RATE_PRESETS)[number];

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function isSpeechRatePreset(value: number): value is SpeechRatePreset {
  return (SPEECH_RATE_PRESETS as readonly number[]).includes(value);
}

export function getSpeechRate(): number {
  if (!canUseStorage()) {
    return DEFAULT_SPEECH_RATE;
  }

  try {
    const raw = window.localStorage.getItem(SPEECH_RATE_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SPEECH_RATE;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || !isSpeechRatePreset(parsed)) {
      return DEFAULT_SPEECH_RATE;
    }
    return parsed;
  } catch {
    return DEFAULT_SPEECH_RATE;
  }
}

export function setSpeechRate(rate: number): void {
  if (!canUseStorage() || !isSpeechRatePreset(rate)) {
    return;
  }

  window.localStorage.setItem(SPEECH_RATE_STORAGE_KEY, String(rate));
  window.dispatchEvent(
    new CustomEvent(SPEECH_RATE_CHANGED_EVENT, { detail: { rate } }),
  );
}

export type SpeakTextCallbacks = {
  onEnd?: () => void;
  onCancel?: () => void;
};

let speakSession = 0;
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
let activeOnCancel: (() => void) | null = null;

function clearKeepAlive(): void {
  if (keepAliveTimer === null) {
    return;
  }
  clearInterval(keepAliveTimer);
  keepAliveTimer = null;
}

function startKeepAlive(): void {
  clearKeepAlive();
  keepAliveTimer = setInterval(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, 8000);
}

function cancelActiveSpeech(invokeCancel: boolean): void {
  speakSession += 1;
  clearKeepAlive();
  const onCancel = activeOnCancel;
  activeOnCancel = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  if (invokeCancel) {
    onCancel?.();
  }
}

function splitSpeakChunks(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) {
    return [];
  }
  const parts = trimmed.match(/[^.!?]+(?:[.!?]+|$)/g);
  if (!parts) {
    return [trimmed];
  }
  const chunks: string[] = [];
  let buffer = "";
  for (const part of parts) {
    const sentence = part.trim();
    if (!sentence) {
      continue;
    }
    const combined = buffer ? `${buffer} ${sentence}` : sentence;
    if (combined.length > 160 && buffer) {
      chunks.push(buffer);
      buffer = sentence;
    } else {
      buffer = combined;
    }
  }
  if (buffer) {
    chunks.push(buffer);
  }
  return chunks;
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  return (
    pickEnglishSpeechVoice(voices, getSpeechVoiceGender()) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    null
  );
}

function speakChunks(
  chunks: string[],
  lang: string,
  rate: number,
  voices: SpeechSynthesisVoice[],
  session: number,
  onEnd?: () => void,
): void {
  const synth = window.speechSynthesis;
  let index = 0;

  const speakNext = () => {
    if (session !== speakSession) {
      return;
    }
    if (index >= chunks.length) {
      clearKeepAlive();
      activeOnCancel = null;
      onEnd?.();
      return;
    }
    const chunk = chunks[index] ?? "";
    index += 1;
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.voice = pickVoice(voices);
    utterance.onend = () => {
      if (session !== speakSession) {
        return;
      }
      speakNext();
    };
    utterance.onerror = (event) => {
      if (session !== speakSession) {
        return;
      }
      const error = "error" in event ? String(event.error) : "";
      if (error === "interrupted" || error === "canceled") {
        return;
      }
      speakNext();
    };
    synth.speak(utterance);
  };

  startKeepAlive();
  speakNext();
}

export function speakText(
  text: string,
  lang = "en-US",
  rate?: number,
  callbacks?: SpeakTextCallbacks,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!("speechSynthesis" in window)) {
    callbacks?.onEnd?.();
    return;
  }

  cancelActiveSpeech(true);
  const session = speakSession;
  activeOnCancel = callbacks?.onCancel ?? null;

  const chunks = splitSpeakChunks(text);
  if (chunks.length === 0) {
    activeOnCancel = null;
    callbacks?.onEnd?.();
    return;
  }

  const resolvedRate = rate ?? getSpeechRate();
  const synth = window.speechSynthesis;

  const start = (voices: SpeechSynthesisVoice[]) => {
    if (session !== speakSession) {
      return;
    }
    speakChunks(chunks, lang, resolvedRate, voices, session, callbacks?.onEnd);
  };

  const voices = synth.getVoices();
  if (voices.length > 0) {
    window.setTimeout(() => start(voices), 0);
    return;
  }

  synth.addEventListener(
    "voiceschanged",
    () => {
      window.setTimeout(() => start(synth.getVoices()), 0);
    },
    { once: true },
  );
}

export function stopSpeaking(): void {
  cancelActiveSpeech(true);
}
