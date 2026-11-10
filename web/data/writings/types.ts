import type { ReadingLevel } from "@/data/readings/types";

export type WritingLevel = ReadingLevel;

export type WritingChatMessage = {
  id: string;
  sender: "them" | "me";
  time: string;
  text: string;
  textTr?: string;
};

export type WritingModelChat = {
  contactName: string;
  contactStatus?: string;
  messages: WritingChatMessage[];
};

export type WritingTip = {
  en: string;
  tr: string;
};

export type WritingMultipleChoiceQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

export type WritingPhraseItem = {
  id: string;
  text: string;
  groupIndex: number;
};

export type WritingPhraseGroup = {
  id: string;
  title: string;
  titleTr?: string;
};

export type WritingCategorizeExercise = {
  id: string;
  instruction: string;
  instructionTr?: string;
  groups: WritingPhraseGroup[];
  phrases: WritingPhraseItem[];
  hint: string;
};

export type WritingWordOrderQuestion = {
  id: string;
  words: string[];
  answer: string[];
  hint: string;
};

export type WritingExerciseBlock = {
  categorize?: WritingCategorizeExercise;
  tips?: WritingTip[];
  task1?: WritingMultipleChoiceQuestion[];
  task2?: WritingMultipleChoiceQuestion[];
  task3?: WritingWordOrderQuestion[];
};

export type WritingSection = {
  id: string;
  level: WritingLevel;
  title: string;
  titleEn: string;
  summary?: string;
  summaryTr?: string;
  model: WritingModelChat;
  practice: WritingExerciseBlock;
};
