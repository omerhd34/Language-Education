type HeroAiBadgeProps = {
  label: string;
  ariaLabel: string;
};

export function HeroAiBadge({ label, ariaLabel }: HeroAiBadgeProps) {
  return (
    <span
      aria-label={ariaLabel}
      title={ariaLabel}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-800 font-sans text-[0.68rem] font-extrabold tracking-[0.14em] text-brand-100 uppercase sm:size-11 sm:text-[0.75rem] dark:bg-brand-400 dark:text-brand-950"
    >
      {label}
    </span>
  );
}
