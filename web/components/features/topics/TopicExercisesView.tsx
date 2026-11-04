"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CrosswordExerciseView } from "@/components/features/topics/CrosswordExerciseView";
import { ExerciseTypePicker } from "@/components/features/topics/ExerciseTypePicker";
import { FillBlankExercises } from "@/components/features/topics/FillBlankExercises";
import { ListeningExercises } from "@/components/features/topics/ListeningExercises";
import { MultipleChoiceExercises } from "@/components/features/topics/MultipleChoiceExercises";
import type {
  CrosswordExercise,
  ExerciseType,
  FillBlankExercise,
  ListeningExercise,
  MultipleChoiceExercise,
  TopicExercise,
} from "@/data/topics/types";

type TopicExercisesViewProps = {
  exercises: TopicExercise[];
};

export function TopicExercisesView({ exercises }: TopicExercisesViewProps) {
  const t = useTranslations("Topic");
  const [selectedType, setSelectedType] = useState<ExerciseType | null>(null);

  const counts = useMemo(
    () => ({
      multiple_choice: exercises.filter(
        (item) => item.type === "multiple_choice",
      ).length,
      fill_blank: exercises.filter((item) => item.type === "fill_blank").length,
      crossword: exercises.filter((item) => item.type === "crossword").length,
      listening: exercises.filter((item) => item.type === "listening").length,
    }),
    [exercises],
  );

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-brand-600 dark:text-brand-400">
        {t("noExercises")}
      </p>
    );
  }

  if (!selectedType) {
    return <ExerciseTypePicker counts={counts} onSelect={setSelectedType} />;
  }

  const filtered = exercises.filter((item) => item.type === selectedType);

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setSelectedType(null)}
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("backToTypes")}
      </Button>

      {selectedType === "multiple_choice" ? (
        <MultipleChoiceExercises
          exercises={filtered as MultipleChoiceExercise[]}
        />
      ) : null}

      {selectedType === "fill_blank" ? (
        <FillBlankExercises exercises={filtered as FillBlankExercise[]} />
      ) : null}

      {selectedType === "crossword" ? (
        <CrosswordExerciseView exercises={filtered as CrosswordExercise[]} />
      ) : null}

      {selectedType === "listening" ? (
        <ListeningExercises exercises={filtered as ListeningExercise[]} />
      ) : null}
    </div>
  );
}
