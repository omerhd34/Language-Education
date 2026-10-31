const LEVELS = ["0", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

type HeroLevelPathProps = {
  label: string;
  caption: string;
};

export function HeroLevelPath({ label, caption }: HeroLevelPathProps) {
  return (
    <div className="border-t border-border/70 pt-7">
      <p className="text-xs font-semibold tracking-[0.16em] text-brand-800/70 uppercase dark:text-brand-400/70">
        {label}
      </p>

      <ol className="mt-4 flex w-full flex-wrap items-center gap-y-3 sm:flex-nowrap">
        {LEVELS.map((level, index) => (
          <li key={level} className="contents">
            <span className="shrink-0 font-display text-2xl font-semibold tracking-tight text-brand-950 sm:text-4xl lg:text-5xl dark:text-brand-100">
              {level}
            </span>
            {index < LEVELS.length - 1 ? (
              <span
                aria-hidden="true"
                className="mx-2 hidden h-px min-w-4 flex-1 bg-brand-400/70 sm:mx-3 sm:block lg:mx-4 dark:bg-brand-600"
              />
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-4 max-w-4xl text-sm leading-6 text-brand-600 dark:text-brand-400">
        {caption}
      </p>
    </div>
  );
}
