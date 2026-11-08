import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SettingsSectionProps = {
  id?: string;
  titleId: string;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SettingsSection({
  id,
  titleId,
  title,
  description,
  icon,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "dashboard-panel dashboard-panel--stat space-y-5 p-5 sm:space-y-6 sm:p-6",
        className,
      )}
      aria-labelledby={titleId}
    >
      <header className="space-y-2">
        <h2
          id={titleId}
          className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-brand-950 dark:text-brand-100"
        >
          {icon ? (
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
              {icon}
            </span>
          ) : null}
          {title}
        </h2>
        {description ? (
          <div className="space-y-1.5 text-sm text-brand-600 dark:text-brand-400">
            {typeof description === "string" ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
        ) : null}
      </header>
      {children}
    </section>
  );
}
