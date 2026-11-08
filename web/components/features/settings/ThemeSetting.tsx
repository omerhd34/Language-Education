"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Check, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeSetting() {
  const t = useTranslations("Settings");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = mounted && resolvedTheme === "dark";

  const options = [
    {
      id: "light" as const,
      selected: mounted && !isDark,
      title: t("themeLight"),
      icon: <Sun className="size-3.5" aria-hidden />,
    },
    {
      id: "dark" as const,
      selected: isDark,
      title: t("themeDark"),
      icon: <Moon className="size-3.5" aria-hidden />,
    },
  ];

  return (
    <ul className="space-y-2" role="group" aria-label={t("appearance")}>
      {options.map((option) => (
        <li key={option.id}>
          <button
            type="button"
            aria-pressed={option.selected}
            disabled={!mounted}
            onClick={() => setTheme(option.id)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 disabled:cursor-not-allowed disabled:opacity-60",
              option.selected
                ? "border-sky-500/45 bg-sky-500/5 dark:border-sky-400/40 dark:bg-sky-400/10"
                : "border-border bg-background/80 hover:border-sky-500/45 hover:bg-sky-500/5 dark:bg-brand-950/40",
            )}
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-200">
              {option.icon}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-brand-950 dark:text-brand-100">
              {option.title}
            </span>
            <span
              className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                option.selected
                  ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
                  : "bg-brand-100 text-transparent dark:bg-brand-900",
              )}
              aria-hidden
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
