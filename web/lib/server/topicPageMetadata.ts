import { getTranslations } from "next-intl/server";
import { getDashboardTopicById } from "@/data/dashboardTopics";

export type TopicPageMetadataVariant = "lesson" | "exercises" | "exam";

export async function buildTopicPageMetadata(
  locale: string,
  topicId: string,
  variant: TopicPageMetadataVariant,
) {
  "use cache";

  const t = await getTranslations({ locale, namespace: "Topic" });
  const topic = getDashboardTopicById(topicId);

  switch (variant) {
    case "lesson":
      return {
        title: topic ? t("documentTitle", { title: topic.title }) : t("lesson"),
      };
    case "exercises":
      return {
        title: topic
          ? t("documentTitle", { title: topic.title })
          : t("exercises"),
      };
    case "exam":
      return {
        title: topic
          ? t("examMetaTitle", { title: topic.title })
          : t("topicExamTab"),
      };
  }
}

export async function buildCombinedPageMetadata(locale: string) {
  "use cache";

  const t = await getTranslations({ locale, namespace: "Topic" });
  return {
    title: t("documentTitle", { title: t("combinedExerciseTitle") }),
  };
}
