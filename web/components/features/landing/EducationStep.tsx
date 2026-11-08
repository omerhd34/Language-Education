type EducationStepProps = {
  index: number;
  title: string;
  body: string;
};

export function EducationStep({ index, title, body }: EducationStepProps) {
  const stepLabel = String(index).padStart(2, "0");

  return (
    <li className="grid gap-3 border-t border-border py-8 first:border-t-0 first:pt-0 sm:grid-cols-[4.5rem_1fr] sm:gap-8">
      <span
        aria-hidden="true"
        className="font-display text-sm font-semibold tracking-[0.16em] text-brand-800/70 dark:text-brand-400/70"
      >
        {stepLabel}
      </span>
      <div className="max-w-2xl space-y-2">
        <h3 className="section-title">
          {title}
        </h3>
        <p className="text-sm leading-6 text-brand-600 sm:text-base sm:leading-7 dark:text-brand-400">
          {body}
        </p>
      </div>
    </li>
  );
}
