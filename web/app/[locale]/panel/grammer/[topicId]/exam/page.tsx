export const instant = false;
import { cookies } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { TopicContentMissing } from "@/components/features/topics/TopicContentMissing";
import { TopicExamView } from "@/components/features/topics/TopicExamView";
import { TopicGrammarAccessGate } from "@/components/features/topics/TopicGrammarAccessGate";
import { TopicLevelLocked } from "@/components/features/topics/TopicLevelLocked";
import { TopicPageHeader } from "@/components/features/topics/TopicPageHeader";
import { dashboardTopics, getDashboardTopicById } from "@/data/grammar/dashboardTopics";
import { getTopicContent } from "@/data/grammar";
import {
  PASSED_LEVEL_EXAMS_COOKIE,
  parsePassedLevelExams,
} from "@/lib/levelExamStorage";
import {
  resolveMixedTopicQuiz,
  resolveTopicErrorCorrectionQuiz,
  resolveTopicListeningQuiz,
  resolveTopicExamCrosswords,
  resolveTopicExamExercises,
  resolveTopicExamFillBlanks,
  topicQuizUsesErrorCorrectionFormat,
  topicQuizUsesListeningFormat,
  topicQuizUsesMixedFormat,
} from "@/lib/topicExam";
import { canAccessLevel, getRequiredLevelToUnlock } from "@/lib/topicAccess";

type PageProps = {
  params: Promise<{ locale: string; topicId: string }>;
};

export function generateStaticParams() {
  return dashboardTopics
    .filter((topic) => !topic.isExam)
    .map((topic) => ({ topicId: topic.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, topicId } = await params;
  const t = await getTranslations({ locale, namespace: "Topic" });
  const topic = getDashboardTopicById(topicId);

  return {
    title: topic
      ? t("examMetaTitle", { title: topic.title })
      : t("topicExamTab"),
  };
}

export default async function TopicExamPage({ params }: PageProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);

  const topic = getDashboardTopicById(topicId);
  if (!topic || topic.isExam) {
    notFound();
  }

  const content = getTopicContent(topicId);
  const regularTopics = dashboardTopics.filter(
    (item) => item.level === topic.level && !item.isExam,
  );
  const index = regularTopics.findIndex((item) => item.id === topicId) + 1;

  const cookieStore = await cookies();
  const passedExams = parsePassedLevelExams(
    cookieStore.get(PASSED_LEVEL_EXAMS_COOKIE)?.value,
  );
  const unlocked = canAccessLevel(topic.level, passedExams);
  const requiredLevel = getRequiredLevelToUnlock(topic.level);
  const listeningQuiz =
    content && topicQuizUsesListeningFormat(content)
      ? resolveTopicListeningQuiz(content)
      : [];
  const errorCorrectionQuiz =
    content &&
    listeningQuiz.length === 0 &&
    topicQuizUsesErrorCorrectionFormat(content)
      ? resolveTopicErrorCorrectionQuiz(content)
      : [];
  const mixedQuiz =
    content &&
    listeningQuiz.length === 0 &&
    errorCorrectionQuiz.length === 0 &&
    topicQuizUsesMixedFormat(content)
      ? resolveMixedTopicQuiz(content)
      : [];
  const quizExercises =
    content &&
    listeningQuiz.length === 0 &&
    mixedQuiz.length === 0 &&
    errorCorrectionQuiz.length === 0
      ? resolveTopicExamExercises(content)
      : [];
  const examFillBlanks =
    content &&
    listeningQuiz.length === 0 &&
    mixedQuiz.length === 0 &&
    errorCorrectionQuiz.length === 0
      ? resolveTopicExamFillBlanks(content)
      : [];
  const examCrosswords = content ? resolveTopicExamCrosswords(content) : [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <TopicPageHeader
        topicId={topic.id}
        title={topic.title}
        titleEng={topic.titleEng}
        titleEx={topic.titleEx}
        level={topic.level}
        index={index}
        activeTab="exam"
      />
      {!unlocked && requiredLevel ? (
        <TopicLevelLocked level={topic.level} requiredLevel={requiredLevel} />
      ) : content &&
        (listeningQuiz.length > 0 ||
          errorCorrectionQuiz.length > 0 ||
          mixedQuiz.length > 0 ||
          quizExercises.length > 0 ||
          examFillBlanks.length > 0 ||
          examCrosswords.length > 0) ? (
        <TopicGrammarAccessGate
          topicId={topic.id}
          lockedKind="topic"
          displayIndex={index}
        >
          <TopicExamView
            topicId={topic.id}
            multipleChoice={quizExercises}
            fillBlanks={examFillBlanks}
            crosswords={examCrosswords}
            mixedQuiz={mixedQuiz}
            listeningQuiz={listeningQuiz}
            errorCorrectionQuiz={errorCorrectionQuiz}
            quizIntro={content.quizIntro}
          />
        </TopicGrammarAccessGate>
      ) : (
        <TopicContentMissing />
      )}
    </div>
  );
}
