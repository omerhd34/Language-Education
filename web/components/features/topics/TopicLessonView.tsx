import { getTranslations } from "next-intl/server";
import { LessonSpeakButton } from "@/components/features/topics/LessonSpeakButton";
import type {
  TopicLesson,
  TopicLessonExample,
  TopicLessonExampleHeaders,
  TopicLessonSection,
} from "@/data/topics/types";
import { getDistinctSecondaryTitle } from "@/lib/bilingualTitle";

type TopicLessonViewProps = {
  lesson: TopicLesson;
};

function toColumnMajorRows<T>(
  items: T[],
  columnCount: number,
  rowCount: number,
): Array<Array<T | undefined>> {
  const rows: Array<Array<T | undefined>> = Array.from(
    { length: rowCount },
    () => Array.from({ length: columnCount }, () => undefined),
  );

  items.forEach((item, index) => {
    const column = Math.floor(index / rowCount);
    const row = index % rowCount;
    if (column < columnCount) {
      rows[row][column] = item;
    }
  });

  return rows;
}

function resolveColumnLayout(
  itemCount: number,
  examplesPerRow: number | undefined,
  examplesPerColumn: number | undefined,
): { columnCount: number; rowCount: number } {
  if (examplesPerColumn != null && examplesPerColumn > 0) {
    const rowCount = examplesPerColumn;
    const columnCount = Math.max(1, Math.ceil(itemCount / rowCount));
    return { columnCount, rowCount };
  }

  const columnCount = examplesPerRow ?? 2;
  const rowCount = Math.max(1, Math.ceil(itemCount / columnCount));
  return { columnCount, rowCount };
}

function ExampleCells({
  example,
  withDivider = false,
}: {
  example: TopicLessonExample;
  withDivider?: boolean;
}) {
  return (
    <>
      <td className="px-3 py-2.5">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-950 dark:text-brand-100">
          {example.en}
          <LessonSpeakButton text={example.en} />
        </span>
      </td>
      <td
        className={`px-3 py-2.5 text-sm text-brand-600 dark:text-brand-300 ${
          withDivider ? "border-r border-border" : ""
        }`}
      >
        <span className="inline-flex items-center gap-1">
          <span>{example.tr}</span>
          {example.speakTr ? <LessonSpeakButton text={example.tr} /> : null}
        </span>
        {example.note ? (
          <span className="mt-0.5 block text-xs text-brand-400">
            {example.note}
          </span>
        ) : null}
      </td>
    </>
  );
}

function HeaderPair({
  headers,
  withDivider = false,
}: {
  headers: TopicLessonExampleHeaders;
  withDivider?: boolean;
}) {
  return (
    <>
      <th className="px-3 py-2 text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
        {headers.en}
      </th>
      <th
        className={`px-3 py-2 text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400 ${
          withDivider ? "border-r border-border" : ""
        }`}
      >
        {headers.tr}
      </th>
    </>
  );
}

function EmptyPair({ withDivider = false }: { withDivider?: boolean }) {
  return (
    <>
      <td className="px-3 py-2.5" />
      <td
        className={`px-3 py-2.5 ${withDivider ? "border-r border-border" : ""}`}
      />
    </>
  );
}

function ColumnsExamplesTable({
  examples,
  headers,
  columnCount,
  rowCount,
}: {
  examples: TopicLessonExample[];
  headers: TopicLessonExampleHeaders;
  columnCount: number;
  rowCount: number;
}) {
  const rows = toColumnMajorRows(examples, columnCount, rowCount);
  const columnIndexes = Array.from(
    { length: columnCount },
    (_, index) => index,
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[20rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-brand-50/80 dark:bg-brand-950/60">
            {columnIndexes.map((index) => (
              <HeaderPair
                key={index}
                headers={headers}
                withDivider={index < columnCount - 1}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background/60 dark:bg-brand-950/40">
          {rows.map((row, rowIndex) => (
            <tr
              key={row.map((item) => item?.en ?? `empty-${rowIndex}`).join("-")}
            >
              {columnIndexes.map((index) => {
                const example = row[index];
                const withDivider = index < columnCount - 1;
                if (!example) {
                  return (
                    <EmptyPair
                      key={`empty-${rowIndex}-${index}`}
                      withDivider={withDivider}
                    />
                  );
                }
                return (
                  <ExampleCells
                    key={example.en}
                    example={example}
                    withDivider={withDivider}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListExamples({
  examples,
  headers,
}: {
  examples: TopicLessonExample[];
  headers?: TopicLessonExampleHeaders;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {headers ? (
        <div className="grid grid-cols-[1fr_1fr] gap-4 border-b border-border bg-brand-50/80 px-3 py-2 dark:bg-brand-950/60">
          <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
            {headers.en}
          </p>
          <p className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
            {headers.tr}
          </p>
        </div>
      ) : null}
      <ul className="divide-y divide-border">
        {examples.map((example) => (
          <li
            key={`${example.en}-${example.tr}`}
            className="grid gap-1 bg-background/60 px-3 py-2.5 sm:grid-cols-[1fr_1fr] sm:gap-4 dark:bg-brand-950/40"
          >
            <p className="inline-flex items-center gap-1 text-sm font-medium text-brand-950 dark:text-brand-100">
              {example.en}
              <LessonSpeakButton text={example.en} />
            </p>
            <div>
              <p className="inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-300">
                <span>{example.tr}</span>
                {example.speakTr ? <LessonSpeakButton text={example.tr} /> : null}
              </p>
              {example.note ? (
                <p className="mt-0.5 text-xs text-brand-400">{example.note}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionExamples({
  section,
  defaultTitle,
}: {
  section: TopicLessonSection;
  defaultTitle: string;
}) {
  if (!section.examples || section.examples.length === 0) {
    return null;
  }

  const title = section.examplesTitle ?? defaultTitle;
  const headers = section.exampleHeaders;
  const { columnCount, rowCount } = resolveColumnLayout(
    section.examples.length,
    section.examplesPerRow,
    section.examplesPerColumn,
  );

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold tracking-wide text-brand-500 uppercase dark:text-brand-400">
        {title}
      </h3>
      {section.examplesLayout === "columns" && headers ? (
        <ColumnsExamplesTable
          examples={section.examples}
          headers={headers}
          columnCount={columnCount}
          rowCount={rowCount}
        />
      ) : (
        <ListExamples examples={section.examples} headers={headers} />
      )}
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
          </section>
        );
      })}
    </div>
  );
}
