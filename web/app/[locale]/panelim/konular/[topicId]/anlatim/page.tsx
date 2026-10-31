import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicLessonView } from "@/components/features/topics/TopicLessonView";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import { TopicPageHeader } from "@/components/features/topics/TopicPageHeader";
import { dashboardTopics, getDashboardTopicById } from "@/data/dashboardTopics";
import { getTopicContent } from "@/data/topics";
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

  const content = getTopicContent(topicId);
  const index = dashboardTopics.findIndex((item) => item.id === topicId) + 1;
  const unlocked = canAccessLevel(topic.level);
  const requiredLevel = getRequiredLevelToUnlock(topic.level);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <TopicPageHeader
        topicId={topic.id}
        title={topic.title}
        level={topic.level}
        index={index}
        activeTab="lesson"
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
        <TopicLessonView lesson={content.lesson} />
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
