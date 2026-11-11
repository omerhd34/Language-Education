export const instant = false;

import { cookies } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicLessonProgressTracker } from "@/components/features/topics/TopicLessonProgressTracker";
import { TopicLessonView } from "@/components/features/topics/TopicLessonView";
import { TopicGrammarAccessGate } from "@/components/features/topics/TopicGrammarAccessGate";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import { TopicPageHeader } from "@/components/features/topics/TopicPageHeader";
import { dashboardTopics, getDashboardTopicById } from "@/data/dashboardTopics";
import { getTopicContent } from "@/data/topics";
import { redirect } from "@/i18n/navigation";
import {
  PASSED_LEVEL_EXAMS_COOKIE,
  parsePassedLevelExams,
} from "@/lib/levelExamStorage";
import { buildTopicPageMetadata } from "@/lib/server/topicPageMetadata";
import { canAccessLevel, getRequiredLevelToUnlock } from "@/lib/topicAccess";

type PageProps = {
  params: Promise<{ locale: string; topicId: string }>;
};

export function generateStaticParams() {
  return dashboardTopics.map((topic) => ({ topicId: topic.id }));
}

export async function generateMetadata({ params }: PageProps) {
  "use cache";
  const { locale, topicId } = await params;
  return buildTopicPageMetadata(locale, topicId, "lesson");
}

export default async function TopicLessonPage({ params }: PageProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);

  const topic = getDashboardTopicById(topicId);
  if (!topic) {
    notFound();
  }

  if (topic.isExam) {
    redirect({
      href: `/panel/grammer/${topicId}/exercises`,
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
        titleEng={topic.titleEng}
        titleEx={topic.titleEx}
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
        <TopicGrammarAccessGate
          topicId={topic.id}
          lockedKind="topic"
          displayIndex={index}
        >
          <TopicLessonProgressTracker topicId={topic.id} />
          <TopicLessonView lesson={content.lesson} />
        </TopicGrammarAccessGate>
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
