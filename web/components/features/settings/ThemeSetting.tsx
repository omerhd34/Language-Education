"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
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

  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="group"
      aria-label={t("appearance")}
    >
      <button
        type="button"
        aria-pressed={mounted && !isDark}
        disabled={!mounted}
        onClick={() => setTheme("light")}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          mounted && !isDark
            ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
            : "bg-brand-100 text-brand-800 hover:bg-sky-500/15 hover:text-sky-800 dark:bg-brand-900 dark:text-brand-200 dark:hover:bg-sky-400/20 dark:hover:text-sky-100",
        )}
      >
        <Sun className="size-3.5" aria-hidden />
        {t("themeLight")}
      </button>
      <button
        type="button"
        aria-pressed={isDark}
        disabled={!mounted}
        onClick={() => setTheme("dark")}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          isDark
            ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-sky-950"
            : "bg-brand-100 text-brand-800 hover:bg-sky-500/15 hover:text-sky-800 dark:bg-brand-900 dark:text-brand-200 dark:hover:bg-sky-400/20 dark:hover:text-sky-100",
        )}
      >
        <Moon className="size-3.5" aria-hidden />
        {t("themeDark")}
      </button>
    </div>
  );
}
