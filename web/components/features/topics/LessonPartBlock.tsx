import { LessonBoldText } from "@/components/features/topics/LessonBoldText";
import { LessonExampleCarousel } from "@/components/features/topics/LessonExampleCarousel";
import type { TopicLessonPart, TopicLessonSection } from "@/data/grammar/types";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";

function SectionExamples({
  section,
  defaultTitle,
}: {
  section: Pick<TopicLessonSection, "examples" | "examplesTitle">;
  defaultTitle: string;
}) {
  if (!section.examples || section.examples.length === 0) {
    return null;
  }

  return (
    <LessonExampleCarousel
      title={section.examplesTitle ?? defaultTitle}
      examples={section.examples}
    />
  );
}

export function LessonPartBlock({
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
              className="text-md leading-relaxed text-brand-700 dark:text-brand-300"
            >
              <LessonBoldText text={paragraph} />
            </p>
          ))}
        </div>
      ) : null}

      <SectionExamples section={part} defaultTitle={defaultExamplesTitle} />
    </div>
  );
}

export { SectionExamples };
