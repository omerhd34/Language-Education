export type TopicLessonExample = {
  en: string;
  tr: string;
  note?: string;
  speakTr?: boolean;
  exampleEn?: string;
  exampleTr?: string;
};

export type TopicLessonExampleHeaders = {
  en: string;
  tr: string;
};

export type TopicLessonExamplesLayout = "list" | "columns";

export type TopicLessonPart = {
  id: string;
  title: string;
  shortTitle?: string;
  titleEn?: string;
  paragraphs: string[];
  examples?: TopicLessonExample[];
  examplesTitle?: string;
  exampleHeaders?: TopicLessonExampleHeaders;
};

export type TopicLessonSection = {
  subtopicId: string;
  title: string;
  titleEn?: string;
  paragraphs: string[];
  examples?: TopicLessonExample[];
  examplesTitle?: string;
  examplesLayout?: TopicLessonExamplesLayout;
  examplesPerRow?: 2 | 3 | 4;
  examplesPerColumn?: number;
  exampleHeaders?: TopicLessonExampleHeaders;
  parts?: TopicLessonPart[];
};

export type TopicLesson = {
  intro: string;
  sections: TopicLessonSection[];
};

export type ExerciseType =
  | "multiple_choice"
  | "fill_blank"
  | "crossword"
  | "listening";

export type MultipleChoiceExercise = {
  id: string;
  subtopicId: string;
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type FillBlankExercise = {
  id: string;
  subtopicId: string;
  type: "fill_blank";
  prompt: string;
  answer: string;
  acceptedAnswers?: string[];
  explanation?: string;
};

export type ListeningExercise = {
  id: string;
  subtopicId: string;
  type: "listening";
  prompt: string;
  speakText: string;
  englishOptions: string[];
  englishCorrectIndex: number;
  turkishOptions: string[];
  turkishCorrectIndex: number;
  explanation?: string;
};

export type CrosswordDirection = "across" | "down";

export type CrosswordClue = {
  number: number;
  direction: CrosswordDirection;
  text: string;
  answer: string;
  row: number;
  col: number;
};

export type CrosswordExercise = {
  id: string;
  subtopicId: string;
  type: "crossword";
  rows: number;
  cols: number;
  clues: CrosswordClue[];
};

export type TopicExercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | CrosswordExercise
  | ListeningExercise;

export type TopicContent = {
  topicId: string;
  viewMinutes?: number;
  examQuestionCount?: number;
  examOptionCount?: number;
  lesson: TopicLesson;
  exercises: TopicExercise[];
  examExercises?: MultipleChoiceExercise[];
};
