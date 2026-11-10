import type {
  ReadingLevel,
  ReadingTextBody,
  ReadingWordGlossary,
  ReadingSubsection,
} from "@/data/readings/types";

export type ListeningLevel = ReadingLevel;

export type ListeningClipQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

export type ListeningTrueFalseQuestion = {
  id: string;
  statement: string;
  answer: boolean;
  hint: string;
};

export type ListeningMatchPair = {
  left: string;
  right: string;
};

export type ListeningMatchingQuestion = {
  id: string;
  prompt: string;
  pairs: ListeningMatchPair[];
  hint: string;
};

export type ListeningExerciseBlock = {
  listenChoice?: ListeningClipQuestion[];
  trueFalse?: ListeningTrueFalseQuestion[];
  matching?: ListeningMatchingQuestion[];
};

export type ListeningSection = {
  id: string;
  level: ListeningLevel;
  title: string;
  titleEn: string;
  textTitle?: string;
  body: ReadingTextBody;
  subsections?: ReadingSubsection[];
  glossary?: ReadingWordGlossary;
  practice: ListeningExerciseBlock;
};
