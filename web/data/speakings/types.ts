import type { ReadingLevel } from "@/data/readings/types";

export type SpeakingLevel = ReadingLevel;

export type SpeakingChatMessage = {
  id: string;
  sender: "them" | "me";
  time: string;
  text: string;
  textTr?: string;
};

export type SpeakingModelChat = {
  contactName: string;
  contactStatus?: string;
  messages: SpeakingChatMessage[];
};

export type SpeakingPromptItem = {
  id: string;
  prompt: string;
  promptTr?: string;
};

export type SpeakingWheelExercise = {
  id: string;
  instruction: string;
  instructionTr?: string;
  items: SpeakingPromptItem[];
  hint: string;
};

export type SpeakingOpenBoxExercise = {
  id: string;
  instruction: string;
  instructionTr?: string;
  items: SpeakingPromptItem[];
  hint: string;
};

export type SpeakingRandomCardsExercise = {
  id: string;
  instruction: string;
  instructionTr?: string;
  items: SpeakingPromptItem[];
  hint: string;
};

export type SpeakingAnagramWord = {
  letters: string[];
  answer: string;
};

export type SpeakingAnagramQuestion = {
  id: string;
  words: SpeakingAnagramWord[];
  hint: string;
  speakWhenDone?: string;
};

export type SpeakingExerciseBlock = {
  wheel?: SpeakingWheelExercise;
  openBox?: SpeakingOpenBoxExercise;
  randomCards?: SpeakingRandomCardsExercise;
  anagram?: SpeakingAnagramQuestion[];
};

export type SpeakingSection = {
  id: string;
  level: SpeakingLevel;
  title: string;
  titleEn: string;
  summary?: string;
  summaryTr?: string;
  model: SpeakingModelChat;
  practice: SpeakingExerciseBlock;
};
