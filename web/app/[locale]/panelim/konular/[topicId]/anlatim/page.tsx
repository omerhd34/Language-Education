import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicLessonProgressTracker } from "@/components/features/topics/TopicLessonProgressTracker";
import { TopicLessonView } from "@/components/features/topics/TopicLessonView";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import { TopicPageHeader } from "@/components/features/topics/TopicPageHeader";
import {
  dashboardTopics,
  getDashboardTopicById,
  getTopicTitleEn,
} from "@/data/dashboardTopics";
import { getTopicContent } from "@/data/topics";
import { redirect } from "@/i18n/navigation";
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
    title: topic ? t("documentTitle", { title: topic.title }) : t("lesson"),
  };
}

export default async function TopicLessonPage({ params }: PageProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);

  const topic = getDashboardTopicById(topicId);
  if (!topic) {
    notFound();
  }

  // Yeterlilik sınavında anlatım/konu sekmesi yok — doğrudan sınava yönlendir.
  if (topic.isExam) {
    redirect({
      href: `/panelim/konular/${topicId}/alistirmalar`,
      locale,
    });
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
        titleEn={getTopicTitleEn(topic.id, topic.title)}
        level={topic.level}
        index={index}
        activeTab="lesson"
        isExam={Boolean(topic.isExam)}
        sections={
          content?.lesson.sections.map((section) => ({
            id: section.subtopicId,
            title: section.title,
          })) ?? []
        }
      />
      {!unlocked && requiredLevel ? (
        <TopicLevelLocked level={topic.level} requiredLevel={requiredLevel} />
      ) : content ? (
        <>
          <TopicLessonProgressTracker topicId={topic.id} />
          <TopicLessonView lesson={content.lesson} />
        </>
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
