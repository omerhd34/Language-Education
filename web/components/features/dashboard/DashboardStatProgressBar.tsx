import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardStatProgressBarProps = {
  value: number;
  max: number;
  ariaLabel: string;
  className?: string;
  fillVariant?: "default" | "warning";
  /** Yüzde metnini çubuk içinde sağda gösterir (daha yüksek track). */
  inlinePercent?: boolean;
  /** Çubuk içinde sağda özel etiket (inlinePercent ile birlikte kullanılmaz). */
  inlineEndLabel?: ReactNode;
};

function progressPercent(value: number, max: number): number {
  if (max <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((value / max) * 100));
}

export function DashboardStatProgressBar({
  value,
  max,
  ariaLabel,
  className,
  fillVariant = "default",
  inlinePercent = false,
  inlineEndLabel,
}: DashboardStatProgressBarProps) {
  const percent = progressPercent(value, max);
  const inlineTrack = inlinePercent || inlineEndLabel != null;

  const fillClass = cn(
    "rounded-full transition-[width] duration-300 ease-out",
    percent > 0 && percent < 100 && "min-w-1",
    fillVariant === "warning"
      ? "bg-amber-500"
      : "bg-brand-800 dark:bg-brand-100",
  );

  const trackClass = cn(
    "mt-3 overflow-hidden rounded-full",
    "bg-brand-950/8 shadow-[inset_0_0_0_1px_var(--glass-line-2)]",
    "dark:bg-white/10 dark:shadow-[inset_0_0_0_1px_var(--glass-line-2)]",
    inlineTrack ? "relative h-6" : "h-2.5",
    className,
  );

  if (inlineTrack) {
    return (
      <div
        className={trackClass}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
      >
        <div
          aria-hidden
          className={cn("absolute inset-y-0 left-0", fillClass)}
          style={{ width: `${percent}%` }}
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pl-8 pr-3 font-display text-xs font-semibold tracking-tight text-brand-950 tabular-nums dark:text-brand-100">
          {inlineEndLabel ?? `%${percent}`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={trackClass}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <div
        className={cn("h-full", fillClass)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
