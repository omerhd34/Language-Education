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
        "dashboard-panel dashboard-panel--stat space-y-2 p-5 sm:p-6",
        className,
      )}
      aria-labelledby={titleId}
    >
      <header className="space-y-1">
        <h2
          id={titleId}
          className="section-title inline-flex items-center gap-2"
        >
          {icon ? (
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-(--glass-2) text-sky-700 shadow-[inset_0_0_0_1px_var(--glass-line)] dark:text-sky-300 [&_svg]:size-4">
              {icon}
            </span>
          ) : null}
          {title}
        </h2>
        {description ? (
          <div className="space-y-1 text-sm leading-relaxed text-brand-600 dark:text-brand-400">
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
