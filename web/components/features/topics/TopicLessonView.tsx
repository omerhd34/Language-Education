import { getTranslations } from "next-intl/server";
import { LessonExampleCarousel } from "@/components/features/topics/LessonExampleCarousel";
import type {
  TopicLesson,
  TopicLessonPart,
  TopicLessonSection,
} from "@/data/topics/types";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";

type TopicLessonViewProps = {
  lesson: TopicLesson;
};

function SectionExamples({
  section,
  defaultTitle,
}: {
  section: Pick<
    TopicLessonSection,
    "examples" | "examplesTitle" | "exampleHeaders"
  >;
  defaultTitle: string;
}) {
  if (!section.examples || section.examples.length === 0) {
    return null;
  }

  return (
    <LessonExampleCarousel
      title={section.examplesTitle ?? defaultTitle}
      headers={section.exampleHeaders}
      examples={section.examples}
    />
  );
}

function LessonPart({
  part,
  defaultExamplesTitle,
}: {
  part: TopicLessonPart;
  defaultExamplesTitle: string;
}) {
  const titleEn = getDistinctSecondaryTitle(part.title, part.titleEn);

  return (
    <div
      id={`section-${part.id}`}
      aria-labelledby={`heading-${part.id}`}
      className="scroll-mt-24 space-y-3 border-t border-border pt-4"
    >
      <div className="space-y-1">
        <h3
          id={`heading-${part.id}`}
          className="font-display text-lg font-semibold text-brand-950 dark:text-brand-100"
        >
          {part.title}
        </h3>
        {titleEn ? (
          <p className="text-sm font-medium tracking-wide text-brand-500 italic dark:text-brand-400">
            {titleEn}
          </p>
        ) : null}
      </div>

      {part.paragraphs.length > 0 ? (
        <div className="space-y-3">
          {part.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-sm leading-relaxed text-brand-700 dark:text-brand-300"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <SectionExamples section={part} defaultTitle={defaultExamplesTitle} />
    </div>
  );
}

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
              <nav aria-label={section.title} className="flex flex-wrap gap-2">
                {section.parts.map((part) => (
                  <a
                    key={part.id}
                    href={`#section-${part.id}`}
                    className="inline-flex items-center rounded-md bg-brand-100/70 px-2.5 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-sky-500/15 hover:text-brand-950 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-sky-500/20 dark:hover:text-brand-100"
                  >
                    {part.title}
                  </a>
                ))}
              </nav>
            ) : null}

            {section.parts?.map((part) => (
              <LessonPart
                key={part.id}
                part={part}
                defaultExamplesTitle={t("examples")}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
