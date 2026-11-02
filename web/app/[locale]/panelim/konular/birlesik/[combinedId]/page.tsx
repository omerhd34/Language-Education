import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CombinedExerciseHeader } from "@/components/features/topics/CombinedExerciseHeader";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicExercisesView } from "@/components/features/topics/TopicExercisesView";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import {
  getAllCombinedExercises,
  getCombinedExerciseById,
  getCombinedExerciseQuestions,
} from "@/data/combinedExercises";
import { canAccessLevel, getRequiredLevelToUnlock } from "@/lib/topicAccess";

type PageProps = {
  params: Promise<{ locale: string; combinedId: string }>;
};

export function generateStaticParams() {
  return getAllCombinedExercises().map((combined) => ({
    combinedId: combined.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, combinedId } = await params;
  const t = await getTranslations({ locale, namespace: "Topic" });
  const combined = getCombinedExerciseById(combinedId);

  return {
    title: combined
      ? t("documentTitle", { title: t("combinedExerciseTitle") })
      : t("combinedExerciseTitle"),
  };
}

export default async function CombinedExercisePage({ params }: PageProps) {
  const { locale, combinedId } = await params;
  setRequestLocale(locale);

  const combined = getCombinedExerciseById(combinedId);
  if (!combined) {
    notFound();
  }

  const exercises = getCombinedExerciseQuestions(combined);
  const unlocked = canAccessLevel(combined.level);
  const requiredLevel = getRequiredLevelToUnlock(combined.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <CombinedExerciseHeader combined={combined} />
      {!unlocked && requiredLevel ? (
        <TopicLevelLocked
          level={combined.level}
          requiredLevel={requiredLevel}
        />
      ) : exercises.length > 0 ? (
        <TopicExercisesView exercises={exercises} />
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
