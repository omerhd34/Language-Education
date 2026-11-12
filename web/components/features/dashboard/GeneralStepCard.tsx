import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type GeneralStepCardProps = {
  index: number;
  title: string;
  body: string;
  icon: LucideIcon;
  className?: string;
};

export function GeneralStepCard({
  index,
  title,
  body,
  icon: Icon,
  className,
}: GeneralStepCardProps) {
  const stepLabel = String(index).padStart(2, "0");

  return (
    <li
      className={cn(
        "relative flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/30 p-5 shadow-sm",
        "dark:border-border/40 dark:bg-background/20",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="font-display text-xs font-semibold tracking-[0.2em] text-brand-800/60 dark:text-brand-400/60"
          aria-hidden
        >
          {stepLabel}
        </span>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15"
          aria-hidden
        >
          <Icon className="size-[18px]" strokeWidth={1.75} />
        </span>
      </div>
      <div className="space-y-1.5">
        <h3 className="section-title text-base">{title}</h3>
        <p className="text-sm leading-6 text-brand-600 dark:text-brand-400">
          {body}
        </p>
      </div>
    </li>
  );
}
