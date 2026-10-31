export type TopicLessonExample = {
  en: string;
  tr: string;
  note?: string;
};

export type TopicLessonExampleHeaders = {
  en: string;
  tr: string;
};

export type TopicLessonExamplesLayout = "list" | "columns";

export type TopicLessonSection = {
  subtopicId: string;
  title: string;
  paragraphs: string[];
  examples?: TopicLessonExample[];
  examplesTitle?: string;
  examplesLayout?: TopicLessonExamplesLayout;
  examplesPerRow?: 2 | 3 | 4;
  examplesPerColumn?: number;
  exampleHeaders?: TopicLessonExampleHeaders;
};

export type TopicLesson = {
  intro: string;
  sections: TopicLessonSection[];
};

export type MultipleChoiceExercise = {
  id: string;
  subtopicId: string;
  type: "multiple_choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type TopicExercise = MultipleChoiceExercise;

export type TopicContent = {
  topicId: string;
  lesson: TopicLesson;
  exercises: TopicExercise[];
};
