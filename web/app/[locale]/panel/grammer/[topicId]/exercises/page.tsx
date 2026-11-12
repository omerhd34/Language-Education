export const instant = false;

import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicExercisesView } from "@/components/features/topics/TopicExercisesView";
import { TopicGrammarAccessGate } from "@/components/features/topics/TopicGrammarAccessGate";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import { TopicPageHeader } from "@/components/features/topics/TopicPageHeader";
import { dashboardTopics, getDashboardTopicById } from "@/data/dashboardTopics";
import { getTopicContent } from "@/data/topics";
import { getTopicPracticeExercises } from "@/data/topics/topicExercises";
import {
  PASSED_LEVEL_EXAMS_COOKIE,
  parsePassedLevelExams,
} from "@/lib/levelExamStorage";
import { canAccessLevel, getRequiredLevelToUnlock } from "@/lib/topicAccess";

type PageProps = {
  params: Promise<{ locale: string; topicId: string }>;
};

export function generateStaticParams() {
  return dashboardTopics.map((topic) => ({ topicId: topic.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, topicId } = await params;
  const t = await getTranslations({ locale, namespace: "Topic" });
  const topic = getDashboardTopicById(topicId);

  return {
    title: topic ? t("documentTitle", { title: topic.title }) : t("exercises"),
  };
}

export default async function TopicExercisesPage({ params }: PageProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);

  const topic = getDashboardTopicById(topicId);
  if (!topic) {
    notFound();
  }

  const content = getTopicContent(topicId);
  const regularTopics = dashboardTopics.filter(
    (item) => item.level === topic.level && !item.isExam,
  );
  const index = topic.isExam
    ? regularTopics.length + 1
    : regularTopics.findIndex((item) => item.id === topicId) + 1;

  const cookieStore = await cookies();
  const passedExams = parsePassedLevelExams(
    cookieStore.get(PASSED_LEVEL_EXAMS_COOKIE)?.value,
  );
  const unlocked = canAccessLevel(topic.level, passedExams);
  const requiredLevel = getRequiredLevelToUnlock(topic.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <TopicPageHeader
        topicId={topic.id}
        title={topic.title}
        titleEng={topic.titleEng}
        titleEx={topic.titleEx}
        level={topic.level}
        index={index}
        activeTab="exercises"
        isExam={Boolean(topic.isExam)}
      />
      {!unlocked && requiredLevel ? (
        <TopicLevelLocked level={topic.level} requiredLevel={requiredLevel} />
      ) : content ? (
        <TopicGrammarAccessGate
          topicId={topic.id}
          lockedKind={topic.isExam ? "levelExam" : "topic"}
          displayIndex={topic.isExam ? undefined : index}
        >
          <TopicExercisesView
            topicId={topic.id}
            exercises={getTopicPracticeExercises(content)}
            isExam={Boolean(topic.isExam)}
            level={topic.level}
          />
        </TopicGrammarAccessGate>
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
