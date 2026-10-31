/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";

export function ThemeToggle() {
  const t = useTranslations("Theme");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-400/70 dark:border-brand-600"
        aria-label={t("toggle")}
        disabled
      />
    );
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-brand-400/70 text-brand-800 transition-colors hover:bg-surface-muted dark:border-brand-600 dark:text-brand-100 dark:hover:bg-brand-900"
      aria-label={t("toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <HiSun className="h-4 w-4" aria-hidden />
      ) : (
        <HiMoon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
