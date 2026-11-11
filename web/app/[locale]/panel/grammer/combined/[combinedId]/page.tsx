import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CombinedExerciseHeader } from "@/components/features/topics/CombinedExerciseHeader";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicExercisesView } from "@/components/features/topics/TopicExercisesView";
import { TopicGrammarAccessGate } from "@/components/features/topics/TopicGrammarAccessGate";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import {
  combinedExerciseStorageId,
  getAllCombinedExercises,
  getCombinedExerciseById,
  getCombinedExerciseQuestions,
} from "@/data/combinedExercises";
import {
  PASSED_LEVEL_EXAMS_COOKIE,
  parsePassedLevelExams,
} from "@/lib/levelExamStorage";
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
  const cookieStore = await cookies();
  const passedExams = parsePassedLevelExams(
    cookieStore.get(PASSED_LEVEL_EXAMS_COOKIE)?.value,
  );
  const unlocked = canAccessLevel(combined.level, passedExams);
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
        <TopicGrammarAccessGate
          combinedId={combined.id}
          lockedKind="combined"
          displayIndex={combined.index}
        >
          <TopicExercisesView
            topicId={combinedExerciseStorageId(combined.id)}
            exercises={exercises}
          />
        </TopicGrammarAccessGate>
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
