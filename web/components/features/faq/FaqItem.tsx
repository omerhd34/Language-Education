type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group border-t border-border py-5 first:border-t-0 first:pt-0">
      <summary className="cursor-pointer list-none font-display text-lg font-semibold tracking-tight text-brand-950 marker:content-none [&::-webkit-details-marker]:hidden dark:text-brand-100">
        <span className="flex items-start justify-between gap-4">
          {question}
          <span
            aria-hidden="true"
            className="mt-1 text-brand-600 transition-transform duration-200 group-open:rotate-45 dark:text-brand-400"
          >
            +
          </span>
        </span>
      </summary>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-600 sm:text-base sm:leading-7 dark:text-brand-400">
        {answer}
      </p>
    </details>
  );
}
