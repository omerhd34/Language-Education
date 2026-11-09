export const SPEECH_VOICE_GENDER_STORAGE_KEY = "pylmor-speech-voice-gender";
export const SPEECH_VOICE_GENDER_CHANGED_EVENT = "pylmor:speech-voice-gender-changed";

export const SPEECH_VOICE_GENDERS = ["female", "male"] as const;

export type SpeechVoiceGender = (typeof SPEECH_VOICE_GENDERS)[number];

export const DEFAULT_SPEECH_VOICE_GENDER: SpeechVoiceGender = "female";

const FEMALE_VOICE_PATTERN =
  /female|woman|girl|samantha|karen|victoria|zira|susan|jenny|aria|natalie|linda|heather|moira|tessa|fiona|serena|veena|hazel|emma|lisa|sarah|kate|anna|amy|julie|laura|joanna|kimberly|ivy|salli|nicole|penelope|raveena|aditi|niamh|marie|sonia|libby|mia|hannah|olivia|freya|kathy|allison|ava|jane|michelle|serena/i;

const MALE_VOICE_PATTERN =
  /male|man|boy|daniel|david|mark|james|george|ryan|guy|thomas|richard|alex|fred|benjamin|brian|bruce|bobby|eddie|justin|kevin|matthew|michael|liam|arthur|gordon|lee|tom|william|nathan|sean|stephen|simon|paul|colin|craig|duncan|geraint|hugh|iain|oliver|roderick|aaron|nick|jason|tony|john|peter|chris|eric|frank/i;

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function isSpeechVoiceGender(value: string): value is SpeechVoiceGender {
  return (SPEECH_VOICE_GENDERS as readonly string[]).includes(value);
}

export function classifySpeechVoiceGender(
  voiceName: string,
): SpeechVoiceGender | null {
  const name = voiceName.toLowerCase();
  if (FEMALE_VOICE_PATTERN.test(name)) {
    return "female";
  }
  if (MALE_VOICE_PATTERN.test(name)) {
    return "male";
  }
  return null;
}

function isEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  return voice.lang.toLowerCase().startsWith("en");
}

function voiceQualityScore(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;
  if (/google|microsoft/i.test(name)) {
    score += 4;
  }
  if (/natural|neural|online/i.test(name)) {
    score += 2;
  }
  if (voice.localService) {
    score += 1;
  }
  return score;
}

export function pickEnglishSpeechVoice(
  voices: SpeechSynthesisVoice[],
  gender: SpeechVoiceGender,
): SpeechSynthesisVoice | null {
  const english = voices.filter(isEnglishVoice);
  if (english.length === 0) {
    return null;
  }

  const matching = english
    .map((voice) => ({
      voice,
      classified: classifySpeechVoiceGender(voice.name),
      quality: voiceQualityScore(voice),
    }))
    .filter((entry) => entry.classified === gender)
    .sort((a, b) => b.quality - a.quality);

  if (matching.length > 0) {
    return matching[0]?.voice ?? null;
  }

  const fallback = english
    .map((voice) => ({ voice, quality: voiceQualityScore(voice) }))
    .sort((a, b) => b.quality - a.quality);

  return fallback[0]?.voice ?? null;
}

export function getSpeechVoiceGender(): SpeechVoiceGender {
  if (!canUseStorage()) {
    return DEFAULT_SPEECH_VOICE_GENDER;
  }

  try {
    const raw = window.localStorage.getItem(SPEECH_VOICE_GENDER_STORAGE_KEY);
    if (!raw || !isSpeechVoiceGender(raw)) {
      return DEFAULT_SPEECH_VOICE_GENDER;
    }
    return raw;
  } catch {
    return DEFAULT_SPEECH_VOICE_GENDER;
  }
}

export function setSpeechVoiceGender(gender: SpeechVoiceGender): void {
  if (!canUseStorage() || !isSpeechVoiceGender(gender)) {
    return;
  }

  window.localStorage.setItem(SPEECH_VOICE_GENDER_STORAGE_KEY, gender);
  window.dispatchEvent(
    new CustomEvent(SPEECH_VOICE_GENDER_CHANGED_EVENT, { detail: { gender } }),
  );
}
