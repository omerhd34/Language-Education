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
  | "true_false"
  | "fill_blank"
  | "crossword"
  | "listening"
  | "matching"
  | "mixed";

export type MatchingPair = {
  left: string;
  right: string;
};

export type MatchingExercise = {
  id: string;
  subtopicId: string;
  type: "matching";
  prompt: string;
  pairs: MatchingPair[];
  explanation?: string;
  hint?: string;
};

export type MultipleChoiceExercise = {
  id: string;
  subtopicId: string;
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  hint?: string;
  speakText?: string;
};

export type TrueFalseExercise = {
  id: string;
  subtopicId: string;
  type: "true_false";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  hint?: string;
  speakText?: string;
};

export type FillBlankExercise = {
  id: string;
  subtopicId: string;
  type: "fill_blank";
  prompt: string;
  answer: string;
  acceptedAnswers?: string[];
  explanation?: string;
  hint?: string;
  speakText?: string;
};

export type VerbListeningRow = {
  verbId: string;
  v1: string;
  regular: boolean;
  v2CorrectPoolIndex: number;
  v3CorrectPoolIndex: number;
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
  verbTripleForm?: boolean;
  verbListeningRows?: VerbListeningRow[];
  verbListeningV2Pool?: string[];
  verbListeningV3Pool?: string[];
  v2Options?: string[];
  v2CorrectIndex?: number;
  explanation?: string;
  hint?: string;
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
  | TrueFalseExercise
  | FillBlankExercise
  | CrosswordExercise
  | ListeningExercise
  | MatchingExercise;

export type ErrorCorrectionExercise = {
  id: string;
  subtopicId: string;
  type: "error_correction";
  sentence: string;
  tokens?: string[];
  errorTokenIndex: number;
  correction: string;
  acceptedCorrections?: string[];
  explanation?: string;
  hint?: string;
  speakText?: string;
};

export type TopicQuizExercise = MultipleChoiceExercise | FillBlankExercise;

export type TopicQuizItem =
  | TopicQuizExercise
  | ErrorCorrectionExercise
  | ListeningExercise;

export type TopicContent = {
  topicId: string;
  viewMinutes?: number;
  quizQuestionCount?: number;
  quizFillBlankCount?: number;
  quizOptionCount?: number;
  practiceMixed?: boolean;
  quizIntro?: string;
  lesson: TopicLesson;
  exercises?: TopicExercise[];
  exercisesMultipleChoice?: MultipleChoiceExercise[];
  exercisesFillBlank?: FillBlankExercise[];
  exercisesTrueFalse?: TrueFalseExercise[];
  exercisesMatching?: MatchingExercise[];
  exercisesCrossword?: CrosswordExercise[];
  exercisesListening?: ListeningExercise[];
  quiz?: TopicQuizItem[];
};
