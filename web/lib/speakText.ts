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

export function speakText(text: string, lang = "en-US", rate?: number): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate ?? getSpeechRate();

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (voice) =>
      voice.lang.toLowerCase().startsWith("en") &&
      /google|microsoft|samantha|daniel/i.test(voice.name),
  );
  const english = voices.find((voice) =>
    voice.lang.toLowerCase().startsWith("en"),
  );
  utterance.voice = preferred ?? english ?? null;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  window.speechSynthesis.cancel();
}
