import { cn } from "@/lib/utils";

type DashboardStatProgressBarProps = {
  value: number;
  max: number;
  ariaLabel: string;
  className?: string;
  fillVariant?: "default" | "warning";
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
}: DashboardStatProgressBarProps) {
  const percent = progressPercent(value, max);

  return (
    <div
      className={cn(
        "mt-3 h-2.5 overflow-hidden rounded-full",
        "bg-brand-950/8 shadow-[inset_0_0_0_1px_var(--glass-line-2)]",
        "dark:bg-white/10 dark:shadow-[inset_0_0_0_1px_var(--glass-line-2)]",
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300 ease-out",
          percent > 0 && percent < 100 && "min-w-1",
          fillVariant === "warning"
            ? "bg-amber-500"
            : "bg-brand-800 dark:bg-brand-100",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
