import { cn } from "@/lib/utils";

export const readingExamButtonClass = cn(
  "border-0 bg-red-100! text-red-950! shadow-none!",
  "hover:bg-red-200! hover:shadow-none!",
  "[box-shadow:inset_0_1px_0_rgb(255_255_255/70%),inset_0_0_0_1px_rgb(248_113_113/40%),0_0_0_1px_rgb(220_38_38/18%)]!",
  "dark:bg-red-950/70! dark:text-red-100! dark:hover:bg-red-900/80!",
);

export const readingExamPanelClass = cn(
  "rounded-2xl border-0 bg-red-100/90 p-4 sm:p-6",
  "shadow-[inset_0_1px_0_rgb(255_255_255/70%),inset_0_0_0_1px_rgb(248_113_113/34%),0_0_0_1px_rgb(220_38_38/14%),var(--glass-shadow)]",
  "dark:bg-red-950/55",
);

export const readingExamTabActiveClass =
  "border-red-500 text-red-900 dark:border-red-400 dark:text-red-100";
