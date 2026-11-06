import { getTranslations } from "next-intl/server";
import {
  LessonPartBlock,
  SectionExamples,
} from "@/components/features/topics/LessonPartBlock";
import { LessonSoundParts } from "@/components/features/topics/LessonSoundParts";
import type { TopicLesson } from "@/data/topics/types";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";

type TopicLessonViewProps = {
  lesson: TopicLesson;
};

export async function TopicLessonView({ lesson }: TopicLessonViewProps) {
  const t = await getTranslations("Topic");

  return (
    <div className="space-y-8">
      <p className="text-base leading-relaxed text-brand-700 dark:text-brand-300">
        {lesson.intro}
      </p>

      {lesson.sections.map((section) => {
        const titleEn = getDistinctSecondaryTitle(
          section.title,
          section.titleEn,
        );

        return (
          <section
            key={section.subtopicId}
            id={`section-${section.subtopicId}`}
            aria-labelledby={`heading-${section.subtopicId}`}
            className="dashboard-panel scroll-mt-24 space-y-4"
          >
            <div className="space-y-1">
              <h2
                id={`heading-${section.subtopicId}`}
                className="font-display text-xl font-semibold text-brand-950 dark:text-brand-100"
              >
                {section.title}
              </h2>
              {titleEn ? (
                <p className="text-sm font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
                  {titleEn}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-brand-700 dark:text-brand-300"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <SectionExamples section={section} defaultTitle={t("examples")} />

            {section.parts && section.parts.length >= 4 ? (
              <LessonSoundParts
                parts={section.parts}
                defaultExamplesTitle={t("examples")}
              />
            ) : (
              section.parts?.map((part) => (
                <LessonPartBlock
                  key={part.id}
                  part={part}
                  defaultExamplesTitle={t("examples")}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
