import { Fragment } from "react";

const BOLD_SEGMENT = /\*\*([^*]+)\*\*/;

export function LessonBoldText({ text }: { text: string }) {
  const parts = text.split(BOLD_SEGMENT);

  if (parts.length === 1) {
    return text;
  }

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <strong
              key={index}
              className="font-semibold text-brand-950 dark:text-brand-100"
            >
              {part}
            </strong>
          );
        }
        if (!part) {
          return null;
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
