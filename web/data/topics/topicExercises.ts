import type {
  FillBlankExercise,
  MatchingExercise,
  MultipleChoiceExercise,
  TopicContent,
  TopicExercise,
  TrueFalseExercise,
} from "@/data/topics/types";

export function getTopicPracticeExercises(
  content: TopicContent,
): TopicExercise[] {
  if (content.exercises && content.exercises.length > 0) {
    return [...content.exercises];
  }

  const merged: TopicExercise[] = [];
  if (content.exercisesMultipleChoice?.length) {
    merged.push(...content.exercisesMultipleChoice);
  }
  if (content.exercisesFillBlank?.length) {
    merged.push(...content.exercisesFillBlank);
  }
  if (content.exercisesTrueFalse?.length) {
    merged.push(...content.exercisesTrueFalse);
  }
  if (content.exercisesMatching?.length) {
    merged.push(...content.exercisesMatching);
  }
  if (content.exercisesCrossword?.length) {
    merged.push(...content.exercisesCrossword);
  }
  if (content.exercisesListening?.length) {
    merged.push(...content.exercisesListening);
  }
  return merged;
}

export function getTopicMultipleChoice(
  content: TopicContent,
): MultipleChoiceExercise[] {
  if (content.exercisesMultipleChoice?.length) {
    return content.exercisesMultipleChoice;
  }
  return getTopicPracticeExercises(content).filter(
    (item): item is MultipleChoiceExercise => item.type === "multiple_choice",
  );
}

export function getTopicFillBlank(content: TopicContent): FillBlankExercise[] {
  if (content.exercisesFillBlank?.length) {
    return content.exercisesFillBlank;
  }
  return getTopicPracticeExercises(content).filter(
    (item): item is FillBlankExercise => item.type === "fill_blank",
  );
}

export function getTopicTrueFalse(content: TopicContent): TrueFalseExercise[] {
  if (content.exercisesTrueFalse?.length) {
    return content.exercisesTrueFalse;
  }
  return getTopicPracticeExercises(content).filter(
    (item): item is TrueFalseExercise => item.type === "true_false",
  );
}

export function getTopicMatching(content: TopicContent): MatchingExercise[] {
  if (content.exercisesMatching?.length) {
    return content.exercisesMatching;
  }
  return getTopicPracticeExercises(content).filter(
    (item): item is MatchingExercise => item.type === "matching",
  );
}
