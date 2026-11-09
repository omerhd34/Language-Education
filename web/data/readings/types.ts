export type ReadingLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ReadingTextHighlight = {
  text: string;
  id: string;
};

export type ReadingWordGlossary = Record<string, string>;

export type ReadingParagraph = {
  number?: number;
  en: string;
  tr: string;
  highlights?: ReadingTextHighlight[];
  glossary?: ReadingWordGlossary;
};

export type ReadingTextBody = {
  intro?: string;
  introTr?: string;
  glossary?: ReadingWordGlossary;
  paragraphs: ReadingParagraph[];
};

export type ReadingSubsection = {
  title: string;
  titleEn?: string;
  paragraphs: ReadingParagraph[];
};

export type ReadingReferenceQuestion = {
  id: string;
  prompt: string;
  paragraphRef: number;
  acceptedAnswers: string[];
};

export type ReadingShortAnswerQuestion = {
  id: string;
  prompt: string;
  acceptedAnswers: string[];
};

export type ReadingTrueFalseQuestion = {
  id: string;
  statement: string;
  answer: boolean;
};

export type ReadingFillBlankQuestion = {
  id: string;
  before: string;
  after: string;
  answer: string;
  acceptedAnswers?: string[];
};

export type ReadingMultipleChoiceQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export type ReadingExerciseBlock = {
  multipleChoice?: ReadingMultipleChoiceQuestion[];
  reference?: ReadingReferenceQuestion[];
  shortAnswer?: ReadingShortAnswerQuestion[];
  trueFalse?: ReadingTrueFalseQuestion[];
  fillBlank?: ReadingFillBlankQuestion[];
};

export type ReadingSection = {
  id: string;
  level: ReadingLevel;
  title: string;
  titleEn: string;
  textTitle?: string;
  body: ReadingTextBody;
  subsections?: ReadingSubsection[];
  glossary?: ReadingWordGlossary;
  practice: ReadingExerciseBlock;
};
